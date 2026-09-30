import { launchReady } from "@/lib/launch";
import type { MetadataRoute } from "next";
import { getAllProductHandles } from "@/lib/data";
import { getSiteUrl } from "@/lib/utils/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!launchReady()) return [];
  const base = getSiteUrl();
  const products = await getAllProductHandles();

  // No `lastModified` here — we have no genuine last-changed date for
  // these static/legal pages, and fabricating "now" on every build
  // would be a false signal to crawlers rather than a truthful one.
  // /cart is intentionally excluded: it's a transactional, per-session
  // page with nothing indexable.
  const staticRoutes = ["", "/about", "/contact", "/shipping", "/returns", "/privacy", "/terms", "/legal-notice", "/collections/all"].map(
    (path) => ({ url: `${base}${path}` })
  );

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.handle}`,
    ...(p.updatedAt ? { lastModified: new Date(p.updatedAt) } : {}),
  }));

  return [...staticRoutes, ...productRoutes];
}
