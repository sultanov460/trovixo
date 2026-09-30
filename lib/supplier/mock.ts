// MOCK SUPPLIER — for Phase 1/2 development only.
// Replace with a real adapter (e.g. CJdropshipping) in Phase 3 by
// implementing the same `Supplier` interface. Nothing outside this file
// should need to change.

import type { Supplier, SupplierProduct, InventoryStatus, ShippingEstimate, OrderPayload, SupplierOrderResult, TrackingInfo } from "./types";

export class MockSupplier implements Supplier {
  async getProduct(supplierId: string): Promise<SupplierProduct> {
    return {
      supplierId,
      title: "Mock supplier product",
      costPrice: 12.5,
      currencyCode: "USD",
      inStock: true,
    };
  }

  async getInventory(supplierId: string): Promise<InventoryStatus> {
    return { supplierId, inStock: true, quantityAvailable: 100 };
  }

  async getShipping(supplierId: string, country: string): Promise<ShippingEstimate> {
    return { country, minDays: 7, maxDays: 12 };
  }

  async createOrder(order: OrderPayload): Promise<SupplierOrderResult> {
    return { supplierOrderId: `mock-${order.shopifyOrderId}`, status: "created" };
  }

  async getTracking(supplierOrderId: string): Promise<TrackingInfo> {
    return { supplierOrderId, status: "processing" };
  }
}

export const supplier: Supplier = new MockSupplier();
