export const TAGS = {
  // ---------------------------
  // Suites / modules
  // ---------------------------
  suites: {
    registration: ["@registration", "@ui"],
    login: ["@login", "@ui"],
    navigation: ["@navigation", "@ui"],
    cart: ["@cart", "@ui"],
    checkout: ["@checkout", "@ui"],
  },

  // ---------------------------
  // Test type buckets
  // ---------------------------
  type: {
    positive: ["@positive", "@functional", "@smoke", "@regression"],
    negative: ["@negative", "@functional", "@regression"],
    boundary: ["@boundary", "@functional", "@regression"],
    edge: ["@edge", "@functional", "@regression"],
    security: ["@security", "@functional", "@regression"],
  },

  // ---------------------------
  // Auth state
  // ---------------------------
  auth: {
    authenticated: ["@authenticated", "@functional", "@regression"],
    unauthenticated: ["@unauthenticated", "@functional", "@regression"],
    session: ["@session"],
  },

  // ---------------------------
  // Feature areas
  // ---------------------------
  feature: {
    header: ["@header_navigation", "@ui"],
    categories: ["@category_navigation", "@functional"],
    account: ["@account_navigation", "@functional"],

    currency: ["@currency", "@ui"],
    wishlist: ["@wishlist_navigation", "@functional"],

    cartOps: ["@cart_ops", "@functional"],          // add/edit/remove
    cartPersistence: ["@cart_persistence", "@functional"],
    pricing: ["@pricing", "@functional"],
    emptyCart: ["@empty_cart", "@ui"],

    checkoutFlow: ["@checkout_flow", "@functional"],
    postCheckout: ["@post_checkout", "@functional"],
    orderHistory: ["@order_history", "@functional"],

    affiliate: ["@affiliate", "@functional"],
    newsletter: ["@newsletter", "@functional"],
  },
} as const;
