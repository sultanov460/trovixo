import { RatingStars } from "@/components/ui/RatingStars";
import { MotionReveal } from "@/components/ui/motion/MotionReveal";
import type { Review } from "@/lib/types/review";

export function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="container-page py-16">
      <div className="mb-8 flex items-center gap-3">
        <p className="eyebrow">Reviews</p>
        {reviews[0]?.isMock && (
          <span className="rounded-pill bg-clay/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-clay-dark">
            Sample data
          </span>
        )}
      </div>
      <div className="mb-8 flex items-center gap-3">
        <RatingStars rating={avg} size={18} />
        <span className="text-sm text-ink-soft">
          {avg.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((r, i) => (
          <MotionReveal key={r.id} delayMs={i * 80} className="card p-5">
            <RatingStars rating={r.rating} />
            {r.title && <p className="mt-3 font-medium text-ink">{r.title}</p>}
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
            <p className="mt-4 text-xs font-medium text-ink-soft">
              {r.reviewerName} {r.verified && "· Verified purchase"}
            </p>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
