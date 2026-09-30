# Trovixo Shopify headless storefront

Next.js 15, React 19 and TypeScript storefront connected to one Shopify product. Full Russian setup instructions are in [START-HERE-RU.md](START-HERE-RU.md).

## Run

```sh
npm ci
npm run check:shopify
npm run dev
```

The supplied local `.env.local` contains the user's Storefront configuration. `.env.example` is a template with a blank token; do not overwrite the working configuration with it. For deployment, set the environment variables on your Node-compatible host and set the real HTTPS site URL before rebuilding. This app is not a Shopify Liquid theme.

Product `7935482822715` is accessed by its exact configured handle without a collection. Product routes, catalog, sitemap, cart variants and existing cart lines use this single product boundary. Price and inventory come from Shopify. Public Storefront credentials are used server-side; no Admin API token is needed.

`NEXT_PUBLIC_STORE_LAUNCH_ENABLED` controls technical purchase availability. Policy approval and seller details are separate readiness checks for removing policy draft notices and enabling indexing. This local version enables cart/checkout integration, but no deployed storefront, payment gateway settings, policies or orders were changed.

```sh
npm run typecheck
npm run build
npm start
```

See `VERIFICATION.md` for actual verification and remaining external setup. Supplied lifestyle imagery is illustrative; confirm the product and fulfillment details with the supplier before accepting real orders.
