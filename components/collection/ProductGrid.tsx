import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types/product";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="py-16 text-center text-sm text-ink-soft">The holiday product is unavailable right now. Please check back later.</p>;
  }

  // With only one product, a full-width grid stretches a single card
  // across the whole row. On mobile that reads as an intentional,
  // centered feature card; on desktop it should still sit at the start
  // of the row like a normal ecommerce grid, not float in the middle of
  // a very wide section. Rendered as two CSS-toggled variants (rather
  // than a JS viewport check) so server and client markup stay
  // identical — no hydration risk, no window/document check.
  // Automatically reverts to the normal grid below once a second
  // product exists.
  if (products.length === 1) {
    return (
      <>
        <div className="flex justify-center md:hidden">
          <div className="w-[min(100%,280px)]">
            <ProductCard product={products[0]} />
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          <ProductCard product={products[0]} />
        </div>
      </>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
