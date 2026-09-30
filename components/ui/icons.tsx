// Small inline icons shared across the storefront. Kept as plain SVG
// rather than adding an icon library, matching the existing pattern
// (see CartIcon) — this is the only additional icon currently needed.

export function TruckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h3.5l3 3V16H14z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}
