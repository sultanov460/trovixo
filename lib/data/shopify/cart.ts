import { shopifyFetch } from "./client";
import { CART_CREATE, CART_LINES_ADD, CART_LINES_UPDATE, CART_LINES_REMOVE, GET_CART } from "./mutations";
import type { Cart, CartLine } from "@/lib/types/cart";
import { SHOPIFY_COUNTRY_CODE } from "./config";

type ShopifyCartNode = {
  id: string;
  checkoutUrl: string;
  cost: { subtotalAmount: { amount: string; currencyCode: string } };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: {amount:string;currencyCode:string} };
      merchandise: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        image: { url: string } | null;
        product: { handle: string; title: string };
      };
    }[];
  };
};

type ShopifyUserError = { message: string; field?: string[] | null };
type CartMutationPayload = { cart: ShopifyCartNode | null; userErrors: ShopifyUserError[] };

function mapCart(c: ShopifyCartNode): Cart {
  const lines: CartLine[] = c.lines.nodes.map((n) => ({
    id: n.id,
    variantId: n.merchandise.id,
    productHandle: n.merchandise.product.handle,
    title: n.merchandise.product.title,
    variantTitle: n.merchandise.title,
    price: { amount: Number.parseFloat(n.merchandise.price.amount), currencyCode: n.merchandise.price.currencyCode },
    image: n.merchandise.image?.url,
    quantity: n.quantity,
    total: { amount: Number(n.cost.totalAmount.amount), currencyCode:n.cost.totalAmount.currencyCode },
  }));

  return {
    id: c.id,
    lines,
    subtotal: { amount: Number.parseFloat(c.cost.subtotalAmount.amount), currencyCode: c.cost.subtotalAmount.currencyCode },
    checkoutUrl: c.checkoutUrl,
  };
}

function validateQuantity(quantity: number): number {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error("Quantity must be a whole number between 1 and 99.");
  }
  return quantity;
}

function unwrapMutation(payload: CartMutationPayload, fallbackMessage: string): Cart {
  if (payload.userErrors?.length) {
    throw new Error(payload.userErrors.map((error) => error.message).join(" "));
  }
  if (!payload.cart) throw new Error(fallbackMessage);
  return mapCart(payload.cart);
}

export async function createCart(variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartMutationPayload }>(
    CART_CREATE,
    {
      lines: [{ merchandiseId: variantId, quantity: validateQuantity(quantity) }],
      buyerIdentity: { countryCode: SHOPIFY_COUNTRY_CODE },
    },
    "no-store"
  );
  return unwrapMutation(data.cartCreate, "Shopify could not create the cart.");
}

export async function addCartLine(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationPayload }>(
    CART_LINES_ADD,
    {
      cartId,
      lines: [{ merchandiseId: variantId, quantity: validateQuantity(quantity) }],
    },
    "no-store"
  );
  return unwrapMutation(data.cartLinesAdd, "Shopify could not add this item to the cart.");
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationPayload }>(
    CART_LINES_UPDATE,
    {
      cartId,
      lines: [{ id: lineId, quantity: validateQuantity(quantity) }],
    },
    "no-store"
  );
  return unwrapMutation(data.cartLinesUpdate, "Shopify could not update this cart item.");
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationPayload }>(
    CART_LINES_REMOVE,
    {
      cartId,
      lineIds: [lineId],
    },
    "no-store"
  );
  return unwrapMutation(data.cartLinesRemove, "Shopify could not remove this cart item.");
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const data = await shopifyFetch<{ cart: ShopifyCartNode | null }>(GET_CART, { cartId }, "no-store");
  return data.cart ? mapCart(data.cart) : undefined;
}
