const PRODUCT_METADATA_FIELDS = `
          metadata { key value }
          attributes {
            attribute { slug name }
            values { name slug plainText }
          }`;

export const PRODUCTS_QUERY = `
  query Products($channel: String!, $first: Int!) {
    products(channel: $channel, first: $first) {
      edges {
        node {
          id
          name
          slug
          description
          thumbnail { url alt }
          pricing {
            priceRange {
              start { gross { amount currency } }
            }
          }
          category { id name slug }
          variants(first: 1) {
            id
            name
            sku
            pricing { price { gross { amount currency } } }
          }
          isAvailableForPurchase${PRODUCT_METADATA_FIELDS}
        }
      }
    }
  }
`;

export const PRODUCT_BY_SLUG_QUERY = `
  query ProductBySlug($slug: String!, $channel: String!) {
    product(slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      media { id url alt type }
      thumbnail { url alt }
      pricing {
        priceRange {
          start { gross { amount currency } }
          stop { gross { amount currency } }
        }
      }
      variants {
        id
        name
        sku
        pricing { price { gross { amount currency } } }
      }
      category { id name slug }
      isAvailableForPurchase${PRODUCT_METADATA_FIELDS}
    }
  }
`;

export const CATEGORIES_QUERY = `
  query Categories($first: Int!, $level: Int) {
    categories(first: $first, level: $level) {
      edges {
        node {
          id
          name
          slug
          children(first: 50) {
            edges {
              node {
                id
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query Collections($channel: String!, $first: Int!) {
    collections(channel: $channel, first: $first) {
      edges {
        node {
          id
          name
          slug
          description
          backgroundImage { url alt }
        }
      }
    }
  }
`;

/** Shop `?collection=` filter — used by `shop-collection.ts` when Saleor is live. */
export const COLLECTION_PRODUCTS_QUERY = `
  query CollectionProducts($slug: String!, $channel: String!, $first: Int!) {
    collection(slug: $slug, channel: $channel) {
      id
      name
      slug
      products(first: $first) {
        edges {
          node {
            id
            name
            slug
            description
            thumbnail { url alt }
            pricing {
              priceRange {
                start { gross { amount currency } }
              }
            }
            category { id name slug }
            variants(first: 1) {
              id
              name
              sku
              pricing { price { gross { amount currency } } }
            }
            isAvailableForPurchase${PRODUCT_METADATA_FIELDS}
          }
        }
      }
    }
  }
`;

export const PRODUCT_SEARCH_QUERY = `
  query ProductSearch($channel: String!, $query: String!, $first: Int!) {
    products(channel: $channel, first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
          description
          thumbnail { url alt }
          pricing {
            priceRange {
              start { gross { amount currency } }
            }
          }
          category { id name slug }
          variants(first: 1) {
            id
            name
            sku
            pricing { price { gross { amount currency } } }
          }
          isAvailableForPurchase${PRODUCT_METADATA_FIELDS}
        }
      }
    }
  }
`;
