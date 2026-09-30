// Single source of truth for Shopify Storefront API configuration.
// Shopify releases a stable API version quarterly. 2026-07 is the current
// stable version for this project update (August 2026).
export const SHOPIFY_API_VERSION = "2026-07";

// The only product this storefront may display or sell.
export const SHOPIFY_PRODUCT_HANDLE = process.env.SHOPIFY_PRODUCT_HANDLE?.trim() || "";

// Trovixo currently targets the United States as its primary storefront
// context. Keeping this configurable makes it easy to introduce proper
// country detection/market routing later without rewriting the data layer.
const configuredCountry = (process.env.SHOPIFY_COUNTRY_CODE || "US").trim().toUpperCase();
export const SHOPIFY_COUNTRY_CODE = /^[A-Z]{2}$/.test(configuredCountry) ? configuredCountry : "US";
