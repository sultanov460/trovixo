// Single source of truth for the site's public URL.
// Production should set NEXT_PUBLIC_SITE_URL explicitly. On Vercel we can
// safely derive a URL from the deployment environment; local development
// falls back to localhost instead of publishing placeholder domains.
function normalizeUrl(value: string): string {
  const trimmed = value.trim().replace(/\/$/, "");
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return normalizeUrl(explicit);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return normalizeUrl(vercelProduction);

  const vercel = process.env.VERCEL_URL;
  if (vercel) return normalizeUrl(vercel);

  return "http://localhost:3000";
}
