# Navigation conventions

How back navigation and bottom nav visibility work in the PolicyStreet app.

## Bottom navigation

Route metadata in `app.routes.ts` drives shell behaviour via `AppRouteData`:

| Field | Values | Purpose |
|-------|--------|---------|
| `showBottomNav` | `true` / `false` | Whether the fixed bottom bar is visible |
| `bottomNavTab` | `home`, `policies`, `claims`, `profile`, `none` | Active tab highlight |

Read at runtime with `readAppRouteData()` in `src/app/shared/routing/read-app-route-data.ts`. Adding a new top-level tab surface only requires setting `data` on the route — not editing path checks in `app.ts`.

## Back navigation

Two patterns:

### 1. Explicit parent route (wizard flows)

Used by **quotation** steps. Each screen navigates to a fixed parent:

| Screen | Back target |
|--------|-------------|
| Quotation hub | `/home` |
| Vehicle selection | `/quotation` |
| Request form | `/quotation/new` (+ `vehicleId`) |
| Preferences | `/quotation/form` (+ `vehicleId`, `ownerFullName`) |

Use `router.navigate([...])` in `(back)` handlers on `<app-page-chrome>`.

### 2. History back (hub-style nested screens)

Used by **contact support**, **FAQ**, **profile edit**, **my vehicles**, **add vehicle**. These call `InAppNavigationHistoryService.backOrNavigate(['/home'])` so returning users land on their previous in-app page when possible.

## Page chrome

Nested flows share `<app-page-chrome title="…" (back)="goBack()">`. Parent components own navigation logic; the chrome only emits `back`.
