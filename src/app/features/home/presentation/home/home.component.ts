import { Component, computed, signal } from '@angular/core';
import { SAMPLE_USER } from '../../domain/sample-user';
import {
  HOME_LATEST_CLAIM,
  HOME_LATEST_POLICY,
  HOME_NEWS_ITEMS,
} from '../../domain/home-dashboard.model';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly activeNav = signal<'home' | 'policies' | 'claims' | 'profile'>('home');

  /** Pure white PolicyStreet wordmark (matches `public/assets/home/logo_wordmark-white.png`). */
  readonly logoWordmarkWhiteSrc = '/assets/home/logo_wordmark-white.png';

  /** Ads banner below greeting — copy is in the asset; keep alt for accessibility. */
  readonly adsBannerSrc = '/assets/home/ads-banner-home.png';

  readonly user = SAMPLE_USER;
  readonly latestPolicy = HOME_LATEST_POLICY;
  readonly latestClaim = HOME_LATEST_CLAIM;
  readonly newsItems = HOME_NEWS_ITEMS;

  /** Set from notification/inbox state; red badge only when true. */
  readonly hasUnreadNotifications = signal(false);

  readonly navIconSrc = {
    home: { default: '/assets/home/nav-home.svg', active: '/assets/home/nav-home-active.svg' },
    policies: { default: '/assets/home/nav-policy.svg', active: '/assets/home/nav-policy-active.svg' },
    claims: { default: '/assets/home/nav-claims.svg', active: '/assets/home/nav-claims-active.svg' },
    profile: { default: '/assets/home/nav-person.svg', active: '/assets/home/nav-person-active.svg' },
  } as const;

  readonly greetingPrefix = computed(() => {
    const h = new Date().getHours();
    if (h < 12) {
      return 'Good morning';
    }
    if (h < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  });

  setActiveNav(tab: 'home' | 'policies' | 'claims' | 'profile'): void {
    this.activeNav.set(tab);
  }
}
