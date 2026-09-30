import { formatMoney, getSavings } from "@/lib/utils/formatCurrency";
import type { Money } from "@/lib/types/product";

// Single place that renders price + compare-at price + savings badge, so
// the "only show a discount when compareAtPrice > price" rule and the
// Trovixo badge styling live in exactly one spot — used by ProductCard,
// BuyBox, and anywhere else (related/recommended products) that shows a
// price. `size="card"` is compact for grid cards; `size="detail"` matches
// the larger product-page price row. Wraps cleanly on narrow cards
// instead of needing separate mobile markup.
export function ProductPrice({
  price,
  compareAtPrice,
  size = "card",
  className = "",
  showSavingsBadge = true,
}: {
  price: Money;
  compareAtPrice?: Money;
  size?: "card" | "detail";
  className?: string;
  // ProductCard already shows a "Save $X" badge on the image itself —
  // set this to false there so the discount isn't announced twice in
  // the same card. Product details (no image badge) keep it on.
  showSavingsBadge?: boolean;
}) {
  const savings = getSavings(price, compareAtPrice);
  const isDetail = size === "detail";

  return (
    <div className={`flex flex-wrap items-center ${isDetail ? "gap-3" : "gap-x-2 gap-y-1"} ${className}`}>
      <span
        className={
          isDetail
            ? "font-mono text-[1.65rem] font-medium tracking-tight text-ink"
            : "font-mono text-sm font-semibold text-ink"
        }
      >
        {formatMoney(price)}
      </span>
      {savings && (
        <span
          className={
            isDetail
              ? "font-mono text-sm text-ink-soft/70 line-through"
              : "font-mono text-xs text-ink-soft/70 line-through"
          }
        >
          {formatMoney(compareAtPrice!)}
        </span>
      )}
      {savings && showSavingsBadge && (
        <span
          className={
            isDetail
              ? "rounded-pill bg-forest/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-forest"
              : "rounded-pill bg-forest/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-forest"
          }
        >
          Save {formatMoney(savings)}
        </span>
      )}
    </div>
  );
}
