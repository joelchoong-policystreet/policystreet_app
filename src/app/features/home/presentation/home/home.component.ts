import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SAMPLE_USER } from '../../domain/sample-user';
import { type HomeLatestClaim, type HomeLatestPolicy, HOME_LATEST_POLICY, HOME_NEWS_ITEMS } from '../../domain/home-dashboard.model';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private readonly router: Router) {}

  /** Full-colour brand lockup for light hero backgrounds (same asset as onboarding header). */
  readonly logoBrandSrc = '/assets/home/PS Car Insurance Logo.svg';

  /** Mock banner for home carousel preview. */
  readonly adsBannerSrc = '/assets/home/ads-banner-home-mock.png';

  readonly user = SAMPLE_USER;
  /** Mock collections (API-ready): scenario = has policies, no claims. */
  readonly policies: ReadonlyArray<HomeLatestPolicy> = [HOME_LATEST_POLICY];
  readonly claims: ReadonlyArray<HomeLatestClaim> = [];

  readonly latestPolicy = this.policies[0] ?? null;
  readonly latestClaim = this.claims[0] ?? null;
  readonly newsItems = HOME_NEWS_ITEMS;

  /** Set from notification/inbox state; red badge only when true. */
  readonly hasUnreadNotifications = signal(true);

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

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }

  goPoliciesAll(): void {
    void this.router.navigate(['/policies'], { queryParams: { filter: 'all' } });
  }

}
