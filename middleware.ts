import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const handle = process.env.SHOPIFY_PRODUCT_HANDLE?.trim();
  const previewHandle = process.env.STOREFRONT_PREVIEW === "true" && !handle ? "multicolor-car-lights" : undefined;
  const expected = segments[0] === "products" ? handle || previewHandle : "all";
  let actual: string | undefined;
  try { actual = segments[1] ? decodeURIComponent(segments[1]) : undefined; } catch { /* Reject malformed paths. */ }
  if (segments.length !== 2 || !expected || actual !== expected) {
    return new NextResponse("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" } });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/products/:path*", "/collections/:path*"] };
