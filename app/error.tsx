"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
