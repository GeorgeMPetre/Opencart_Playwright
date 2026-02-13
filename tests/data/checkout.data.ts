export const CHECKOUT_DATA = {
  credentials: {
    email: "validEmail@gmail.com",
    password: "ValidPass123",
  },

  products: {
    hp: "HP LP3065",
    macbook: "MacBook",
    macbookAir: "MacBook Air",
    imac: "iMac",
  },

  address: {
    firstname: "John",
    lastname: "Doe",
    address1: "123 Testing Street",
    city: "Testville",
    postcode: "CT1 2AB",
    country: "United Kingdom",
    zone: "Kent",
  },
} as const;
