import { shopifyFetch } from "./client";
import {
  GET_PRODUCT_BY_HANDLE,
} from "./queries";
import { getValidDeliveryRange, getValidProcessingRange, parseMetafieldNumber } from "@/lib/utils/shipping";
import type { Product, ProductVariant, ProductSpec, ShippingEstimate } from "@/lib/types/product";
import { SHOPIFY_COUNTRY_CODE, SHOPIFY_PRODUCT_HANDLE } from "./config";
import { getCustomerFacingProductTitle } from "@/lib/utils/product";

type ShopifyMoney = { amount: string; currencyCode: string };
type ShopifyMetafield = { value: string; type?: string } | null;

type ShopifyVariantNode = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: { name: string; value: string }[];
  image: { url: string } | null;
};

// Matches PRODUCT_CARD_FRAGMENT exactly — a variant shape with just
// enough to pick a display price/compareAtPrice pair and know
// availability. No title/selectedOptions/image: cards never render a
// variant selector or a per-variant thumbnail.
type ShopifyVariantCardNode = {
  id: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
};

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: { nodes: { url: string }[] };
  priceRange: { minVariantPrice: ShopifyMoney };
  compareAtPriceRange: { minVariantPrice: ShopifyMoney } | null;
  options: { name: string; values: string[] }[];
  variants: { nodes: ShopifyVariantNode[] };
  shippingMinDays: ShopifyMetafield;
  shippingMaxDays: ShopifyMetafield;
  processingMinDays: ShopifyMetafield;
  processingMaxDays: ShopifyMetafield;
  shippingOrigin: ShopifyMetafield;
  shippingMethod: ShopifyMetafield;
  tagline: ShopifyMetafield;
  benefits: ShopifyMetafield;
  specifications: ShopifyMetafield;
  faqs: ShopifyMetafield;
};

// Matches PRODUCT_CARD_FRAGMENT — everything ProductCard/CollectionView
// actually reads, and nothing else.
type ShopifyProductCardNode = {
  id: string;
  handle: string;
  title: string;
  images: { nodes: { url: string }[] };
  priceRange: { minVariantPrice: ShopifyMoney };
  variants: { nodes: ShopifyVariantCardNode[] };
  shippingMinDays: ShopifyMetafield;
  shippingMaxDays: ShopifyMetafield;
};

function toFiniteMoney(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapVariant(v: ShopifyVariantNode): ProductVariant {
  const price = toFiniteMoney(v.price.amount);
  const compareAmount = v.compareAtPrice ? toFiniteMoney(v.compareAtPrice.amount) : undefined;

  return {
    id: v.id,
    title: v.title,
    price: { amount: price, currencyCode: v.price.currencyCode },
    compareAtPrice:
      v.compareAtPrice && compareAmount !== undefined && compareAmount > price
        ? { amount: compareAmount, currencyCode: v.compareAtPrice.currencyCode }
        : undefined,
    available: v.availableForSale,
    selectedOptions: v.selectedOptions,
    image: v.image?.url,
  };
}

// Card variants never render a selector, so title/selectedOptions/image
// are placeholders — CollectionView's "in stock only" filter only reads
// `available`, and ProductCard never reads variant-level fields at all.
function mapVariantCard(v: ShopifyVariantCardNode): ProductVariant {
  const price = toFiniteMoney(v.price.amount);
  const compareAmount = v.compareAtPrice ? toFiniteMoney(v.compareAtPrice.amount) : undefined;

  return {
    id: v.id,
    title: "Default Title",
    price: { amount: price, currencyCode: v.price.currencyCode },
    compareAtPrice:
      v.compareAtPrice && compareAmount !== undefined && compareAmount > price
        ? { amount: compareAmount, currencyCode: v.compareAtPrice.currencyCode }
        : undefined,
    available: v.availableForSale,
    selectedOptions: [],
  };
}

function parseShippingMetafields(p: ShopifyProductNode): ShippingEstimate | undefined {
  // Temporary, opt-in diagnostic for tracing exactly where configured
  // Shopify delivery metafields disappear on their way to the UI. Off by
  // default and server-only (this module is never imported by a "use
  // client" file) — no secrets are logged, only the four metafield
  // objects Shopify actually returned for this product. To use: set
  // SHOPIFY_DEBUG_METAFIELDS=1 in .env.local, load a product page, and
  // read the server (terminal) log.
  //   - All four fields log as `null` → Shopify Storefront API access is
  //     not enabled for those metafield definitions (see Shopify Admin
  //     under Settings > Custom data > Products > [field] > Access).
  //     This is the most common cause: metafields created in Admin are
  //     NOT exposed to the Storefront API by default.
  //   - Fields log with a `value`/`type` present → the data is reaching
  //     this function fine and any remaining issue is in parsing below.
  // Remove this block once the Admin/data issue is confirmed fixed.
  if (process.env.SHOPIFY_DEBUG_METAFIELDS === "1") {
    // eslint-disable-next-line no-console
    console.warn(`[shopify metafields] ${p.handle}`, {
      shippingMinDays: p.shippingMinDays,
      shippingMaxDays: p.shippingMaxDays,
      processingMinDays: p.processingMinDays,
      processingMaxDays: p.processingMaxDays,
    });
  }

  // Values come through the centralized parser so a metafield that was
  // accidentally created as a Shopify "List Integer" (serialized as
  // e.g. "[5]") is normalized the same way a plain Integer ("5") is —
  // see parseMetafieldNumber for the full rationale.
  const minDays = parseMetafieldNumber(p.shippingMinDays?.value) ?? 0;
  const maxDays = parseMetafieldNumber(p.shippingMaxDays?.value) ?? 0;
  const processingMinDays = parseMetafieldNumber(p.processingMinDays?.value) ?? 0;
  const processingMaxDays = parseMetafieldNumber(p.processingMaxDays?.value) ?? 0;

  const candidate: ShippingEstimate = {
    country: "US",
    minDays,
    maxDays,
    processingMinDays,
    processingMaxDays,
    origin: p.shippingOrigin?.value?.trim() || undefined,
    method: p.shippingMethod?.value?.trim() || undefined,
  };

  const hasValidShipping = Boolean(getValidDeliveryRange(candidate));
  const hasValidProcessing = Boolean(getValidProcessingRange(candidate));

  // Nothing usable at all — let the UI fall back to its generic copy
  // instead of carrying around an estimate object full of zeros.
  if (!hasValidShipping && !hasValidProcessing && !candidate.origin && !candidate.method) return undefined;

  return candidate;
}

function parseStringList(field: ShopifyMetafield): string[] {
  if (!field?.value) return [];
  const raw = field.value.trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  } catch {
    // Fall through to newline parsing for simple text metafields.
  }

  return raw
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function parseSpecs(field: ShopifyMetafield): ProductSpec[] {
  if (!field?.value) return [];
  try {
    const parsed = JSON.parse(field.value);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const record = item as Record<string, unknown>;
          const label = typeof record.label === "string" ? record.label.trim() : "";
          const value = typeof record.value === "string" ? record.value.trim() : "";
          return label && value ? { label, value } : null;
        })
        .filter((item): item is ProductSpec => Boolean(item));
    }

    if (parsed && typeof parsed === "object") {
      return Object.entries(parsed as Record<string, unknown>)
        .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
        .map(([label, value]) => ({ label, value: String(value) }));
    }
  } catch {
    // Invalid optional content metafields should never break a product page.
  }
  return [];
}

function parseFaqs(field: ShopifyMetafield): { question: string; answer: string }[] {
  if (!field?.value) return [];
  try {
    const parsed = JSON.parse(field.value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const question = typeof record.question === "string" ? record.question.trim() : "";
        const answer = typeof record.answer === "string" ? record.answer.trim() : "";
        return question && answer ? { question, answer } : null;
      })
      .filter((item): item is { question: string; answer: string } => Boolean(item));
  } catch {
    return [];
  }
}

function pickDisplayVariant(variants: ProductVariant[]): ProductVariant | undefined {
  if (variants.length === 0) return undefined;
  return variants.reduce((lowest, v) => (v.price.amount < lowest.price.amount ? v : lowest), variants[0]);
}

function mapProduct(p: ShopifyProductNode): Product {
  const variants = p.variants.nodes.map(mapVariant);
  // Card/list-level price and compareAtPrice must come from the SAME
  // variant. Shopify's priceRange/compareAtPriceRange are independent
  // per-field minimums across all variants — they can legitimately
  // resolve to two different variants, which would silently pair one
  // variant's price with a different variant's discount. Picking a
  // single "display" variant (the lowest-priced one) keeps the two
  // values internally consistent everywhere the product-level
  // price/compareAtPrice is shown (product cards, related products).
  const displayVariant = pickDisplayVariant(variants);
  const fallbackPrice = {
    amount: toFiniteMoney(p.priceRange.minVariantPrice.amount),
    currencyCode: p.priceRange.minVariantPrice.currencyCode,
  };

  return {
    id: p.id,
    handle: p.handle,
    title: getCustomerFacingProductTitle(p.title),
    tagline: p.tagline?.value?.trim() || undefined,
    description: p.description,
    benefits: parseStringList(p.benefits),
    images: p.images.nodes.map((n) => n.url).filter(Boolean),
    price: displayVariant?.price ?? fallbackPrice,
    compareAtPrice: displayVariant?.compareAtPrice,
    options: p.options,
    variants,
    specs: parseSpecs(p.specifications),
    shipping: parseShippingMetafields(p),
    faqs: parseFaqs(p.faqs),
    isMock: false,
  };
}

// Lightweight counterpart to mapProduct for PRODUCT_CARD_FRAGMENT
// results. Fields ProductCard/CollectionView never read (description,
// options, specs, faqs, tagline, benefits, processing days) are filled
// with honest empty defaults rather than fetched — this Product is only
// ever passed to grid components, never to a product detail page.
function mapProductCard(p: ShopifyProductCardNode): Product {
  const variants = p.variants.nodes.map(mapVariantCard);
  const displayVariant = pickDisplayVariant(variants);
  const fallbackPrice = {
    amount: toFiniteMoney(p.priceRange.minVariantPrice.amount),
    currencyCode: p.priceRange.minVariantPrice.currencyCode,
  };

  const minDays = parseMetafieldNumber(p.shippingMinDays?.value) ?? 0;
  const maxDays = parseMetafieldNumber(p.shippingMaxDays?.value) ?? 0;
  const shipping = getValidDeliveryRange({ country: "US", minDays, maxDays })
    ? { country: "US", minDays, maxDays }
    : undefined;

  return {
    id: p.id,
    handle: p.handle,
    title: getCustomerFacingProductTitle(p.title),
    description: "",
    benefits: [],
    images: p.images.nodes.map((n) => n.url).filter(Boolean),
    price: displayVariant?.price ?? fallbackPrice,
    compareAtPrice: displayVariant?.compareAtPrice,
    options: [],
    variants,
    specs: [],
    shipping,
    isMock: false,
  };
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  if (!SHOPIFY_PRODUCT_HANDLE || handle !== SHOPIFY_PRODUCT_HANDLE) return undefined;
  const data = await shopifyFetch<{
    product: ShopifyProductNode | null;
  }>(GET_PRODUCT_BY_HANDLE, {
    handle,
    country: SHOPIFY_COUNTRY_CODE,
  });
  return data.product ? mapProduct(data.product) : undefined;
}

// Full detail for the Trovixo collection only (used by getHeroProduct).
export async function getAllProducts(first = 50): Promise<Product[]> {
  if (first < 1 || !SHOPIFY_PRODUCT_HANDLE) return [];
  const product = await getProductByHandle(SHOPIFY_PRODUCT_HANDLE);
  return product ? [product] : [];
}

// Card-weight Trovixo collection list for grids and related products.
export async function getAllProductCards(first = 50): Promise<Product[]> {
  return getAllProducts(first);
}

export async function getCollectionByHandle(handle: string, first = 50) {
  if (handle !== "all") return undefined;
  return { id: "trovixo-single-product", handle: "all", title: "Shop", description: "", products: await getAllProductCards(first) };
}

// Sitemap-only: Trovixo collection handle + real Shopify updatedAt.
export async function getAllProductHandles(first = 100): Promise<{ handle: string; updatedAt?: string }[]> {
  const products = await getAllProductCards(first);
  return products.map(({ handle }) => ({ handle }));
}
