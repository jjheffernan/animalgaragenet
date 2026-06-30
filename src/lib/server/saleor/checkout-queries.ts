/** Create an empty checkout on a channel. */
export const CHECKOUT_CREATE = `
  mutation CheckoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
            name
            pricing {
              price { gross { amount currency } }
            }
            product {
              id
              name
              slug
              thumbnail { url alt }
            }
          }
          totalPrice { gross { amount currency } }
        }
        totalPrice { gross { amount currency } }
      }
      errors { field message code }
    }
  }
`;

/** Add or merge lines on an existing checkout. */
export const CHECKOUT_LINES_ADD = `
  mutation CheckoutLinesAdd($id: ID!, $lines: [CheckoutLineInput!]!) {
    checkoutLinesAdd(id: $id, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
            name
            pricing {
              price { gross { amount currency } }
            }
            product {
              id
              name
              slug
              thumbnail { url alt }
            }
          }
          totalPrice { gross { amount currency } }
        }
        totalPrice { gross { amount currency } }
      }
      errors { field message code }
    }
  }
`;

/** Read checkout lines for cart display. */
export const CHECKOUT_GET = `
  query Checkout($id: ID!) {
    checkout(id: $id) {
      id
      lines {
        id
        quantity
        variant {
          id
          name
          pricing {
            price { gross { amount currency } }
          }
          product {
            id
            name
            slug
            thumbnail { url alt }
          }
        }
        totalPrice { gross { amount currency } }
      }
      totalPrice { gross { amount currency } }
    }
  }
`;
