import { ProductGrid } from "@/components/collection/ProductGrid";
import { MotionReveal } from "@/components/ui/motion/MotionReveal";
import type { Product } from "@/lib/types/product";

export function RelatedProducts({ products, title = "You might also like" }: { products: Product[]; title?: string }) {
  if (products.length === 0) return null;

  return (
    <section className="container-page py-16">
      <MotionReveal>
        <h2 className="mb-8 text-2xl">{title}</h2>
        <ProductGrid products={products} />
      </MotionReveal>
    </section>
  );
}
