"use client";

import Image from "next/image";
import { useState } from "react";

// Single place that decides how any product photo renders, regardless
// of its source dimensions. Two things this solves that a bare
// next/image doesn't:
//   1. A broken/missing src never shows the browser's ugly broken-image
//      icon — it falls back to a quiet, on-brand placeholder that keeps
//      the same footprint as a real photo, so grids stay aligned.
//   2. `fit="contain"` (the default) keeps the whole product visible
//      inside a fixed, padded container — safe for arbitrary supplier
//      photography of very different aspect ratios (tall bottles, wide
//      pans, square appliances) without cropping or distorting anything.
//      `fit="cover"` is available for intentionally cropped lifestyle
//      shots where that reads as an editorial choice rather than an
//      accident.

type ObjectFit = "contain" | "cover";
type ImagePadding = "default" | "card" | "compact" | "cart" | "none";

const CONTAIN_PADDING: Record<ImagePadding, string> = {
  default: "p-4 sm:p-5",
  card: "p-3 sm:p-3.5",
  compact: "p-1.5",
  cart: "p-[3px]",
  none: "",
};

export function ProductImage({
  src,
  alt,
  aspectClassName = "aspect-square",
  fit = "contain",
  padding = "default",
  sizes,
  priority = false,
  className = "",
  badge,
}: {
  src?: string;
  alt: string;
  aspectClassName?: string;
  fit?: ObjectFit;
  // Internal breathing room around a `fit="contain"` image. "default"
  // (p-4/p-5) suits the large product-detail stage; "card" is a
  // slightly tighter option for grid product cards so the photo reads
  // larger without touching the card edges; "compact" is for small
  // contexts like the ~72px gallery thumbnails. "cart" keeps a 3px
  // inset and always contains the full photo. Other cover images remain
  // edge-to-edge by design.
  padding?: ImagePadding;
  sizes: string;
  priority?: boolean;
  className?: string;
  // Optional small overlay (e.g. a "Save $X" corner badge) rendered
  // inside this same relative, overflow-hidden, rounded container — so
  // it's guaranteed to sit within the image's bounds and share its
  // corner radius regardless of the image's own aspect ratio.
  badge?: React.ReactNode;
}) {
  const [errored, setErrored] = useState(false);
  const showFallback = !src || errored;

  return (
    <div className={`relative overflow-hidden rounded-card bg-sand ${aspectClassName} ${className}`}>
      {showFallback ? (
        <ImageFallback />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setErrored(true)}
          className={padding === "cart" || (!src.startsWith("/holiday/") && fit === "contain") ? `object-contain ${CONTAIN_PADDING[padding]}` : src.startsWith("/holiday/") ? "object-cover object-[center_65%]" : "object-cover"}
        />
      )}
      {badge}
    </div>
  );
}

function ImageFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className="text-ink-soft/30">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}
