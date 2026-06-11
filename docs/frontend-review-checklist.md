# Frontend review — checklist & execution plan

Checklist derived from the frontend code review (Angular 19.2, mock-data MVP phase). Use this to track remediation and scaling work.

**How to use this doc**

- Check off items as they ship (`[ ]` → `[x]`).
- Each section has an **Execution plan** with concrete steps, files, and done-when criteria.
- Suggested order: **P0 → P1 → P2 → P3** (dependencies noted where relevant).

---

## P0 — Fix before scaling the team or API

### 1. Extract shared `ActiveQuoteCard` component

- [x] Create reusable active-quote card (plate row, View Quote, status banners)
- [x] Replace duplicated markup in home and quotation hub
- [x] Move shared quote display helpers out of page components
- [x] Verify in-progress, ready-notice, and ready-dismissed states on both surfaces

**Execution plan**

1. **Create component** at `src/app/shared/presentation/active-quote-card/` (standalone).
2. **Inputs:** `quote: HomeActiveQuote`, optional `variant: 'home' | 'hub'` if date label color differs.
3. **Outputs:** `viewQuote`, `acknowledgeReady` (or single `quoteAction` with discriminated type).
4. **Move helpers** from `home.component.ts` and `quotation-hub.component.ts` into either:
   - `src/app/features/quotation/domain/active-quote.presentation.ts` (pure functions), or
   - methods on the card component using existing storage helpers.
5. **Reuse storage APIs:** `isQuoteTimerRunning`, `remainingQuoteReadyMinutes`, `markQuoteReadyNoticeDismissed` from `active-quotes.storage.ts`.
6. **Extract SCSS** from `home.component.scss` / `quotation-hub.component.scss` into `active-quote-card.component.scss`.
7. **Wire home + hub** templates to `<app-active-quote-card>`; delete duplicate HTML/TS/SCSS.
8. **Done when:** One place to change quote card UI; home and hub behave identically; build passes.

**Depends on:** None  
**Blocks:** Easier quote UX fixes; reduces duplicate test surface.

---

### 2. Extract shared `PageChrome` (app bar + back + title)

- [x] Create layout component for nested-flow header chrome
- [x] Migrate quotation, contact-support, FAQ, profile-edit, add-vehicle, my-vehicles nested screens
- [x] Standardize back behaviour (explicit parent route vs history service — document choice)

**Execution plan**

1. **Create** `src/app/shared/presentation/page-chrome/` with inputs: `title`, `backAriaLabel`, optional `showBorder`.
2. **Output:** `back` event — parent decides navigation (keeps quotation explicit routes vs FAQ history back).
3. **Include** chrome wrapper: border-bottom `#e3eaf2`, box-shadow, 64px app bar, 48px back button (match Figma 3115:1490).
4. **Migrate one screen first** (e.g. `contact-support`) as reference; then batch quotation steps, FAQ, profile-edit, add-vehicle.
5. **Document** in component README or comment: when to use `(back)` with `router.navigate` vs `InAppNavigationHistoryService`.
6. **Done when:** No duplicated app-bar HTML/SCSS in migrated features; visual parity with current Figma.

**Depends on:** None  
**Blocks:** Faster header tweaks across flows.

---

### 3. Extract shared `WhatsappFab` + centralize support URLs

- [x] Single WhatsApp href constant (real number: `60182822320`)
- [x] Replace 8+ duplicated FAB markup/SCSS blocks
- [x] Align home, profile, policies, documents, claims with contact-support URL

**Execution plan**

1. **Add** `src/app/shared/constants/support-urls.ts`:
   - `WHATSAPP_HREF = 'https://wa.me/60182822320'`
   - `SUPPORT_EMAIL`, `mailto` helper if useful.
2. **Create** `src/app/shared/presentation/whatsapp-fab/` — fixed position above `--app-bottom-nav-clearance` or footer stack CSS variable.
3. **Replace** inline FABs in: home, claims, documents, profile, policies, contact-support, quotation-request-form, quotation-preferences.
4. **Grep** for `wa.me` and fix stragglers.
5. **Done when:** One component + one constant; all FABs open the same WhatsApp number.

**Depends on:** None  
**Blocks:** Consistent support UX.

---

### 4. Add unit tests for pure logic (storage + mappers)

- [x] Tests for `active-quotes.storage.ts`
- [x] Tests for `quotation-owner-preferences.storage.ts`
- [x] Tests for `policy.model.ts` mappers and `daysUntilCoverageEnd`
- [x] Tests for `malaysian-mobile` validation (if present)
- [x] Karma runs green in CI/local (`karma.conf.js` + `test:ci`; `src/test.ts` in `tsconfig.spec.json`)

**Execution plan**

1. **Add** `karma.conf.js` if missing (Angular 19 default may need explicit config).
2. **Priority test files:**
   - `src/app/features/quotation/data/active-quotes.storage.spec.ts` — timer elapsed, `syncElapsedQuotes`, `getLatestActiveQuote`, dismiss notice.
   - `src/app/features/quotation/data/quotation-owner-preferences.storage.spec.ts` — save/load by owner key.
   - `src/app/features/policies/domain/policy.model.spec.ts` — `toPolicyCard`, `toQuotationVehicleOptions`, date helpers.
3. **Mock `localStorage`** in storage tests (jsdom or manual stub).
4. **Add** `npm run test:ci` script with `--watch=false --browsers=ChromeHeadless` when ready.
5. **Done when:** Core business rules have tests; `ng test` passes.

**Depends on:** None  
**Blocks:** Safe refactors of quotation/policy logic.

---

### 5. Remove or wire orphaned code

- [x] Delete or route `quotation/quotation.component.*` (old step 1)
- [x] Use or delete `AppTopBarComponent`
- [x] Fix `GateComponent` to respect `ONBOARDING_STORAGE`
- [x] Update or trim stale sections in `features.md`

**Execution plan**

1. **QuotationComponent:** If unused, delete `src/app/features/quotation/presentation/quotation/` and remove any dead imports. If needed later, restore from git history.
2. **AppTopBar:** Either migrate one page to use it, or delete `src/app/shared/presentation/app-top-bar/`.
3. **GateComponent:** Read `ONBOARDING_STORAGE.isComplete()` — branch to `/home`, `/onboarding`, or `/login` per product rules.
4. **features.md:** Audit against `app.routes.ts`; mark wired vs stub vs removed.
5. **Done when:** No unrouted feature components; gate matches onboarding flag; docs accurate.

**Depends on:** None (gate logic may need product decision on onboarding vs login first).

---

## P1 — Scale & maintainability

### 6. Adopt design tokens in component SCSS

- [x] Audit `_generated-tokens.scss` for available variables
- [x] Replace repeated hex values in high-traffic components (home, quotation, policies, login, contact-support)
- [x] Document token usage convention in README or `design-tokens/README`

**Execution plan**

1. **Read** `src/design-tokens/_generated-tokens.scss` and map common hex → token (e.g. `#141414` → text primary, `#e3eaf2` → border, `#0091ff` → primary).
2. **Pilot** on one feature: quotation hub + request form SCSS.
3. **Roll out** to home, policies, contact-support in batches.
4. **Keep** component BEM classes; only swap property values to `var(--ps-*)`.
5. **Done when:** New components default to tokens; token build change propagates visually without grep-replace hex.

**Depends on:** Token JSON completeness (extend `policystreet.tokens.json` if gaps).

---

### 7. Consolidate quotation domain types

- [x] Move `HomeActiveQuote` to quotation domain (or shared `active-quote.model.ts`)
- [x] Deduplicate `QuotationCustomerTab` and related types
- [x] Update imports in home, hub, storage, fixtures

**Execution plan**

1. **Create** `src/app/features/quotation/domain/active-quote.model.ts` — move `HomeActiveQuote` (rename to `ActiveQuote` if desired; re-export alias for minimal churn).
2. **Move** `QuotationCustomerTab`, `EHailingUsage`, etc. to `quotation-flow.model.ts` or extend `quotation-preferences.model.ts`.
3. **Update** `home-dashboard.model.ts` to re-export from quotation domain or import `ActiveQuote` directly in home component only.
4. **Fix** all import paths; run build.
5. **Done when:** Single source for quote + quotation flow types; no duplicate type definitions in components.

**Depends on:** #1 (optional — easier after card extraction).

---

### 8. Route `data` flags for bottom navigation

- [x] Replace `shouldShowBottomNav()` path chain in `app.ts` with route metadata
- [x] Replace `activeBottomTab()` heuristics with route `data` where possible
- [x] Document route data schema

**Execution plan**

1. **Extend** routes in `app.routes.ts`:
   ```typescript
   { path: 'home', data: { bottomNav: 'home' }, ... }
   { path: 'policies/:id', data: { bottomNav: false }, ... }
   ```
2. **Inject** `Router` + read deepest activated route `data` in `app.ts` (or small `BottomNavVisibilityService`).
3. **Remove** long `if (p.startsWith(...))` chains once parity verified.
4. **Done when:** Adding a route only requires setting `data.bottomNav`; no edit to `app.ts` string matching.

**Depends on:** None.

---

### 9. Fix missing assets and SCSS budget overruns

- [x] Add or remove references to `news-article-01.png` / `news-article-02.png`
- [x] Split or refactor `home.component.scss` (748 lines, ~14.6 KB)
- [x] Split or refactor `onboarding.component.scss` (~15 KB) — partials under `partials/`
- [x] Verify `ng build` passes component style budgets

**Execution plan**

1. **News images:** Add assets under `public/assets/home/` or remove items from `HOME_NEWS_ITEMS` in `home-dashboard.model.ts`.
2. **Home SCSS:** Extract partials e.g. `_home-quote.scss`, `_home-sheet.scss`, `_home-news.scss`; import from `home.component.scss`. Or move hero/sheet to child components.
3. **Onboarding:** Same partial strategy; fix Sass division deprecations while touching file.
4. **Run** `ng build --configuration production` and confirm budget warnings resolved.
5. **Done when:** No missing asset 404s; style budgets under limits.

**Depends on:** #1 and #6 reduce home SCSS size indirectly.

---

### 10. Quotation non-Malaysian tabs — explicit UX

- [x] Disable or show “coming soon” for Foreigner / Company / Commercial tabs
- [x] Prevent user confusion on form and preferences steps

**Execution plan**

1. **Product choice:** (A) disable tabs, (B) allow select but show empty state copy, (C) implement flows.
2. **If A/B:** Add `@if (activeCustomerTab() === 'malaysian')` empty state for others with message; set `[disabled]` on tab buttons or intercept `setCustomerTab`.
3. **Update** `canSubmit` to remain false on non-Malaysian until implemented.
4. **Done when:** Users cannot think broken form is a bug.

**Depends on:** Product decision.

---

## P2 — API readiness

### 11. Auth session + route guards

- [ ] Define auth session shape (token, user id, expiry)
- [ ] Persist session (memory + optional storage strategy)
- [ ] Add `authGuard` on protected routes (`home`, `policies`, `quotation`, etc.)
- [ ] Redirect unauthenticated users to `/login`

**Execution plan**

1. **Extend** `AUTH_REPOSITORY` with session observable/signal.
2. **Implement** `auth.guard.ts` in `src/app/features/auth/` or `src/app/core/guards/`.
3. **Apply** `canActivate: [authGuard]` on main app routes; leave `login`, `onboarding`, gate public.
4. **Login component:** on success, set session then navigate to `/home`.
5. **Done when:** Direct URL to `/home` without login redirects to login.

**Depends on:** Backend auth contract (can stub session first).

---

### 12. HTTP layer + repository API implementations

- [ ] Add `provideHttpClient()` with interceptors
- [ ] Create `PolicyRepositoryApi` implementing `PolicyRepository`
- [ ] Map API DTOs → `MotorPolicy` in `data/` mappers
- [ ] Swap `POLICY_REPOSITORY` provider in `app.config.ts` via environment

**Execution plan**

1. **Add** `src/environments/environment.ts` with `useMockRepositories: boolean`.
2. **Create** `policy.repository.api.ts` — methods mirror stub interface.
3. **Create** `policy-api.mapper.ts` — DTO → domain (keep domain types stable).
4. **Auth interceptor** — attach Bearer token from session.
5. **Error interceptor** — global toast or error page (define pattern).
6. **Done when:** One feature (policies list) reads from API behind flag; stub still works locally.

**Depends on:** #11 for protected endpoints; API contracts.

---

### 13. Align persistence strategy (localStorage vs API)

- [ ] Document what is client-only vs server-owned (active quotes, owner preferences)
- [ ] Replace or sync `active-quotes.storage.ts` with quotation API
- [ ] Replace or sync `quotation-owner-preferences.storage.ts`

**Execution plan**

1. **Write** short ADR in `docs/` — quote list source of truth is server after submit.
2. **On “Find the BEST prices”:** POST quote job → hub polls or websocket for status (or refetch list on hub `ngOnInit`).
3. **Owner preferences:** POST with quote or GET profile preferences endpoint.
4. **Keep localStorage** only as offline cache if needed; remove dual sources of truth.
5. **Done when:** Refreshing browser shows same quotes as server; no demo fixture fallback in production env.

**Depends on:** #12 quotation API endpoints.

---

## P3 — Quality, a11y, and polish

### 14. Accessibility improvements

- [x] Add `aria-current="page"` on active bottom nav tab
- [x] Pair quotation tabs with `aria-controls` / panel `id`
- [x] Verify focus styles on custom radios/checkboxes
- [x] Add skip link + consistent `<main>` landmark on routed pages

**Execution plan**

1. **Bottom nav:** Set `aria-current="page"` on active tab link in `app-bottom-nav.component.html`.
2. **Quotation tabs:** Add `id` on panels; `aria-controls` on tab buttons.
3. **Focus:** Audit `:focus-visible` in form SCSS (quotation form, add-vehicle, login OTP).
4. **Landmarks:** Ensure each routed page has one `<main>`; optional skip link in `app.html`.
5. **Done when:** Quick axe/Lighthouse pass shows no critical a11y regressions on home + quotation.

**Depends on:** None.

---

### 15. Navigation consistency documentation

- [x] Document back-navigation rules per flow
- [x] Standardize quotation (explicit parent) vs settings-style (history back)

**Execution plan**

1. **Add** section to this doc or `docs/navigation.md`:
   - Quotation wizard: explicit parent routes (`/quotation` ← `/quotation/new` ← …).
   - Hub tabs (contact-support, FAQ): `InAppNavigationHistoryService` or always `/home`.
2. **Audit** all `goBack()` methods against doc.
3. **Done when:** New screens follow documented pattern; no mixed behaviour without reason.

**Depends on:** #2 PageChrome (optional).

---

### 16. CI pipeline

- [x] `ng build` on PR
- [x] `ng test --watch=false` on PR
- [~] Optional: ESLint + Prettier — **deferred** (skipped; add later via `ng add @angular-eslint/schematics` when needed)

**Execution plan**

1. **Add** `.github/workflows/ci.yml` (or existing CI) with Node LTS, `npm ci`, `npm run build`, `npm test`.
2. **Add** ESLint Angular schematic if team wants lint gates.
3. **Done when:** PRs cannot merge with broken build/tests.

**Depends on:** #4 tests exist.

---

### 17. Optional: quotation flow facade / service

- [x] Centralize multi-step navigation and query params (`vehicleId`, `ownerFullName`, `returnTo`)

**Execution plan**

1. **Create** `QuotationFlowService` with methods: `startNewQuote()`, `selectVehicle(id)`, `submitForm(payload)`, `submitPreferences(prefs)`, `navigateBack(step)`.
2. **Inject** in step components; reduce duplicated `router.navigate` + query param assembly.
3. **Done when:** Quotation steps don’t repeat query param boilerplate.

**Depends on:** #7 domain types; stable route map.

---

## Suggested execution order (sprints)

| Sprint | Items | Goal |
|--------|--------|------|
| **Sprint 1** | #3, #5, #9 (assets only) | Quick wins, less duplication, clean orphans |
| **Sprint 2** | #1, #2, #7 | Shared UI + domain cleanup |
| **Sprint 3** | #4, #16 | Tests + CI safety net |
| **Sprint 4** | #6, #8, #9 (SCSS budgets) | Design system + route metadata |
| **Sprint 5** | #10, #14, #15 | UX clarity + a11y |
| **Sprint 6+** | #11, #12, #13 | API integration |
| **Later** | #17 | Flow orchestration when quotation API stabilizes |

---

## Reference — files cited in review

| Category | Paths |
|----------|--------|
| **Exemplars** | `policy.model.ts`, `active-quotes.storage.ts`, `in-app-navigation-history.service.ts`, `login.component.ts`, `asset-session-cache.service.ts` |
| **Remediation** | `home.component.scss`, `onboarding.component.scss`, `app.ts`, `gate.component.ts`, `home-dashboard.model.ts`, `features.md` |
| **Config** | `app.routes.ts`, `app.config.ts`, `angular.json`, `policystreet.tokens.json` |

---

## Progress tracker

| ID | Item | Priority | Status |
|----|------|----------|--------|
| 1 | ActiveQuoteCard | P0 | [x] |
| 2 | PageChrome | P0 | [x] |
| 3 | WhatsappFab + URLs | P0 | [x] |
| 4 | Unit tests | P0 | [x] 18 specs green |
| 5 | Orphan cleanup | P0 | [x] |
| 6 | Design tokens in SCSS | P1 | [x] home, policies, login, contact-support, quotation hub |
| 7 | Quotation domain types | P1 | [x] |
| 8 | Route data bottom nav | P1 | [x] |
| 9 | Assets + SCSS budgets | P1 | [x] home + onboarding partials |
| 10 | Non-Malaysian tab UX | P1 | [x] |
| 11 | Auth guards | P2 | [ ] |
| 12 | HTTP repositories | P2 | [ ] |
| 13 | Persistence strategy | P2 | [ ] |
| 14 | Accessibility | P3 | [x] skip link, main landmarks, tab panels, focus |
| 15 | Navigation docs | P3 | [x] |
| 16 | CI pipeline | P3 | [x] build + test; ESLint deferred |
| 17 | QuotationFlowService | P3 | [x] |

*Last updated: Non-API checklist complete — tokens, SCSS splits, a11y, flow service, CI. ESLint skipped.*
