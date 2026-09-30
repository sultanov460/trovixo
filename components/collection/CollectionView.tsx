"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "./ProductGrid";
import type { Product } from "@/lib/types/product";

type SortOption = "featured" | "price-asc" | "price-desc";

export function CollectionView({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortOption>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  const visible = useMemo(() => {
    let list = products;
    if (inStockOnly) {
      list = list.filter((p) => p.variants.some((v) => v.available));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price.amount - b.price.amount);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price.amount - a.price.amount);
    return list;
  }, [products, sort, inStockOnly]);

  return (
    <div>
      <div className="mt-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-ink/30 accent-forest"
          />
          In stock only
        </label>

        <label className="flex items-center gap-2 text-sm text-ink-soft">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-pill border border-ink/20 bg-paper px-3 py-1.5 text-sm text-ink"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </div>

      <ProductGrid products={visible} />
    </div>
  );
}
