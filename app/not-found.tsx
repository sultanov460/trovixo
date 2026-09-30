import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      body="The page you're looking for doesn't exist or may have moved."
      actionHref="/"
      actionLabel="Back to home"
    />
  );
}
