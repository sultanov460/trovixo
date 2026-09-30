export const shippingConfig = { US: { label: "US delivery", tracking: "when-available" as const } };
export type ShippingCountryConfig = typeof shippingConfig.US;
