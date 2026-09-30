// Development review provider. Intentionally empty: fake reviews are not
// rendered even in mock mode. Connect a legitimate review source later.
import type { Review } from "@/lib/types/review";

export async function getReviews(_productHandle: string): Promise<Review[]> {
  return [];
}
