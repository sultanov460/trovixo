# Verification — September 30, 2026

## Passed

- Read-only Storefront API query returned Shopify product ID `7935482822715`, handle `trovixo-multicolor-car-christmas-lights`, price USD 39.45 and an available variant.
- TypeScript checks and production build with the real `.env.local` succeeded.
- Browser checks at 1440 px and 390 px: homepage, shop, real product, cart and contact returned 200 without horizontal overflow or JavaScript page errors.
- Browser Add to Cart used the actual Shopify variant. Cart retrieval, quantity update and removal succeeded.
- The app's checkout endpoint returned a real HTTPS Shopify checkout URL. No payment was made and no order was submitted.
- Cart cookie is HttpOnly. The public cart response contains no Shopify cart ID or checkout URL. An unrelated variant returned 400; a cross-origin mutation returned 403.
- Middleware returns 404 for other product and collection URLs.
- Gallery entry motion avoids fading out the product photo and respects reduced-motion preferences.

`preview/` contains current browser screenshots and `browser-checks.json`.

## Not confirmed by these checks

Successful payment, tax and shipping configuration at checkout, actual supplier stock/fulfillment, and the seller's legal identity or final policy wording. Seller fields remain blank and policies are drafts; indexing stays off until readiness checks pass. Shopify Admin settings and existing orders were not modified. The local environment enables technical cart/checkout controls; no hosted site was deployed.
