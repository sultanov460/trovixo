// Analytics stubs. Intentionally inert in Phase 1 — no third-party
// scripts are loaded yet (see project requirement: don't add tracking
// scripts until they're actually needed). Phase 5 wires these into GA4,
// Meta Pixel, and TikTok Pixel, and reads UTM params captured here.

export function captureUtmParams(searchParams: URLSearchParams) {
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "source"];
  const captured: Record<string, string> = {};
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) captured[key] = value;
  }
  return captured;
}

export function trackEvent(name: string, payload?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`[analytics stub] ${name}`, payload);
  }
  // Phase 5: dispatch to GA4 / Meta Pixel / TikTok Pixel here.
}
