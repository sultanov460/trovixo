// Fill these settings before launch. Prices and variants remain in Shopify.
export const storeSettings = {
  launchEnabled: process.env.NEXT_PUBLIC_STORE_LAUNCH_ENABLED === "true",
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || "",
  businessAddress: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "",
  businessCountry: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || "",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
  returnWindowDays: 30,
  refundProcessingDays: 10,
  // Working policy: customer pays change-of-mind return postage;
  // Trovixo covers return postage for confirmed faulty/incorrect items.
  policyApproved: process.env.POLICIES_APPROVED === "true",
};
