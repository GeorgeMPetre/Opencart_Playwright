const uniqueEmail = (prefix = "user") =>
  `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}@test.com`;
export { uniqueEmail };