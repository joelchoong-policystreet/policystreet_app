import { Component, HostListener, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppBottomNavComponent } from '../../../../shared/presentation/app-bottom-nav/app-bottom-nav.component';
import { SAMPLE_USER } from '../../domain/sample-user';
import {
  HOME_LATEST_CLAIM,
  HOME_LATEST_POLICY,
  HOME_NEWS_ITEMS,
} from '../../domain/home-dashboard.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppBottomNavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private readonly router: Router) {}

  /** Pure white PolicyStreet wordmark (matches `public/assets/home/logo_wordmark-white.svg`). */
  readonly logoWordmarkWhiteSrc = '/assets/home/logo_wordmark-white.svg';

  /** Ads banner below greeting — copy is in the asset; keep alt for accessibility. */
  readonly adsBannerSrc = '/assets/home/ads-banner-home.png';

  readonly user = SAMPLE_USER;
  readonly latestPolicy = HOME_LATEST_POLICY;
  readonly latestClaim = HOME_LATEST_CLAIM;
  readonly newsItems = HOME_NEWS_ITEMS;

  /** Set from notification/inbox state; red badge only when true. */
  readonly hasUnreadNotifications = signal(true);
  readonly heroZoomProgress = signal(0);

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

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    this.heroZoomProgress.set(Math.min(scrollTop / 260, 1));
  }
}
