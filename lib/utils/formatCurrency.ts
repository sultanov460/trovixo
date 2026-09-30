import type { Money } from "@/lib/types/product";

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: money.amount % 1 === 0 ? 0 : 2,
  }).format(money.amount);
}

// Shared discount math for anywhere a price + optional compare-at price is
// shown (product cards, product details, related products). A discount is
// only ever "real" when compareAtPrice is present and strictly greater
// than price — this is the single source of truth other components check
// before rendering a crossed-out price or a SAVE badge, so nothing has to
// re-derive (and risk mis-deriving) that condition on its own.
export function getSavings(price: Money, compareAtPrice?: Money): Money | undefined {
  if (!compareAtPrice) return undefined;
  if (compareAtPrice.currencyCode !== price.currencyCode) return undefined;
  const amount = compareAtPrice.amount - price.amount;
  if (!(amount > 0)) return undefined;
  return { amount, currencyCode: price.currencyCode };
}
