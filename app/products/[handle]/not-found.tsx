import { EmptyState } from "@/components/ui/EmptyState";

export default function ProductNotFound() {
  return (
    <EmptyState
      title="Product not found"
      body="This product may have been removed or the link may be incorrect."
      actionHref="/collections/all"
      actionLabel="Browse all products"
    />
  );
}
