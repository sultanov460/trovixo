"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/utils/formatCurrency";
import { ProductImage } from "@/components/ui/ProductImage";

export default function CartPage() {
  const { cart, updateLine, removeLine, isLoading, isInitializing, error, checkout } = useCart();

  // While a previous-session cart is still being restored, show a
  // neutral placeholder rather than "Your cart is empty" — that message
  // is only true once we've actually checked.
  if (isInitializing) {
    return (
      <div className="container-page py-20 text-center">
        <div className="mx-auto h-6 w-40 animate-pulse rounded-pill bg-sand/60" aria-hidden="true" />
        <span className="sr-only">Loading your cart…</span>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl">Your bag is empty</h1>
        {error && <p role="alert" className="mt-4 text-forest">{error}</p>}
        <p className="mt-2 text-sm text-ink-soft">Add something you&apos;ll love.</p>
        <Link href="/collections/all" className="btn-primary mt-6 inline-flex">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page grid gap-10 py-10 md:grid-cols-[1fr_320px]">
      <div>
        <h1 className="mb-6 text-2xl">Your cart</h1>
        {error && (
          <p role="alert" className="mb-4 rounded-card bg-clay/10 px-4 py-3 text-sm text-clay-dark">
            {error}
          </p>
        )}
        <ul className="divide-y divide-line border-y border-line">
          {cart.lines.map((line) => (
            <li key={line.id} className="flex gap-4 py-5">
              <ProductImage
                src={line.image}
                alt={line.title}
                aspectClassName="aspect-square"
                padding="cart"
                className="h-20 w-20 shrink-0 border border-line !rounded-[10px] !bg-paper"
                sizes="80px"
              />
              <div className="flex-1">
                <p className="font-medium text-ink">{line.title}</p>
                {line.variantTitle !== "Default Title" && <p className="text-xs text-ink-soft">{line.variantTitle}</p>}

                <div className="mt-3 flex items-center gap-4">
                  <div className="inline-flex items-center rounded-pill border border-ink/20">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={isLoading}
                      onClick={() => updateLine(line.id, Math.max(1, line.quantity - 1))}
                      className="px-3 py-2 text-base"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-mono text-xs">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={isLoading || line.quantity >= 99}
                      onClick={() => updateLine(line.id, Math.min(99, line.quantity + 1))}
                      className="px-3 py-2 text-base"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => removeLine(line.id)}
                    className="text-xs font-medium text-ink-soft underline hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <span className="font-mono text-sm">{formatMoney(line.total || { amount: line.price.amount * line.quantity, currencyCode: line.price.currencyCode })}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card h-fit p-6">
        <div className="flex items-center justify-between text-sm text-ink-soft">
          <span>Subtotal</span>
          <span className="font-mono text-ink">{formatMoney(cart.subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-ink-soft">Shipping and taxes calculated at checkout.</p>
        <button type="button" disabled={isLoading} onClick={checkout} className="btn-primary mt-6 w-full disabled:opacity-50">{isLoading ? "Please wait…" : "Continue to checkout →"}</button>
        <p className="mt-3 text-center text-xs text-ink-soft">Payment is completed on Shopify’s secure checkout.</p>
      </div>
    </div>
  );
}
