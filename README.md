# OpenCart Automation Testing Project (UI – Playwright)

This repository contains an automated UI testing project for the OpenCart e-commerce platform using Playwright and TypeScript.

The project focuses on validating core customer journeys through real browser automation, following a structured Page Object Model approach.

The tests simulate real user behaviour and verify functional correctness and essential UI behaviour across key workflows.

Automation improves repeatability, reduces manual effort, and provides stable regression coverage.

---

## Project purpose

The main goals of this project are:

- Automate core OpenCart UI user flows using Playwright
- Validate functionality through real browser interaction
- Cover both positive and negative scenarios
- Apply clean test design using Page Object Model (POM)
- Maintain readable, scalable TypeScript-based test code
- Support consistent regression testing

---

## System under test

- Application: OpenCart
- Type: Web application (UI)
- Automation Framework: Playwright Test
- Language: TypeScript
- Environment: Local instance (XAMPP)
- OS: Windows 11
- Browsers: Chromium, Firefox, WebKit

---

## Test scope

### In scope
- User registration
- Login and logout
- Product browsing
- Cart functionality
- Checkout flow
- Core UI validations and form behaviour

### Out of scope
- API testing
- Performance or load testing
- Security testing
- Third-party integrations
- Payment gateway validation

---

## Test approach

- Automated UI testing using Playwright Test runner
- Page Object Model for separation of concerns
- Tests written in TypeScript
- Test cases focus on user behaviour rather than internal implementation
- Assertions validate:
  - Page navigation
  - Element visibility
  - Form validation messages
  - Successful and failed user flows
- Known defects are documented transparently

---

## Repository structure

├── tests/  
├── pages/  
├── utils/  
├── playwright.config.ts  
├── README.md  
├── TEST_PLAN.md    
├── TRACEABILITY.md  
├── TEST_SUMMARY.md  

---

## How to run the tests

Ensure OpenCart is running locally.

1. Install dependencies:

   npm install

2. Install Playwright browsers:

   npx playwright install

3. Execute the test suite:

   npx playwright test

4. Open HTML report:

   npx playwright show-report

Exact commands may vary depending on environment configuration.

---

## Documentation included

- TEST_PLAN.md – scope, automation strategy, environment details  
- TRACEABILITY.md – mapping between features and automated tests  
- TEST_SUMMARY.md – execution results and findings    

---

## Limitations

- Tests run against a local XAMPP environment
- Execution speed depends on machine performance
- Some behaviours depend on OpenCart configuration and test data
- Payment and external modules are not automated

These limitations are intentional and documented.

---

## Author

George Petre  
Portfolio: https://georgempetre.github.io
