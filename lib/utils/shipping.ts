import type { ShippingEstimate } from "@/lib/types/product";

// Centralized, defensive parser for numeric Shopify metafields.
// A metafield that's meant to be a plain Integer can end up stored as a
// Shopify "List Integer" instead (easy to do by accident in Admin), which
// serializes its value as a JSON array string like "[5]" rather than "5".
// This accepts either shape — plus a bit of incidental whitespace — and
// normalizes both to a single finite number. Anything else (missing,
// empty list, non-numeric, NaN) returns undefined so callers can fall
// back gracefully instead of ever rendering "NaN" or "[5]" to a customer.
export function parseMetafieldNumber(raw?: string | null): number | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  let candidate = trimmed;
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        candidate = String(parsed[0]);
      } else {
        return undefined;
      }
    } catch {
      return undefined;
    }
  }

  const value = Number.parseFloat(candidate);
  return Number.isFinite(value) ? value : undefined;
}

// Validates a per-product delivery range before it's ever shown to a
// customer. Guards against every malformed case called out by the
// project brief: missing values, 0 treated as "not really set", and an
// inverted range (min > max). Returns null when the range isn't usable,
// so callers can fall back to the store-wide estimate instead of
// rendering "undefined–undefined days" or similar.
function getValidRange(min: unknown, max: unknown): { minDays: number; maxDays: number } | null {
  if (typeof min !== "number" || typeof max !== "number") return null;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  // 0 is treated as "not meaningfully set" — a same-day estimate isn't a
  // realistic dropshipping delivery time, so this is far more likely to
  // be an unset/default metafield value than a real 0-day promise.
  if (min <= 0 || max <= 0) return null;
  if (min > max) return null;

  return { minDays: min, maxDays: max };
}

export function getValidDeliveryRange(shipping?: ShippingEstimate): { minDays: number; maxDays: number } | null {
  return getValidRange(shipping?.minDays, shipping?.maxDays);
}

// Processing time (time CJdropshipping/the merchant takes to prepare the
// order) is tracked separately from shipping/transit time — same
// validation rules, kept as its own function so ShippingBlock can show
// or omit each line independently.
export function getValidProcessingRange(shipping?: ShippingEstimate): { minDays: number; maxDays: number } | null {
  return getValidRange(shipping?.processingMinDays, shipping?.processingMaxDays);
}

// Turns a raw `shipping_origin` metafield value into safe, neutral,
// customer-facing copy. Never echoes the raw metafield text — that's the
// one thing standing between an internal note like "CJdropshipping / US
// pod" and it accidentally rendering on the storefront. When the raw
// value doesn't clearly indicate a US warehouse, we deliberately default
// to the generic international phrasing rather than guess.
export function getOriginLabel(origin?: string): string | undefined {
  if (!origin) return undefined;
  const normalized = origin.trim().toLowerCase();
  if (!normalized) return undefined;

  const looksUS = /\b(us|u\.s\.|usa|united states)\b/.test(normalized);
  return looksUS ? "Ships from: US warehouse" : "Ships from: International fulfillment center";
}
