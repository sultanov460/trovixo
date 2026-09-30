// Content remains visible during server rendering and without JavaScript.
export function MotionReveal({ children, className = "" }: { children: React.ReactNode; className?: string; delayMs?: number; y?: number }) {
 return <div className={className}>{children}</div>;
}
