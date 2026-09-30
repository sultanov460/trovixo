import type { ProductSpec } from "@/lib/types/product";

export function BenefitsList({ benefits }: { benefits: string[] }) {
  if (benefits.length === 0) return null;
  return (
    <div className="mt-7 border-t border-line pt-6">
      <p className="mb-4 text-sm font-semibold text-ink">A little holiday inspiration</p>
      <ul className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm leading-6 text-ink-soft">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpecsTable({ specs }: { specs: ProductSpec[] }) {
  if (specs.length === 0) return null;
  return (
    <div className="rounded-[16px] border border-line bg-paper/60 p-5">
      <h2 className="mb-3 text-lg">Specifications</h2>
      <dl className="divide-y divide-line text-sm">
        {specs.map((s) => (
          <div key={s.label} className="grid grid-cols-[minmax(110px,.8fr)_1.2fr] gap-4 py-3 first:pt-1 last:pb-1">
            <dt className="text-ink-soft">{s.label}</dt>
            <dd className="text-right font-medium text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function TrustInfo() {
  const items = [
    { title: "Checkout by Shopify", body: "Payment is completed on Shopify’s hosted checkout." },
    { title: "Order updates", body: "Tracking details are shared when the selected carrier makes them available." },
    { title: "Clear returns", body: "Eligibility and instructions are explained in our Returns & Refunds policy." },
  ];

  return (
    <div className="mt-4 grid gap-3">
      {items.map((i) => (
        <div key={i.title} className="rounded-[14px] border border-line bg-white/45 px-4 py-3.5">
          <p className="text-sm font-semibold text-ink">{i.title}</p>
          <p className="mt-1 text-xs leading-5 text-ink-soft">{i.body}</p>
        </div>
      ))}
    </div>
  );
}
