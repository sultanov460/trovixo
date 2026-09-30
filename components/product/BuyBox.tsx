"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatMoney } from "@/lib/utils/formatCurrency";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { useCart } from "@/components/cart/CartProvider";
import type { Product, ProductVariant } from "@/lib/types/product";

function findVariant(product: Product, selected: Record<string, string>): ProductVariant | undefined {
  return product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value));
}

function isPlaceholderOption(name: string, values: string[]) {
  if (values.length !== 1) return false;
  const normalizedName = name.trim().toLowerCase();
  const normalizedValue = values[0]?.trim().toLowerCase();
  return (
    (normalizedName === "title" || normalizedName === "default" || normalizedName === "option") &&
    (normalizedValue === "default title" || normalizedValue === "default")
  );
}

export function BuyBox({ product, purchaseEnabled = false }: { product: Product; purchaseEnabled?: boolean }) {
  const { addToCart, checkout, isLoading, error } = useCart();
  const [added, setAdded] = useState(false);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.variants.find(v => v.available) || product.variants[0])?.selectedOptions.map(o => [o.name, o.value]) || product.options.map(o => [o.name, o.values[0]]))
  );
  const [quantity, setQuantity] = useState(1);
  // Buy Now runs its own async flow (add to cart, then navigate/redirect)
  // that can outlast the cart context's own isLoading flag — guard it
  // separately so a fast double-tap can't fire two checkout attempts.
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const variant = useMemo(() => findVariant(product, selected), [product, selected]);
  // Product-level price/compareAtPrice is only a fallback when there is
  // genuinely no resolved variant. Once a variant is resolved, its own
  // compareAtPrice is authoritative — including when it's null — so we
  // never accidentally pair one variant's price with another variant's
  // (or the product's) compare-at price.
  const price = variant ? variant.price : product.price;
  const compareAtCandidate = variant ? variant.compareAtPrice : product.compareAtPrice;
  const compareAt = compareAtCandidate && compareAtCandidate.amount > price.amount ? compareAtCandidate : undefined;
  const hasRealOptions = product.options.some((option) => !isPlaceholderOption(option.name, option.values));

  async function handleAdd() {
    if (!variant) return;
    setAdded(false);
    const result = await addToCart(variant.id, quantity);
    if (result) setAdded(true);
  }

  async function handleBuyNow() {
    if (!variant || isBuyingNow || isLoading) return;
    setIsBuyingNow(true);
    try {
      const updatedCart = await addToCart(variant.id, quantity);
      if (updatedCart) await checkout();
    } finally {
      setIsBuyingNow(false);
    }
  }

  if (product.isMock) return <div className="prelaunch-box"><p className="eyebrow">THE HOLIDAY EDIT</p><h1>{product.title}</h1><p>{product.tagline}</p><div className="launch-status">Product details pending</div><p className="text-sm">Final specifications, pricing and availability will be confirmed before orders open.</p></div>;
  if (!purchaseEnabled) return <div className="prelaunch-box"><p className="eyebrow">THE HOLIDAY EDIT</p><h1>{product.title}</h1>{product.tagline && <p>{product.tagline}</p>}{product.price.amount > 0 && <ProductPrice price={product.price} compareAtPrice={product.compareAtPrice} size="detail" />}<div className="launch-status">Orders are currently closed</div><p className="text-sm">Explore the product details below. Ordering will be available after checkout and fulfillment are confirmed.</p></div>;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-pill bg-forest/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-forest">
          Trovixo Holiday Edit
        </span>
        {variant?.available && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden="true" />
            In stock
          </span>
        )}
      </div>

      <h1 className="max-w-[18ch] text-[2rem] leading-[1.04] tracking-[-0.025em] sm:text-[2.35rem] lg:text-[2.55rem]">
        {product.title}
      </h1>

      {product.tagline && (
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-ink-soft">{product.tagline}</p>
      )}

      <div className="mt-6 border-b border-line pb-6">
        <ProductPrice price={price} compareAtPrice={compareAt} size="detail" />
      </div>

      {product.options
        .filter((option) => !isPlaceholderOption(option.name, option.values))
        .map((option) => (
          <div key={option.name} className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-ink">{option.name}</p>
              <span className="text-xs text-ink-soft">{selected[option.name]}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {option.values.map((value) => {
                const isActive = selected[option.name] === value;
                const candidate = { ...selected, [option.name]: value };
                const available = findVariant(product, candidate)?.available ?? true;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                    className={`min-h-11 rounded-pill border px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? "border-forest bg-forest text-paper shadow-lift"
                        : "border-ink/15 bg-white/50 text-ink hover:border-forest/50 hover:bg-white"
                    } ${!available ? "opacity-60" : ""}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      <div className={hasRealOptions ? "mt-7" : "mt-6"}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Quantity</p>
        </div>
        <div className="inline-flex h-11 items-center overflow-hidden rounded-pill border border-ink/15 bg-white/50">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-full w-11 items-center justify-center text-lg text-ink transition-colors hover:bg-sand/60"
          >
            −
          </button>
          <span className="w-10 text-center font-mono text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= 99}
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="flex h-full w-11 items-center justify-center text-lg text-ink transition-colors hover:bg-sand/60 disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {added && !error && <p role="status" className="cart-added">Added to your bag. <Link href="/cart">View bag →</Link></p>}
      {error && (
        <p role="alert" className="mt-4 rounded-card border border-clay/25 bg-clay/5 px-4 py-3 text-sm text-clay-dark">
          {error}
        </p>
      )}

      <div className="mt-7 hidden flex-col gap-3 sm:flex">
        <button
          type="button"
          disabled={!variant?.available || isLoading || isBuyingNow}
          onClick={handleAdd}
          className="btn-primary min-h-12 w-full shadow-lift disabled:opacity-50"
        >
          {isLoading && !isBuyingNow ? "Adding…" : variant?.available ? "Add to Cart" : "Out of Stock"}
        </button>
        <button
          type="button"
          disabled={!variant?.available || isLoading || isBuyingNow}
          onClick={handleBuyNow}
          className="btn-secondary min-h-12 w-full bg-white/40 disabled:opacity-50"
        >
          {isBuyingNow ? "Redirecting…" : "Buy Now"}
        </button>
      </div>

      <div className="mt-5 hidden grid-cols-3 gap-2 border-t border-line pt-5 text-center sm:grid">
        <div>
          <p className="text-xs font-semibold text-ink">Secure checkout</p>
          <p className="mt-1 text-[11px] leading-4 text-ink-soft">Encrypted &amp; secure</p>
        </div>
        <div className="border-x border-line px-2">
          <p className="text-xs font-semibold text-ink">Ships to</p>
          <p className="mt-1 text-[11px] leading-4 text-ink-soft">United States</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink">Order tracking</p>
          <p className="mt-1 text-[11px] leading-4 text-ink-soft">When available</p>
        </div>
      </div>

      {/* Mobile sticky bar — Buy Now is the stronger CTA, Add to Cart
          stays clearly visible alongside it. Below ~380px the price
          label is dropped first so both buttons keep a comfortable
          tap target instead of getting cramped. */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 shadow-soft backdrop-blur sm:hidden"
        style={{ paddingBottom: "max(.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <div className="hidden min-w-[60px] min-[380px]:block">
            <span className="block text-[10px] uppercase tracking-[0.1em] text-ink-soft">Total</span>
            <span className="font-mono text-sm font-medium">{formatMoney({ ...price, amount: price.amount * quantity })}</span>
          </div>
          <button
            type="button"
            disabled={!variant?.available || isLoading || isBuyingNow}
            onClick={handleAdd}
            className="btn-secondary min-h-12 flex-1 bg-white/60 px-2 text-xs disabled:opacity-50 min-[380px]:text-sm"
          >
            {isLoading && !isBuyingNow ? "Adding…" : variant?.available ? "Add to Cart" : "Sold Out"}
          </button>
          <button
            type="button"
            disabled={!variant?.available || isLoading || isBuyingNow}
            onClick={handleBuyNow}
            className="btn-primary min-h-12 flex-[1.15] px-2 text-xs shadow-lift disabled:opacity-50 min-[380px]:text-sm"
          >
            {isBuyingNow ? "Redirecting…" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
