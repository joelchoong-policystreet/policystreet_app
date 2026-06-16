import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CachedAssetImgDirective } from '../../assets/cached-asset-img.directive';
import { APP_BRAND_LOGO_SRC } from '../../branding/app-brand-logo';
import { AUTH_SESSION_STORAGE } from '../../../features/auth/domain/auth-session.storage.token';
import type { BottomNavTab } from '../app-bottom-nav/app-bottom-nav.component';

type SideNavItem = {
  readonly tab: Exclude<BottomNavTab, 'profile' | 'none'>;
  readonly label: string;
  readonly path: string;
};

/**
 * Desktop primary navigation (Figma 3124:4944).
 * Rendered by the app shell on main-tab routes; CSS hides it below the desktop
 * breakpoint, where the bottom nav takes over instead.
 */
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './app-side-nav.component.html',
  styleUrl: './app-side-nav.component.scss',
})
export class AppSideNavComponent {
  private readonly router = inject(Router);
  private readonly authSession = inject(AUTH_SESSION_STORAGE);

  readonly logoBrandSrc = APP_BRAND_LOGO_SRC;

  @Input() activeTab: BottomNavTab = 'none';

  readonly items: ReadonlyArray<SideNavItem> = [
    { tab: 'home', label: 'Home', path: '/home' },
    { tab: 'policies', label: 'Policy', path: '/policies' },
    { tab: 'claims', label: 'Claims', path: '/claims' },
  ];

  goTo(item: SideNavItem): void {
    void this.router.navigate([item.path]);
  }

  onLogout(): void {
    this.authSession.clearSession();
    void this.router.navigate(['/login']);
  }
}
