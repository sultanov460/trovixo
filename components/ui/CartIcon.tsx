// A clear, recognizable shopping basket icon. Kept as a plain inline SVG
// rather than adding an icon library dependency, since this is the only
// icon the site currently needs.
export function CartIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 8h16l-1.5 10.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 8Z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      <path d="M9 12v3" />
      <path d="M15 12v3" />
    </svg>
  );
}
