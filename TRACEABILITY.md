# TRACEABILITY.md

# Traceability Matrix – OpenCart UI Automation

This document maps application features to automated test coverage.

| Feature | Automated Test Coverage |
|----------|------------------------|
| User Registration | Registration success test, validation error tests |
| User Login | Valid login, invalid login |
| Logout | Logout flow validation |
| Product Browsing | Category navigation, product list visibility |
| Product Details | Product information verification |
| Add to Cart | Add product to cart validation |
| Update Cart | Quantity update validation |
| Remove from Cart | Remove item validation |
| Checkout Flow | Checkout navigation and order confirmation (excluding payment gateway) |
| Form Validation | Required field validation, invalid input handling |

---

## Coverage Notes

- Negative scenarios are included where relevant.
- Boundary conditions are tested for form fields.
- Known OpenCart configuration dependencies are documented.
