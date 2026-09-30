// Single entry point the UI imports for all commerce data.
// Automatically uses Shopify once SHOPIFY_STORE_DOMAIN /
// SHOPIFY_STOREFRONT_ACCESS_TOKEN are set; falls back to mock data
// otherwise. This is the ONLY file that should know both sources exist —
// every exported function here switches consistently, so nothing stays
// silently pinned to mock data once Shopify is configured.

import { isShopifyConfigured } from "@/lib/data/shopify/client";
import * as shopifyProducts from "@/lib/data/shopify/products";
import * as shopifyCart from "@/lib/data/shopify/cart";
import * as shopifyReviews from "@/lib/data/shopify/reviews";
import * as mockProductsApi from "@/lib/data/mock/products";
import * as mockCartApi from "@/lib/data/mock/cart";
import * as mockCollectionsApi from "@/lib/data/mock/collections";
import * as mockReviewsApi from "@/lib/data/mock/reviews";
import type { Product, Collection } from "@/lib/types/product";

export const usingLiveShopify = isShopifyConfigured;
const usingProductMocks = !isShopifyConfigured && process.env.STOREFRONT_PREVIEW === "true";

// ---- Products ----

export const getProductByHandle = isShopifyConfigured
  ? shopifyProducts.getProductByHandle
  : usingProductMocks
    ? mockProductsApi.getProductByHandle
    : async () => undefined;

export const getAllProducts = isShopifyConfigured
  ? shopifyProducts.getAllProducts
  : usingProductMocks
    ? mockProductsApi.getAllProducts
    : async () => [];

// Card-weight product list for grids — mock data is already tiny
// in-memory objects, so there's no separate lightweight mock source to
// switch to; only the live Shopify path benefits from the smaller query.
export const getAllProductCards = isShopifyConfigured
  ? shopifyProducts.getAllProductCards
  : usingProductMocks
    ? mockProductsApi.getAllProducts
    : async () => [];

// In production, both storefront collection routes are views of the
// authoritative Trovixo collection. Refuse every other shared-store
// collection handle so a direct ProCabin collection URL cannot expose it.
export async function getCollectionByHandle(handle: string): Promise<Collection | undefined> {
  if (isShopifyConfigured) {
    return handle === "all" ? shopifyProducts.getCollectionByHandle("all", 1) : undefined;
  }

  return usingProductMocks ? mockCollectionsApi.getCollectionByHandle(handle) : undefined;
}

// Related products are derived from the active catalog boundary. In
// production, getAllProductCards reads only the Trovixo collection.
export async function getRelatedProducts(excludeHandle: string, limit = 3): Promise<Product[]> {
  const all = await getAllProductCards();
  return all.filter((p) => p.handle !== excludeHandle).slice(0, limit);
}

// Sitemap-only: handle + real last-modified date where known. Mock mode
// has no real "updated" timestamp, so it's simply omitted (never
// fabricated) — see sitemap.ts for how a missing date is handled.
export const getAllProductHandles: () => Promise<{ handle: string; updatedAt?: string }[]> = isShopifyConfigured
  ? shopifyProducts.getAllProductHandles
  : usingProductMocks
    ? async () => mockProductsApi.mockProducts.map((p) => ({ handle: p.handle }))
    : async () => [];

// The homepage feature is the first product in the Trovixo collection.
export async function getHeroProduct(): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all[0];
}

// ---- Reviews ----
// Reviews remain empty until a legitimate provider is connected.
// Production never falls back to fabricated customer feedback.

export const getReviews = isShopifyConfigured ? shopifyReviews.getReviews : mockReviewsApi.getReviews;

// ---- Cart ----

export const createCart = isShopifyConfigured ? shopifyCart.createCart : mockCartApi.createCart;
export const addCartLine = isShopifyConfigured ? shopifyCart.addCartLine : mockCartApi.addCartLine;
export const updateCartLine = isShopifyConfigured ? shopifyCart.updateCartLine : mockCartApi.updateCartLine;
export const removeCartLine = isShopifyConfigured ? shopifyCart.removeCartLine : mockCartApi.removeCartLine;
export const getCart = isShopifyConfigured ? shopifyCart.getCart : mockCartApi.getCart;
