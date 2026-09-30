import Link from "next/link";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">{body}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-primary mt-6 inline-flex">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
