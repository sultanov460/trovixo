// Supplier abstraction. The rest of the app only ever depends on this
// interface — never on a specific supplier SDK (CJdropshipping, Zendrop,
// DSers, etc). Swap the concrete implementation in Phase 3 without
// touching UI or Shopify integration code.

export type SupplierProduct = {
  supplierId: string;
  title: string;
  costPrice: number;
  currencyCode: string;
  inStock: boolean;
};

export type InventoryStatus = {
  supplierId: string;
  inStock: boolean;
  quantityAvailable?: number;
};

export type ShippingEstimate = {
  country: string;
  minDays: number;
  maxDays: number;
};

export type OrderPayload = {
  shopifyOrderId: string;
  lineItems: { supplierId: string; quantity: number }[];
  shippingAddress: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    provinceCode: string;
    zip: string;
    countryCode: string;
  };
};

export type SupplierOrderResult = {
  supplierOrderId: string;
  status: "created" | "failed";
};

export type TrackingInfo = {
  supplierOrderId: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  status: "processing" | "shipped" | "delivered" | "unknown";
};

export interface Supplier {
  getProduct(supplierId: string): Promise<SupplierProduct>;
  getInventory(supplierId: string): Promise<InventoryStatus>;
  getShipping(supplierId: string, country: string): Promise<ShippingEstimate>;
  createOrder(order: OrderPayload): Promise<SupplierOrderResult>;
  getTracking(supplierOrderId: string): Promise<TrackingInfo>;
}
