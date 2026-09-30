// Review data contract. Backed by clearly-labeled mock data in Phase 1.
// Intended real sources later: Shopify product reviews metafields, a
// review app (e.g. Judge.me / Loox), or a first-party reviews table.

export type Review = {
  id: string;
  productHandle: string;
  reviewerName: string;
  rating: number; // 1-5
  title?: string;
  body: string;
  date: string; // ISO date
  verified?: boolean;
  isMock?: boolean;
};
