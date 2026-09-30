import { NextRequest } from "next/server";
import { commerceEnabled } from "@/lib/launch";
import { createCart, addCartLine, updateCartLine, removeCartLine, getCart, getAllProducts } from "@/lib/data";
import { cartResponse, json, sameOrigin, sessionId } from "@/lib/cart-session";
export const dynamic = "force-dynamic";
const closed = () => json({error:"Our store is not accepting orders yet."},503);
function quantity(value:unknown):value is number { return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 99; }
async function body(req:NextRequest):Promise<Record<string,unknown>|null> {try { const b = await req.json(); return b && typeof b === "object" && !Array.isArray(b) ? b : null; } catch {return null;} }
const failure = (error:unknown) => json({error:error instanceof Error ? error.message : "Please try again."},400);
async function validCartLines(lines:{variantId:string;productHandle:string}[]) {
 const catalog=await getAllProducts();
 const product=catalog[0];
 return Boolean(product && lines.every(line=>line.productHandle===product.handle && product.variants.some(v=>v.id===line.variantId && v.available && v.price.amount>0)));
}
export async function GET(req:NextRequest) {
 if (!commerceEnabled()) return closed();
 const id = sessionId(req); if (!id) return json(null);
 try { const cart=await getCart(id); return cartResponse(cart && await validCartLines(cart.lines) ? cart : undefined,req); } catch {return json({error:"Your bag could not be loaded. Please try again."},502);}
}
export async function POST(req:NextRequest) {
 if (!commerceEnabled()) return closed(); if (!sameOrigin(req)) return json({error:"Invalid request origin."},403);
 const b = await body(req); if (!b) return json({error:"Invalid request."},400);
 const variantId=b.variantId, amount=b.quantity ?? 1;
 if (typeof variantId !== "string" || !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(variantId) || !quantity(amount)) return json({error:"Choose a valid variant and quantity (1–99)."},400);
 try {
  const catalog = await getAllProducts();
  if (!catalog.some(p=>p.variants.some(v=>v.id===variantId && v.available && v.price.amount > 0))) return json({error:"This option is unavailable. Please choose another."},400);
  const id=sessionId(req); const existing=id ? await getCart(id) : undefined;
  if (existing?.lines.length && !await validCartLines(existing.lines)) return json({error:"Your bag contains an unavailable item. Clear it and try again."},409);
  const existingQuantity=existing?.lines.filter(l=>l.variantId===variantId).reduce((n,l)=>n+l.quantity,0) || 0;
  if (existingQuantity+amount>99) return json({error:"The maximum quantity for this item is 99."},400);
  const cart=existing ? await addCartLine(existing.id,variantId,amount) : await createCart(variantId,amount);
  return cartResponse(cart,req);
 } catch(e) {return failure(e);}
}
async function edit(req:NextRequest,remove:boolean) {
 if (!commerceEnabled()) return closed(); if (!sameOrigin(req)) return json({error:"Invalid request origin."},403);
 const b=await body(req),id=sessionId(req);
 if (!id || !b || typeof b.lineId!=="string" || (!remove && !quantity(b.quantity))) return json({error:"Invalid cart item or quantity."},400);
 try {
  const existing=await getCart(id);
  if (existing?.lines.length && !await validCartLines(existing.lines)) return json({error:"Your bag contains an unavailable item. Clear it and try again."},409);
  if (!existing?.lines.some(l=>l.id===b.lineId)) return json({error:"Your bag has changed. Please refresh."},409);
  const cart=remove ? await removeCartLine(id,b.lineId) : await updateCartLine(id,b.lineId,b.quantity as number);
  return cartResponse(cart,req);
 } catch(e){return failure(e);}
}
export const PATCH = (req:NextRequest) => edit(req,false);
export const DELETE = (req:NextRequest) => edit(req,true);
