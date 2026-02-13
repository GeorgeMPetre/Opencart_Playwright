# TEST_PLAN.md

# Test Plan – OpenCart UI Automation (Playwright)

## 1. Objective

The objective of this automation effort is to validate core OpenCart UI functionality using automated browser-based testing with Playwright.

The test suite focuses on ensuring that primary customer workflows function correctly and consistently across supported browsers.

---

## 2. Scope

### In Scope
- User registration
- Login and logout
- Product browsing
- Product details validation
- Cart operations (add, remove, update quantity)
- Checkout flow (excluding payment gateway integration)
- UI form validation and error handling

### Out of Scope
- API testing
- Performance and load testing
- Security and penetration testing
- Third-party integrations
- Payment gateway validation
- Mobile responsiveness validation

---

## 3. Test Strategy

### Automation Type
UI automation using Playwright Test framework.

### Design Pattern
Page Object Model (POM):
- Separation of test logic and UI interaction
- Improved maintainability
- Reduced duplication

### Test Design Principles
- Behaviour-driven structure
- Clear assertions
- Isolation of test data where possible
- Repeatable and deterministic test runs

### Execution Approach
- Tests executed via Playwright Test Runner
- Headless and headed execution supported
- HTML reporting enabled

---

## 4. Environment

- Application: OpenCart (local instance)
- Hosting: XAMPP
- OS: Windows 11
- Language: TypeScript
- Framework: Playwright Test
- Browsers:
  - Chromium
  - Firefox
  - WebKit

---

## 5. Entry and Exit Criteria

### Entry Criteria
- OpenCart is accessible locally
- Required test data exists
- Dependencies installed
- Playwright browsers installed

### Exit Criteria
- All critical flows executed
- Defects logged if found
- Execution report generated
- Known limitations documented

---

## 6. Risks and Assumptions

- Local environment instability
- Test data dependency
- Timing issues due to machine performance
- Configuration-related checkout behaviour

Mitigation includes stable waits, controlled test data, and documented environment setup.
