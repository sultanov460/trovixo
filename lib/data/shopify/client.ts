import { SHOPIFY_API_VERSION } from "./config";
import { headers } from "next/headers";
import { isIP } from "node:net";
const domain = (process.env.SHOPIFY_STORE_DOMAIN || "").trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();
const publicToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
export const isShopifyConfigured = Boolean(/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain) && (privateToken || publicToken));
type Strategy = "catalog" | "no-store";
export async function shopifyFetch<T>(query:string, variables?:Record<string,unknown>, cacheStrategy:Strategy="catalog"):Promise<T> {
 if (!isShopifyConfigured) throw new Error("Shopify connection is not configured.");
 const authHeaders: Record<string,string> = {"Content-Type":"application/json"};
 if (privateToken) authHeaders["Shopify-Storefront-Private-Token"] = privateToken;
 else authHeaders["X-Shopify-Storefront-Access-Token"] = publicToken!;
 // Set only for a header guaranteed to be overwritten by your trusted proxy.
 // Vercel's platform-provided header is used on Vercel. No arbitrary client IP trust.
 if (cacheStrategy === "no-store") {
  const name = process.env.TRUSTED_PROXY_IP_HEADER || (process.env.VERCEL === "1" ? "x-vercel-forwarded-for" : "");
  if (name) {
   const requestHeaders = await headers();
   const ip = requestHeaders.get(name)?.split(",")[0]?.trim();
   if (ip && isIP(ip)) authHeaders["Shopify-Storefront-Buyer-IP"] = ip;
  }
 }
 const response = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`,{
  method:"POST", headers:authHeaders, body:JSON.stringify({query,variables}), signal:AbortSignal.timeout(15000),
  ...(cacheStrategy === "no-store" ? {cache:"no-store" as const} : {next:{revalidate:60}})
 });
 if (!response.ok) throw new Error("The store is temporarily unavailable. Please try again.");
 const json = await response.json() as {data?:T;errors?:{message:string}[]};
 if (json.errors?.length || !json.data) throw new Error("We could not complete this request. Please try again.");
 return json.data;
}
