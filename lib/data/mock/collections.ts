// MOCK COLLECTIONS — Phase 1 development only.
//
// There's only one mock catalog, so every collection handle currently
// resolves to the same product list. This is a placeholder, not a real
// categorization system — once Shopify is connected,
// lib/data/shopify/products.ts#getCollectionByHandle resolves real
// Shopify collections instead.

import { mockProducts } from "./products";
import type { Collection } from "@/lib/types/product";

export async function getCollectionByHandle(handle: string): Promise<Collection | undefined> {
  if (handle !== "all" && handle !== "trovixo") return undefined;
  return {
    id: `mock-collection-${handle}`,
    handle,
    title: handle === "all" ? "All products" : handle,
    products: mockProducts,
  };
}
