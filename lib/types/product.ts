// Shared Product contract. Every part of the UI is built against this type,
// regardless of whether the data currently comes from mock data (Phase 1)
// or the Shopify Storefront API (Phase 2+). See lib/shopify/products.ts.

export type Money = {
  amount: number;
  currencyCode: string; // e.g. "USD"
};

export type ProductVariant = {
  id: string;
  title: string; // e.g. "Charcoal / Large"
  price: Money;
  compareAtPrice?: Money;
  available: boolean;
  selectedOptions: { name: string; value: string }[];
  image?: string;
};

export type ProductOption = {
  name: string; // e.g. "Color"
  values: string[];
};

export type ShippingEstimate = {
  country: string; // ISO country code, e.g. "US"
  minDays: number;
  maxDays: number;
  carrierNote?: string;
  // Populated from Shopify product metafields (namespace "custom") when
  // set — see lib/data/shopify/products.ts. Optional because most
  // products won't have these configured, and the UI must fall back
  // gracefully when they're absent.
  origin?: string; // raw metafield value; never shown to customers verbatim — see lib/utils/shipping.ts
  method?: string;
  // Processing/handling time before an order ships, from
  // custom.processing_min_days / custom.processing_max_days. Kept
  // separate from minDays/maxDays (shipping/transit time) — the two are
  // never summed automatically. See lib/utils/shipping.ts.
  processingMinDays?: number;
  processingMaxDays?: number;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  tagline?: string; // short one-line promise, used in hero/cards
  description: string; // longer descriptive copy
  benefits: string[]; // short benefit bullets
  images: string[];
  price: Money;
  compareAtPrice?: Money;
  options: ProductOption[];
  variants: ProductVariant[];
  specs: ProductSpec[];
  rating?: number;
  reviewCount?: number;
  shipping?: ShippingEstimate;
  faqs?: { question: string; answer: string }[];
  isMock?: boolean; // true while backed by placeholder data
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  products: Product[];
};
