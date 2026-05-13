# Restoring MVP-removed UI (Smart Scan, home banners, notifications, home claims)

This document describes features that were **removed for MVP lean scope** and how to **restore** them later. Paths are relative to the repository root.

---

## 1. Smart Scan (bottom navigation FAB)

**What it was:** A centered floating action button in the bottom nav labeled for document upload / “Smart scan”, navigating to `/documents/upload`.

### Files to touch

| File | Action |
|------|--------|
| `src/app/shared/presentation/app-bottom-nav/app-bottom-nav.component.html` | Re-insert the FAB slot between Policies and Claims. |
| `src/app/shared/presentation/app-bottom-nav/app-bottom-nav.component.ts` | Restore `goToDocumentsUpload()` using `Router.navigate(['/documents/upload'])`. |
| `src/app/shared/presentation/app-bottom-nav/app-bottom-nav.component.scss` | Restore `.app-bottom-nav__slot--fab`, `::before` glow, `.app-bottom-nav__fab`, `.app-bottom-nav__fab-icon` (fixed-width center column, elevated button). |

### HTML pattern (between Policies and Claims buttons)

```html
<div class="app-bottom-nav__slot app-bottom-nav__slot--fab">
  <button
    type="button"
    class="app-bottom-nav__fab"
    aria-label="Smart scan — upload documents"
    (click)="goToDocumentsUpload()"
  >
    <img
      class="app-bottom-nav__fab-icon"
      src="/assets/home/nav-scanner.svg"
      width="40"
      height="40"
      loading="eager"
      decoding="sync"
      fetchpriority="high"
      alt=""
      aria-hidden="true"
    />
  </button>
</div>
```

### TypeScript

```typescript
goToDocumentsUpload(): void {
  void this.router.navigate(['/documents/upload']);
}
```

### Related app behaviour (unchanged)

`src/app/app.ts` — `shouldShowBottomNav()` already hides the bar on `/documents/upload`; no change required when restoring the FAB.

### Asset

- `public/assets/home/nav-scanner.svg` (or equivalent) should exist for the FAB icon.

---

## 2. Home promotional banners (carousel)

**What it was:** A horizontal “promotional banners” region below quick actions on the home hero, using `adsBannerSrc` (`/assets/home/ads-banner-home-mock.png`), peek edges, and pagination dots.

### Files to touch

| File | Action |
|------|--------|
| `src/app/features/home/presentation/home/home.component.html` | Re-insert the `.home-page__carousel-wrap` block after `.home-page__quick-actions-wrap` (see snippet below). |
| `src/app/features/home/presentation/home/home.component.ts` | Restore `readonly adsBannerSrc = '/assets/home/ads-banner-home-mock.png';` |
| `src/app/features/home/presentation/home/home.component.scss` | Restore all `.home-page__carousel-*` rules (wrap, scroller, edge, main, photo, pagination, indicators). |

### Component property

```typescript
/** Mock banner for home carousel preview. */
readonly adsBannerSrc = '/assets/home/ads-banner-home-mock.png';
```

### HTML structure (place after `</div>` closing `home-page__quick-actions-wrap`)

Use the previous structure: outer `.home-page__carousel-wrap` → `.home-page__carousel-scroller` (role `region`, `aria-label` for promotional banners) → left edge peek image, center `.home-page__carousel-main` with main banner `img`, right edge peek → `.home-page__carousel-pagination` with track and dot images.

### Styles comment

Hero block used a comment about banner-to-sheet spacing (`padding-bottom` on `.home-page__hero`); tune spacing again after restoring the carousel.

### Home SCSS cleanup (informational)

Orphan styles for a duplicate bottom nav inside the home component were removed (`home.component.scss`). Restoring the home carousel does **not** require restoring those blocks.

### Assets

- `public/assets/home/ads-banner-home-mock.png`
- `public/assets/home/pagination-ellipse.svg` (dots)

---

## 3. Notification bell buttons

**What it was:** Header bell buttons calling `goNotifications()` → `router.navigate(['/notifications'])`, with optional unread dot (`hasUnreadNotifications` signal where applicable).

### Route (still present)

`src/app/app.routes.ts` — route `notifications` can remain; restoring entry points only requires UI + methods below.

### Per-feature restore checklist

| Location | HTML | TypeScript |
|----------|------|------------|
| Home | `src/app/features/home/presentation/home/home.component.html` — bell in `.home-page__header-row` | `hasUnreadNotifications`, `goNotifications()` |
| Policies list | `src/app/features/policies/presentation/policies/policies.component.html` — `.policies-appbar__notify` | `goNotifications()` |
| Policy details | `src/app/features/policies/presentation/policy-details/policy-details.component.html` — trailing notifications `.policy-details-page__icon-btn` (remove `.policy-details-page__appbar-spacer` if present) | `goNotifications()` |
| Profile | `src/app/features/profile/presentation/profile/profile.component.html` — `.profile-page__notify` | `hasUnreadNotifications`, `goNotifications()` |
| Claims | `src/app/features/claims/presentation/claims/claims.component.html` — `.claims-page__notify` | `goNotifications()` |
| Quotation | `src/app/features/quotation/presentation/quotation/quotation.component.html` | `goNotifications()` |
| Quotation step 2 | `src/app/features/quotation/presentation/quotation-step-two/quotation-step-two.component.html` | `goNotifications()` |

### SCSS classes to restore (match component)

- Home: `.home-page__notify`, `__notify-icon`, `__notify-dot`
- Policies: `.policies-appbar__notify`, `__notify-dot` — set `.policies-appbar` `justify-content` back to `space-between` when the bell returns.
- Policy details: `.policy-details-page__notify-dot` (positioned on icon button)
- Profile: `.profile-page__notify`, `__notify-dot` — set `.profile-page__header-row` `justify-content` back to `space-between` when the bell returns.
- Claims: `.claims-page__notify`, `__notify-icon`, `__notify-dot` — set `.claims-page__header-row` `justify-content` back to `space-between` when the bell returns.
- Quotation (both steps): `.quotation-page__notify`, `__notify-icon`, `__notify-dot` — set `.quotation-page__brand-bar` `justify-content` back to `space-between` when the bell returns.

### Example method

```typescript
goNotifications(): void {
  void this.router.navigate(['/notifications']);
}
```

### Unread badge (optional)

```typescript
readonly hasUnreadNotifications = signal(true);
```

Wire `aria-label` and `@if (hasUnreadNotifications())` dot as before.

### Bottom nav tab mapping

`src/app/app.ts` — `activeBottomTab()` maps `/notifications` to the `'home'` tab; keep consistent when restoring deep links to notifications.

### Policy details: title balance (spacer added for MVP)

The notifications icon was removed from the policy details app bar. To keep the title centred, a non-interactive spacer mirrors the back button width:

- HTML: `policy-details.component.html` — `<span class="policy-details-page__appbar-spacer" aria-hidden="true"></span>`
- SCSS: `policy-details.component.scss` — `.policy-details-page__appbar-spacer` and `text-align: center` on `.policy-details-page__title`

When restoring the trailing notifications button, **remove the spacer element and the `.policy-details-page__appbar-spacer` rule** (unless you keep it for a different trailing control).

---

## 4. Home — “Make New Claim” quick action and “Latest Claim” sheet section

**What was removed:**

1. **Quick actions:** The second button (“Make New Claim”) with `goClaims()` → `/claims`, icon `quick-action-make-claim.svg`.
2. **Sheet:** The whole `<section>` for “Latest Claim” (`aria-labelledby="home-latest-claim-heading"`): heading, “View All Claims” link, claim card when data exists, or empty state (`home-page__empty-card--claim`).

### Files to touch

| File | Action |
|------|--------|
| `src/app/features/home/presentation/home/home.component.html` | Re-insert the Make New Claim `<button class="home-page__quick-btn">` after “Request New Quote”; re-insert the Latest Claim `<section>` after the Latest Policy section (before News and Articles). |
| `src/app/features/home/presentation/home/home.component.ts` | Restore `HomeLatestClaim` import from `home-dashboard.model`; `readonly claims` + `readonly latestClaim`; `goClaims()` and `goClaimsAll()`. |
| `src/app/features/home/presentation/home/home.component.scss` | Restore claim-only rules if needed: `.home-page__empty-card--claim`, `.home-page__claim-id`, `.home-page__claim-icon-wrap`, `.home-page__claim-car`, `.home-page__pill--processing`, `.home-page__claim-ref`. Update `.home-page__empty-card` comment to mention Latest Claim again if desired. |

### Domain model (unchanged on disk)

`src/app/features/home/domain/home-dashboard.model.ts` — `HomeLatestClaim` and related helpers remain available for imports when you wire claims again.

### Assets

- `public/assets/home/quick-action-make-claim.svg`
- `public/assets/home/directions-car.svg` (claim card icon)

### TypeScript snippets

```typescript
import {
  type HomeLatestClaim,
  homeLatestPolicyFromMotor,
  HOME_NEWS_ITEMS,
} from '../../domain/home-dashboard.model';

/** Mock collections (API-ready): scenario = has policies, no claims. */
readonly claims: ReadonlyArray<HomeLatestClaim> = [];
readonly latestClaim = this.claims[0] ?? null;
```

```typescript
goClaimsAll(): void {
  if (!this.latestClaim) {
    return;
  }
  void this.router.navigate(['/claims']);
}

goClaims(): void {
  void this.router.navigate(['/claims']);
}
```

---

## Quick verification after restore

1. Bottom nav: FAB appears, tap opens `/documents/upload`, safe-area padding still OK.
2. Home: carousel scrolls horizontally, images load, sheet overlap still acceptable on small devices.
3. Notifications: each restored bell navigates to `/notifications`; back behaviour unchanged (`InAppNavigationHistoryService`).
4. Home claims: quick row has four actions again; Latest Claim section shows card or empty state; “View All Claims” / Make New Claim navigate to `/claims`.

---

## Git recovery tip

If this removal is committed, you can also recover deleted blocks with:

```bash
git show <commit-before-removal>:path/to/file
```

Use the commit hash from before the MVP cleanup for exact file contents.
