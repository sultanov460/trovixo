// Lightweight shape for anything rendering ProductCard (catalogue grids,
// related products, product discovery) — these only ever show a title,
// one image, price/compare-at, availability, and the delivery estimate.
// Fetching full variant image/selectedOptions or the description/
// benefits/specs/FAQ metafields for every card in a grid is pure waste;
// GET_PRODUCT_BY_HANDLE (the actual product page) uses the full
// ProductDetailFragment below instead.
export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCardFragment on Product {
    id
    handle
    title
    images(first: 1) {
      nodes {
        url
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 10) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
    shippingMinDays: metafield(namespace: "custom", key: "shipping_min_days") { value type }
    shippingMaxDays: metafield(namespace: "custom", key: "shipping_max_days") { value type }
  }
`;

export const PRODUCT_DETAIL_FRAGMENT = /* GraphQL */ `
  fragment ProductDetailFragment on Product {
    id
    handle
    title
    description
    images(first: 10) {
      nodes {
        url
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
    variants(first: 50) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          url
        }
      }
    }
    shippingMinDays: metafield(namespace: "custom", key: "shipping_min_days") { value type }
    shippingMaxDays: metafield(namespace: "custom", key: "shipping_max_days") { value type }
    processingMinDays: metafield(namespace: "custom", key: "processing_min_days") { value type }
    processingMaxDays: metafield(namespace: "custom", key: "processing_max_days") { value type }
    shippingOrigin: metafield(namespace: "custom", key: "shipping_origin") { value type }
    shippingMethod: metafield(namespace: "custom", key: "shipping_method") { value type }
    tagline: metafield(namespace: "custom", key: "tagline") { value type }
    benefits: metafield(namespace: "custom", key: "benefits") { value type }
    specifications: metafield(namespace: "custom", key: "specifications") { value type }
    faqs: metafield(namespace: "custom", key: "faqs") { value type }
  }
`;

export const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query GetProductByHandle($handle: String!, $country: CountryCode!) @inContext(country: $country) {
    product(handle: $handle) {
      ...ProductDetailFragment
    }
  }
  ${PRODUCT_DETAIL_FRAGMENT}
`;

// Full detail for every result — used only by getHeroProduct, where the
// homepage's Hero/FeaturedProduct/ProblemSolution/ProductDemo/FinalCta
// sections genuinely need tagline, benefits, and multiple images for
// whichever product lands there.
export const GET_COLLECTION_PRODUCTS = /* GraphQL */ `
  query GetCollectionProducts($handle: String!, $first: Int!, $country: CountryCode!) @inContext(country: $country) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          ...ProductDetailFragment
        }
      }
    }
  }
  ${PRODUCT_DETAIL_FRAGMENT}
`;

// Card-weight product list — used for related/discovery product grids.
export const GET_COLLECTION_PRODUCT_CARDS = /* GraphQL */ `
  query GetCollectionProductCards($handle: String!, $first: Int!, $country: CountryCode!) @inContext(country: $country) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          ...ProductCardFragment
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const GET_COLLECTION_BY_HANDLE = /* GraphQL */ `
  query GetCollectionByHandle($handle: String!, $first: Int!, $country: CountryCode!) @inContext(country: $country) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first) {
        nodes {
          ...ProductCardFragment
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

// The absolute minimum for building a sitemap: just enough to build a
// URL and, where Shopify has it, a real last-modified date — no
// images/prices/variants at all.
export const GET_COLLECTION_PRODUCT_HANDLES = /* GraphQL */ `
  query GetCollectionProductHandles($handle: String!, $first: Int!, $country: CountryCode!) @inContext(country: $country) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          handle
          updatedAt
        }
      }
    }
  }
`;
