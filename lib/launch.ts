import { storeSettings } from "@/content/store-settings";
import { isShopifyConfigured } from "@/lib/data/shopify/client";
import { SHOPIFY_PRODUCT_HANDLE } from "@/lib/data/shopify/config";
export function launchIssues(): string[] {
 const issues: string[] = [];
 if (!storeSettings.launchEnabled) issues.push("NEXT_PUBLIC_STORE_LAUNCH_ENABLED");
 if (!storeSettings.policyApproved) issues.push("POLICIES_APPROVED");
 if (!isShopifyConfigured) issues.push("SHOPIFY_STORE_DOMAIN and a valid Storefront token");
 if (!SHOPIFY_PRODUCT_HANDLE) issues.push("SHOPIFY_PRODUCT_HANDLE");
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeSettings.supportEmail)) issues.push("NEXT_PUBLIC_SUPPORT_EMAIL");
 if (!storeSettings.businessName.trim()) issues.push("NEXT_PUBLIC_BUSINESS_NAME");
 if (!storeSettings.businessAddress.trim()) issues.push("NEXT_PUBLIC_BUSINESS_ADDRESS");
 if (!storeSettings.businessCountry.trim()) issues.push("NEXT_PUBLIC_BUSINESS_COUNTRY");
 return issues;
}
// Technical purchase controls are separate from editorial policy approval.
// Shopify remains responsible for final inventory, payment and delivery checks.
export function commerceEnabled() {
 return storeSettings.launchEnabled && isShopifyConfigured && Boolean(SHOPIFY_PRODUCT_HANDLE);
}
export function launchReady() { return launchIssues().length === 0; }
