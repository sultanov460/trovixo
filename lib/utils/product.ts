/**
 * Supplier feeds often arrive with search-keyword titles that are useful for
 * marketplaces but visually poor in a branded storefront. Keep the original
 * product data in Shopify, but present a short customer-facing name for known
 * supplier patterns until the merchant replaces the Shopify title.
 */
export function getCustomerFacingProductTitle(title: string): string {
  const normalized = title.trim().replace(/\s+/g, " ");
  const lower = normalized.toLowerCase();

  if (lower.includes("deep fry basket") && lower.includes("foldable")) {
    return "Trovixo Fold & Fry Basket";
  }

  return normalized;
}
