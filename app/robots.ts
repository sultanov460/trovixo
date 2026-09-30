import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/api/"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
