import { ActivatedRouteSnapshot, Router } from '@angular/router';

import type { BottomNavTab } from '../presentation/app-bottom-nav/app-bottom-nav.component';
import { type AppRouteData, ROUTE_DATA_HIDDEN } from './app-route-data';

/** Deepest activated route `data` (lazy routes included). */
export function readAppRouteData(router: Router): AppRouteData {
  let route = router.routerState.snapshot.root;

  while (route.firstChild) {
    route = route.firstChild;
  }

  return mergeRouteData(route);
}

function mergeRouteData(route: ActivatedRouteSnapshot): AppRouteData {
  const merged: AppRouteData = { ...ROUTE_DATA_HIDDEN };

  for (const snapshot of route.pathFromRoot) {
    const data = snapshot.data as AppRouteData;
    if (data.showBottomNav !== undefined) {
      merged.showBottomNav = data.showBottomNav;
    }
    if (data.showChrome !== undefined) {
      merged.showChrome = data.showChrome;
    }
    if (data.bottomNavTab !== undefined) {
      merged.bottomNavTab = data.bottomNavTab;
    }
  }

  return merged;
}

export function bottomNavTabFromRouteData(data: AppRouteData): BottomNavTab {
  return data.bottomNavTab ?? 'none';
}
