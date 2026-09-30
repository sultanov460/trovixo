const domain = (process.env.SHOPIFY_STORE_DOMAIN || "").trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
const handle = (process.env.SHOPIFY_PRODUCT_HANDLE || "").trim();
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();
const publicToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain) || !handle || !(privateToken || publicToken)) {
  console.error("Missing or invalid SHOPIFY_STORE_DOMAIN, SHOPIFY_PRODUCT_HANDLE, or Storefront token in .env.local.");
  process.exit(1);
}

const headers = { "Content-Type": "application/json" };
headers[privateToken ? "Shopify-Storefront-Private-Token" : "X-Shopify-Storefront-Access-Token"] = privateToken || publicToken;
try {
  const response = await fetch(`https://${domain}/api/2026-07/graphql.json`, {
    method: "POST", headers, signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      query: `query CheckProduct($handle: String!, $country: CountryCode!) @inContext(country: $country) { product(handle: $handle) { handle title variants(first: 50) { nodes { availableForSale price { amount currencyCode } } } } }`,
      variables: { handle, country: (process.env.SHOPIFY_COUNTRY_CODE || "US").toUpperCase() },
    }),
  });
  if (!response.ok) throw new Error(`Storefront HTTP ${response.status}; verify domain, token and API access.`);
  const result = await response.json();
  if (result.errors?.length) throw new Error(`Storefront GraphQL error: ${result.errors.map(e => e.message).join("; ")}`);
  const product = result.data?.product;
  if (!product) throw new Error("Product not returned. Check exact handle, Active status, Headless publication and US market availability.");
  const sellable = product.variants.nodes.some(v => v.availableForSale && Number(v.price.amount) > 0);
  console.log(`Product found: ${product.title} (${product.handle}). Sellable variant: ${sellable ? "yes" : "no"}.`);
  if (!sellable) process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : "Storefront check failed.");
  process.exitCode = 1;
}
