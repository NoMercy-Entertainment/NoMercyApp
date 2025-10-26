Project-specific development guidelines

This document captures project-native knowledge that speeds up development, testing, and debugging for NoMercy.App (Vue 3 + Ionic + Capacitor + Vite).

Build and configuration
- Package manager: Yarn Classic (1.22.x). The repository pins yarn@1.22.22; use Yarn, not npm or pnpm.
- Node: Use a modern LTS (>=18). Some tooling (Vite, Vitest, Cypress 15) expects recent Node features.
- Install: yarn install triggers patch-package via postinstall. If install fails, re-run yarn and ensure git applies patches in /patches.
- Dev server:
  - Generic web: yarn dev (Vite dev server; host binding enabled). Default preview uses port 5502.
  - Preview a production build: yarn preview:build (build + preview on http://localhost:5502).
- Mobile (Capacitor): The project includes convenience scripts that assume a LAN host and fixed port. Adjust IPs for your network.
  - Android (device over LAN):
    - yarn dev:android
    - yarn dev:phone (sets a specific ADB target)
    - yarn dev:tv / yarn dev:emu
  - Platform builds:
    - yarn build:android → ionic capacitor build android
    - yarn build:ios → ionic capacitor build ios
- Vite notes:
  - Vite config (vite.config.ts) integrates Ionic and Tailwind. Some plugins (CSP, PWA, analyzer) activate based on mode.
  - Analyze bundles with yarn analyze (generates build then opens analyzer in docs/).
- Environment and ports:
  - Dev/preview runs on 5502 (see scripts). Cypress baseUrl is http://localhost:5502, so prefer yarn preview:build when running e2e locally.
  - If you change the dev port/host, update cypress.config.ts baseUrl accordingly.

Testing
Unit tests (Vitest)
- Runner: Vitest 3.x, TypeScript ready out of the box; jsdom is available if you need DOM APIs, but prefer pure unit tests where possible.
- Commands:
  - Run all tests: yarn test:unit
  - Typical patterns: tests/unit/**/*.spec.ts
- Example: We replaced an outdated sample that referenced a removed Tab1Page.vue with a stable utility test. The current example demonstrates how to add tests for src/lib/utils.ts.
  - File: tests/unit/example.spec.ts
  - What it tests: utils.cn (clsx + tailwind-merge) precedence rules.
  - Add your tests by co-locating *.spec.ts under tests/unit or next to the module with .spec.ts; Vitest will pick them up.
- Tips:
  - Use path aliases (@/...) as configured by tsconfig.json and Vite.
  - For Vue components, install @vue/test-utils and set up jsdom if you need DOM rendering. Keep tests focused on props/outputs rather than full Ionic rendering.

End-to-end tests (Cypress)
- Cypress 15 is configured via cypress.config.ts with:
  - specs: tests/e2e/specs/**/*.cy.ts
  - support: tests/e2e/support/e2e.ts
  - baseUrl: http://localhost:5502
  - videos/screenshots output under tests/e2e/
- How to run locally:
  1) Build + preview on the expected port: yarn preview:build (serves at http://localhost:5502).
  2) Run e2e headless: yarn test:e2e (cypress run)
     - or interactive: npx cypress open and select E2E mode.
- Adding new e2e tests:
  - Create tests under tests/e2e/specs/*.cy.ts and use cy.visit('/') to target the preview server. Prefer deterministic selectors (data-testid) rather than classes.
  - If UI depends on backend services, consider mocking network responses (cy.intercept) for hermetic tests.

Demonstration test that works
- Unit: tests/unit/example.spec.ts
  - Purpose: Validates that cn merges Tailwind classes with expected precedence and filters falsy conditionals.
  - Status: Should pass on a clean checkout after yarn install and yarn test:unit.
- Note: Prior sample unit test referenced a non-existent Tab1Page.vue; it was replaced to keep the test suite green.

Code style and conventions
- ESLint: @antfu/eslint-config with Vue a11y enabled; several rules are intentionally disabled for this codebase (e.g., vue/multi-word-component-names, no-console, ban-ts-comment, no-explicit-any). Respect these overrides—don’t re-enable globally unless discussed.
- Formatting: stylistic config enforces tabs for indentation, single quotes, and semicolons.
- TypeScript: Strictness is relaxed in places. Use explicit any sparingly but pragmatically in UI glue code; prefer typed APIs in core logic.
- Vue 3 + Ionic:
  - Use <script setup lang="ts"> where possible.
  - Components often rely on Ionic web components; shallow-mount in unit tests to avoid heavy DOM.
- TailwindCSS: Use clsx + tailwind-merge via utils.cn to compose classes safely. Prefer cn() over manual string concatenation.

Debugging tips
- Vite dev server with --host can be accessed from LAN devices. If HMR behaves oddly on Android TV/device, use yarn preview:build for a closer-to-prod preview.
- Capacitor plugins (Android full screen, edge-to-edge) are present; when running in browser, guard calls behind isPlatform('android') checks as in src/lib/utils.ts and similar.
- Route helpers live in src/store/routeState.ts; when testing navigation logic, prefer unit tests of derived state rather than full router e2e.

Common pitfalls
- Do not run npm install; it may desynchronize lockfile and patched dependencies.
- Ensure the preview server runs on 5502 when executing Cypress tests, or update cypress.config.ts baseUrl.
- Some tests or components may rely on Ionic slots/shadow DOM; use findComponent and data-testid rather than brittle text selectors.

Minimal quickstart
- Install deps: yarn
- Run dev: yarn dev
- Run unit tests: yarn test:unit
- Run e2e:
  - yarn preview:build
  - yarn test:e2e

Change log for this doc
- 2025-10-18: Added project-specific build, testing, and style guidance. Replaced outdated unit test with utils.cn coverage to ensure green baseline.
