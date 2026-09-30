import { NextRequest, NextResponse } from "next/server";
import type { Cart, PublicCart } from "@/lib/types/cart";
export const CART_COOKIE = "trovixo_cart_session";
export function sessionId(req:NextRequest) { return req.cookies.get(CART_COOKIE)?.value; }
export function sameOrigin(req:NextRequest) {
 const origin = req.headers.get("origin");
 if (!origin) return req.headers.get("sec-fetch-site") !== "cross-site";
 try {
  const source = new URL(origin);
  const requestHost = req.headers.get("host");
  return source.origin === req.nextUrl.origin || (requestHost !== null && source.host === requestHost && source.protocol === req.nextUrl.protocol) || source.origin === new URL(process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).origin;
 } catch { return false; }
}
export function json(data:unknown,status=200) { return NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store"}}); }
export function cartResponse(cart:Cart|undefined,req:NextRequest) {
 const data: PublicCart | null = cart ? {lines:cart.lines,subtotal:cart.subtotal} : null;
 const response = json(data);
 if (cart) response.cookies.set(CART_COOKIE,cart.id,{httpOnly:true,sameSite:"lax",secure:req.nextUrl.protocol === "https:" || (process.env.NODE_ENV === "production" && !["localhost","127.0.0.1"].includes(req.nextUrl.hostname)),path:"/",maxAge:60*60*24*30});
 else response.cookies.delete(CART_COOKIE);
 return response;
}
