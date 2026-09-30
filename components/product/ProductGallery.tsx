"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;
  const displayImages = hasImages ? images : [undefined];
  const hasNavigation = images.length > 1;

  const showPrevious = () => {
    if (!hasNavigation) return;
    setActive((current) => (current - 1 + images.length) % images.length);
  };

  const showNext = () => {
    if (!hasNavigation) return;
    setActive((current) => (current + 1) % images.length);
  };

  return (
    <div className="min-w-0">
      {/* Mobile: horizontal gallery with a subtle position indicator */}
      <div className="md:hidden">
        <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {displayImages.map((src, i) => (
            <div key={`${src ?? "placeholder"}-${i}`} className="w-[88vw] max-w-[430px] shrink-0 snap-center">
              <ProductImage
                src={src}
                alt={`${title} photo ${i + 1}`}
                aspectClassName="aspect-square"
                sizes="88vw"
                priority={i === 0}
                className="border border-line bg-[#F4EEE5]"
              />
            </div>
          ))}
        </div>
        {displayImages.length > 1 && (
          <p className="mt-2 text-center text-[11px] uppercase tracking-[0.12em] text-ink-soft">
            Swipe to view {displayImages.length} photos
          </p>
        )}
      </div>

      {/* Desktop: contained thumbnail rail + large product stage */}
      <div className="hidden md:grid md:grid-cols-[64px_minmax(0,1fr)] md:gap-3.5 lg:grid-cols-[72px_minmax(0,1fr)] lg:gap-5">
        {hasImages && images.length > 1 ? (
          <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`group relative block w-full overflow-hidden rounded-[10px] border transition-all duration-150 active:scale-[0.96] ${
                  active === i
                    ? "border-forest bg-white shadow-[0_2px_10px_-4px_rgba(42,37,33,0.25)]"
                    : "border-line/70 bg-sand/25 hover:border-forest/30 hover:bg-white/60"
                }`}
                aria-label={`Show photo ${i + 1}`}
                aria-current={active === i}
              >
                <ProductImage
                  src={src}
                  alt=""
                  aspectClassName="aspect-square"
                  padding="compact"
                  className="w-full rounded-none bg-transparent"
                  sizes="72px"
                />
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}

        <div className="relative min-w-0">
          <div className="absolute left-4 top-4 z-10 rounded-pill border border-white/70 bg-paper/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft shadow-sm backdrop-blur">
            Trovixo selection
          </div>
          <div key={active} className="gallery-arrive">
            <ProductImage
              src={images[active]}
              alt={`${title} photo ${active + 1}`}
              aspectClassName="aspect-square"
              sizes="(min-width: 1024px) 560px, 48vw"
              priority
              className="border border-line bg-[#F3ECE2] shadow-[0_20px_45px_-30px_rgba(42,37,33,0.35)]"
            />
          </div>

          {hasNavigation && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous product photo"
                className="group absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-paper/90 text-ink shadow-[0_8px_24px_-12px_rgba(42,37,33,0.45)] backdrop-blur transition duration-200 hover:scale-[1.03] hover:bg-white active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Next product photo"
                className="group absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-paper/90 text-ink shadow-[0_8px_24px_-12px_rgba(42,37,33,0.45)] backdrop-blur transition duration-200 hover:scale-[1.03] hover:bg-white active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
              <span>Product gallery</span>
              <span className="font-mono">{active + 1} / {images.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
