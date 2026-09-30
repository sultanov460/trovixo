"use client";

import Image from "next/image";
import { useState } from "react";

// The brand's signature shape: a soft arch, like a doorway or window.
// Used consistently across the hero image, review avatars, and trust
// badges so the identity is recognizable independent of any one product.
// Unlike catalog ProductImage, this intentionally crops with
// object-cover — it's the one deliberately "lifestyle" treatment on the
// site — but still falls back gracefully if the source image fails.

export function ArchFrame({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const showFallback = !src || errored;

  return (
    <div
      className={`relative overflow-hidden bg-sand ${className}`}
      style={{ borderRadius: "999px 999px 12px 12px" }}
    >
      {showFallback ? (
        <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className="text-ink-soft/30">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setErrored(true)}
          className="object-cover"
        />
      )}
    </div>
  );
}
