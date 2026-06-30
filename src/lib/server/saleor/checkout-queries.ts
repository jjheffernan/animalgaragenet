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

const CHECKOUT_DISCOUNT_FIELDS = `
  discount { amount currency }
  discountName
`;

/** Update quantities on existing checkout lines. */
export const CHECKOUT_LINES_UPDATE = `
  mutation CheckoutLinesUpdate($id: ID!, $lines: [CheckoutLineUpdateInput!]!) {
    checkoutLinesUpdate(id: $id, lines: $lines) {
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

/** Remove lines from checkout. */
export const CHECKOUT_LINES_DELETE = `
  mutation CheckoutLinesDelete($id: ID!, $linesIds: [ID!]!) {
    checkoutLinesDelete(id: $id, linesIds: $linesIds) {
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
      ${CHECKOUT_DISCOUNT_FIELDS}
    }
  }
`;

/** Apply a voucher or gift card code from Saleor admin. */
export const CHECKOUT_ADD_PROMO_CODE = `
  mutation CheckoutAddPromoCode($id: ID!, $promoCode: String!) {
    checkoutAddPromoCode(id: $id, promoCode: $promoCode) {
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
        ${CHECKOUT_DISCOUNT_FIELDS}
      }
      errors { field message code }
    }
  }
`;

// @saleor-migration: intentional — uncomment for cart line qty; see docs/commerce/saleor.md#quick-migration
// export const CHECKOUT_LINES_UPDATE = `
//   mutation CheckoutLinesUpdate($id: ID!, $lines: [CheckoutLineUpdateInput!]!) {
//     checkoutLinesUpdate(id: $id, lines: $lines) {
//       checkout {
//         id
//         lines {
//           id
//           quantity
//           variant { id name }
//           totalPrice { gross { amount currency } }
//         }
//         totalPrice { gross { amount currency } }
//       }
//       errors { field message code }
//     }
//   }
// `;

// @saleor-migration: intentional — uncomment for cart line remove; see docs/commerce/saleor.md#quick-migration
// export const CHECKOUT_LINES_DELETE = `
//   mutation CheckoutLinesDelete($id: ID!, $linesIds: [ID!]!) {
//     checkoutLinesDelete(id: $id, linesIds: $linesIds) {
//       checkout {
//         id
//         lines {
//           id
//           quantity
//           variant { id name }
//           totalPrice { gross { amount currency } }
//         }
//         totalPrice { gross { amount currency } }
//       }
//       errors { field message code }
//     }
//   }
// `;

// @saleor-migration: intentional — uncomment for shipping address step; see docs/commerce/saleor.md#quick-migration
// export const CHECKOUT_SHIPPING_ADDRESS_UPDATE = `
//   mutation CheckoutShippingAddressUpdate($id: ID!, $shippingAddress: AddressInput!) {
//     checkoutShippingAddressUpdate(id: $id, shippingAddress: $shippingAddress) {
//       checkout {
//         id
//         availableShippingMethods { id name price { amount currency } }
//       }
//       errors { field message code }
//     }
//   }
// `;

// @saleor-migration: intentional — uncomment for shipping method step; see docs/commerce/saleor-payments.md
// export const CHECKOUT_DELIVERY_METHOD_UPDATE = `
//   mutation CheckoutDeliveryMethodUpdate($id: ID!, $deliveryMethodId: ID!) {
//     checkoutDeliveryMethodUpdate(id: $id, deliveryMethodId: $deliveryMethodId) {
//       checkout {
//         id
//         totalPrice { gross { amount currency } }
//         availablePaymentGateways { id name currencies config }
//       }
//       errors { field message code }
//     }
//   }
// `;

// @saleor-migration: intentional — uncomment for payment gateway init; see docs/commerce/saleor-payments.md
// export const PAYMENT_GATEWAY_INITIALIZE = `
//   mutation PaymentGatewayInitialize($id: ID!, $amount: PositiveDecimal, $paymentGateways: [PaymentGatewayToInitialize!]) {
//     paymentGatewayInitialize(id: $id, amount: $amount, paymentGateways: $paymentGateways) {
//       gatewayConfigs { id data errors { field message code } }
//       errors { field message code }
//     }
//   }
// `;

// @saleor-migration: intentional — uncomment for transaction start; see docs/commerce/saleor-payments.md
// export const TRANSACTION_INITIALIZE = `
//   mutation TransactionInitialize($id: ID!, $amount: PositiveDecimal, $paymentGateway: PaymentGatewayToInitialize!, $idempotencyKey: String) {
//     transactionInitialize(id: $id, amount: $amount, paymentGateway: $paymentGateway, idempotencyKey: $idempotencyKey) {
//       transaction { id }
//       transactionEvent { type pspReference }
//       data
//       errors { field message code }
//     }
//   }
// `;

// @saleor-migration: intentional — uncomment after 3DS / redirect; see docs/commerce/saleor-payments.md
// export const TRANSACTION_PROCESS = `
//   mutation TransactionProcess($id: ID!, $data: JSON) {
//     transactionProcess(id: $id, data: $data) {
//       transaction { id }
//       transactionEvent { type pspReference }
//       data
//       errors { field message code }
//     }
//   }
// `;

// @saleor-migration: intentional — uncomment for payment redirect; see docs/commerce/saleor-payments.md
// export const CHECKOUT_COMPLETE = `
//   mutation CheckoutComplete($id: ID!) {
//     checkoutComplete(id: $id) {
//       order { id status number }
//       confirmationNeeded
//       confirmationData
//       errors { field message code }
//     }
//   }
// `;

/** Remove an applied promo code from checkout. */
export const CHECKOUT_REMOVE_PROMO_CODE = `
  mutation CheckoutRemovePromoCode($id: ID!, $promoCode: String!) {
    checkoutRemovePromoCode(id: $id, promoCode: $promoCode) {
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
        ${CHECKOUT_DISCOUNT_FIELDS}
      }
      errors { field message code }
    }
  }
`;
