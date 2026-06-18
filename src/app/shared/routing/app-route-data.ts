import type { BottomNavTab } from '../presentation/app-bottom-nav/app-bottom-nav.component';

/** Route `data` keys for app shell behaviour — set on each route in `app.routes.ts`. */
export interface AppRouteData {
  /** When true, the bottom navigation bar is visible. */
  showBottomNav?: boolean;
  /**
   * When true, the desktop chrome (sidebar + top bar) is shown even if the mobile
   * bottom nav is hidden — e.g. full-screen detail pages that still belong inside a
   * section on desktop. Defaults to following `showBottomNav`.
   */
  showChrome?: boolean;
  /** Which tab is highlighted when the bottom nav is shown. */
  bottomNavTab?: BottomNavTab;
}

export const ROUTE_DATA_HIDDEN: AppRouteData = {
  showBottomNav: false,
  bottomNavTab: 'none',
};

export const ROUTE_DATA_HOME_TAB: AppRouteData = {
  showBottomNav: true,
  bottomNavTab: 'home',
};

export const ROUTE_DATA_POLICIES_TAB: AppRouteData = {
  showBottomNav: true,
  bottomNavTab: 'policies',
};

export const ROUTE_DATA_CLAIMS_TAB: AppRouteData = {
  showBottomNav: true,
  bottomNavTab: 'claims',
};

export const ROUTE_DATA_PROFILE_TAB: AppRouteData = {
  showBottomNav: true,
  bottomNavTab: 'profile',
};

export const ROUTE_DATA_DOCUMENTS_TAB: AppRouteData = {
  showBottomNav: true,
  bottomNavTab: 'none',
};
