"use client";

import { useEffect, useRef } from "react";

// Subtle scroll parallax for hero/featured imagery — dependency-free
// substitute for `useScroll`/`useTransform` from `motion` (not
// installed; no network access in this sandbox to add it).
//
// Writes `transform` directly to the DOM node inside the rAF callback
// instead of going through React state — a continuous scroll never
// triggers a React re-render this way, only a cheap style mutation on
// one already-existing element. Disabled entirely for
// prefers-reduced-motion; mobile gets a reduced (not zero) travel
// distance so the effect still reads as intentional without adding any
// scroll jank on smaller devices.
export function ParallaxMedia({
  children,
  className = "",
  travel = 56,
  mobileTravel = 18,
  scaleRange = 0.03,
}: {
  children: React.ReactNode;
  className?: string;
  /** Peak vertical travel in px at desktop widths (>640px). */
  travel?: number;
  /** Peak vertical travel in px at mobile widths (<=640px). */
  mobileTravel?: number;
  /** Additional scale at the furthest point from center, e.g. 0.03 -> 1.02..1.05. */
  scaleRange?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const isMobile = () => window.matchMedia("(max-width: 640px)").matches;

    function update() {
      ticking = false;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      // -0.5..0.5 as the element moves through the viewport; center = 0.
      const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
      const clamped = Math.max(-0.5, Math.min(0.5, progress));
      const maxTravel = isMobile() ? mobileTravel : travel;
      const offset = clamped * maxTravel;
      const scale = 1.02 + scaleRange * Math.abs(clamped) * 2;
      el.style.transform = `translateY(${offset.toFixed(1)}px) scale(${scale.toFixed(4)})`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [travel, mobileTravel, scaleRange]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
