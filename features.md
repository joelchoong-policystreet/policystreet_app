# PolicyStreet app — feature overview

High-level view of what is implemented in the current build versus what remains future work (mock data, placeholders, unwired actions).

---

## Implemented (current scope)

| Area | Feature / scope | Notes |
|------|-----------------|-------|
| **App shell** | Gate route, bottom navigation, route fade | Nav visibility driven by route; fade on main content only |
| **Auth** | Phone + 6-digit OTP login | Demo OTP **123456**; `AUTH_REPOSITORY` abstraction |
| **Onboarding** | Multi-slide welcome, skip / CTA, completion storage | `LocalOnboardingStorage` |
| **Onboarding** | Returning-user splash (post-login) | VP9/WebM + MP4 fallback; header hidden on splash; full-bleed white background |
| **Home** | Hero, branded header, entry to notifications | Mock user from `sample-user` |
| **Home** | Welcome + greeting, latest policy / claim cards | Demo data (`HOME_LATEST_POLICY`, etc.) |
| **Home** | Quick actions | **Request New Quote** → quotation; **Make New Claim** → claims |
| **Home** | Empty states | “View all policies / claims” disabled + greyed when no data |
| **Home** | White sheet scroll (fixed hero, sticky Latest Policy header) | Window scroll + sheet lift; clearance above bottom nav |
| **Home** | Promotional carousel | Mock banner asset |
| **Home** | News & articles block | Mock items |
| **Policies** | List, status chips, Renew Now, View Details | Mock policy list; navigation to policy details |
| **Policies** | ≤3 cars: all expanded; >3: accordion; first card open on first load only | Matches designed behaviour |
| **Policy details** | Route `policies/:id`, sections + in-flow Renew Now CTA | Mock data; status + car plate vary by vehicle id; renew disabled for ACTIVE |
| **Claims** | Claims screen (layout) | Content/mock as wired in component |
| **Notifications** | List UI, unread styling, stacked cards | `NOTIFICATIONS_MOCK` |
| **Documents** | Documents hub + policy document rows (View / Download / Delete) | Demo content |
| **Documents** | Upload page | Native file picker + dropzone; upload pipeline not implemented |
| **Quotation** | Step 1 (quote for whom) + Step 2 (vehicle selection) | Mock vehicles; continues to step-2 route |
| **Profile** | Profile screen | UI present; demo profile data where applicable |
| **Polish** | Login Pawsper: R→center on load, center→L after OTP submit | Avoids re-running enter animation before navigating away |
| **Polish** | Login hero area | Solid `#cae0f2` background (no boxed background image) |

---

## Future / partial / not done yet

| Area | Item | Notes |
|------|------|-------|
| **APIs** | Real auth, policies, claims, notifications, documents | Currently mock / local adapters |
| **Home** | **Contact Support** & **Add New Vehicle** quick actions | Buttons not wired to routes or flows |
| **Home** | **View all** (news), deep links from policy/claim rows | Partially display-only |
| **Home** | WhatsApp FAB | Generic `wa.me/` placeholder — needs real business number |
| **Policy details** | **Renew Now** | Placeholder until renewal journey route/product confirms |
| **Policy details** | Document **Download** | UI only |
| **Documents** | Post–file-select upload | `onFileSelected` placeholder — no API / OCR |
| **Documents** | **View / Download / Delete** | Needs real backends |
| **Quotation** | After step 2 | No quote results / checkout flow |
| **Profile** | Fully dynamic user | Still demo fields in places |
| **Notifications** | Server sync + push | Local mock + simple tap behaviour |
| **Data layer** | Replace mocks (`sample-user`, home, policies, policy details, notifications, quotation) | When API contracts are ready |

---

*Last updated from repository review; adjust rows as features ship.*
