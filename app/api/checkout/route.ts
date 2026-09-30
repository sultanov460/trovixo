import { NextRequest } from "next/server";
import { commerceEnabled } from "@/lib/launch";
import { getCart, getAllProducts } from "@/lib/data";
import { sessionId, sameOrigin, json } from "@/lib/cart-session";
export async function POST(req:NextRequest) {
 if (!commerceEnabled()) return json({error:"Our store is not accepting orders yet."},503);
 if (!sameOrigin(req)) return json({error:"Invalid request origin."},403);
 const id=sessionId(req); if(!id) return json({error:"Your bag is empty."},400);
 try {
  const cart=await getCart(id);
  if (!cart?.lines.length) return json({error:"Your bag has expired or is empty. Please add your item again."},409);
  const product=(await getAllProducts())[0];
  if (!product || !cart.lines.every(line=>line.productHandle===product.handle && product.variants.some(v=>v.id===line.variantId && v.available && v.price.amount>0))) return json({error:"A bag item is no longer available. Please start a new bag."},409);
  const url=new URL(cart.checkoutUrl);
  if (url.protocol!=="https:") throw new Error("Invalid checkout URL");
  return json({checkoutUrl:url.href});
 } catch {return json({error:"Checkout is temporarily unavailable. Your bag is saved; please try again."},502);}
}
