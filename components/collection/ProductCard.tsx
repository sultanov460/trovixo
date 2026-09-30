import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { TruckIcon } from "@/components/ui/icons";
import { getSavings, formatMoney } from "@/lib/utils/formatCurrency";
import { getValidDeliveryRange } from "@/lib/utils/shipping";
import type { Product } from "@/lib/types/product";

export function ProductCard({ product }: { product: Product }) {
  const savings = getSavings(product.price, product.compareAtPrice);
  const delivery = getValidDeliveryRange(product.shipping);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block rounded-card outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <ProductImage
        src={product.images[0]}
        alt={product.title}
        sizes="(max-width: 768px) 50vw, 25vw"
        padding="card"
        className="bg-sand/40 transition-transform duration-300 group-hover:scale-[1.015] group-active:scale-[0.99]"
        badge={
          savings ? (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-pill bg-paper/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-forest shadow-[0_1px_4px_rgba(42,37,33,0.12)] ring-1 ring-forest/15">
              Save {formatMoney(savings)}
            </span>
          ) : undefined
        }
      />

      <div className="mt-3 min-w-0">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-forest">
          {product.title}
        </p>

        {product.isMock ? <p className="mt-2 text-sm text-forest">Coming soon</p> : <ProductPrice
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="card"
          className="mt-1.5"
          showSavingsBadge={false}
        />}

        {delivery && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft">
            <TruckIcon className="h-3.5 w-3.5 shrink-0 text-ink-soft/70" />
            <span>
              Delivery: {delivery.minDays}–{delivery.maxDays} days
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}
