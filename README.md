# OpenCart UI Automation (Playwright + TypeScript)

## What this is
A ready-to-import Playwright Test project using TypeScript.
It follows a simple Page Object Model in `/pages` and tests in `/tests`.

## Prereqs
- Node.js 18+ recommended
- OpenCart running locally or in a test environment

## Setup
1) Install deps
```bash
npm install
npx playwright install --with-deps
```

2) Configure env
```bash
cp .env.example .env
# edit .env
```

3) Run tests
```bash
npm test
```

4) View report
```bash
npm run report
```

## Project layout
- pages/   Page Objects
- tests/   Test specs
- utils/   helpers + test data
- reports/ html output (generated)
- TEST_PLAN.md, TEST_ROADMAP.md, TRACEABILITY.md, TEST_SUMMARY.md
