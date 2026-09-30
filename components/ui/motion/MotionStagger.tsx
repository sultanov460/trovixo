"use client";

import { Children, isValidElement } from "react";
import { MotionReveal } from "./MotionReveal";

// Wraps a list of children (e.g. Hero's eyebrow/heading/text/CTA) and
// reveals them in sequence rather than all at once. Same
// dependency-free approach as MotionReveal — see that file's comment.
export function MotionStagger({
  children,
  className = "",
  staggerMs = 90,
}: {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <div className={className}>
      {items.map((child, i) => (
        <MotionReveal key={child.key ?? i} delayMs={i * staggerMs} y={16}>
          {child}
        </MotionReveal>
      ))}
    </div>
  );
}
