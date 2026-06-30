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
          isAvailableForPurchase
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
      isAvailableForPurchase
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
