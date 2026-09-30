import { EmptyState } from "@/components/ui/EmptyState";

export default function CollectionNotFound() {
  return (
    <EmptyState
      title="Collection not found"
      body="This collection may have been removed or the link may be incorrect."
      actionHref="/"
      actionLabel="Back to home"
    />
  );
}
