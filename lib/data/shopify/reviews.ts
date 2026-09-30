// Real review source, once one is connected (a Shopify review app's
// API/metafields, or a first-party reviews table). Until then this
// intentionally returns an empty array rather than fabricating reviews —
// showing mock reviews as if they were real customer feedback in live
// mode would be misleading.

import type { Review } from "@/lib/types/review";

export async function getReviews(_productHandle: string): Promise<Review[]> {
  return [];
}
