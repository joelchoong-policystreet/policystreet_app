import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SAMPLE_USER } from '../../domain/sample-user';
import { type HomeLatestClaim, type HomeLatestPolicy, HOME_LATEST_POLICY, HOME_NEWS_ITEMS } from '../../domain/home-dashboard.model';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
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
  readonly sheetLift = signal(0);
  readonly maxSheetLift = signal(0);
  readonly heroHeight = signal(0);
  private readonly sheetInitialOverlapPx = 12;
  private readonly sheetStopGapPx = 8;
  private readonly sheetHardCapPx = 170;
  private pendingScrollRaf = false;

  @ViewChild('heroSection') private heroSection?: ElementRef<HTMLElement>;
  @ViewChild('welcomeBlock') private welcomeBlock?: ElementRef<HTMLElement>;
  @ViewChild('quickActionsWrap') private quickActionsWrap?: ElementRef<HTMLElement>;

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
    if (!this.latestPolicy) {
      return;
    }
    void this.router.navigate(['/policies'], { queryParams: { filter: 'all' } });
  }

  goClaimsAll(): void {
    if (!this.latestClaim) {
      return;
    }
    void this.router.navigate(['/claims']);
  }

  ngAfterViewInit(): void {
    this.recalculateMaxSheetLift();
    this.updateSheetLift();
    requestAnimationFrame(() => {
      this.recalculateMaxSheetLift();
      this.updateSheetLift();
    });
    setTimeout(() => {
      this.recalculateMaxSheetLift();
      this.updateSheetLift();
    }, 250);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.recalculateMaxSheetLift();
    this.updateSheetLift();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scheduleSheetLiftUpdate();
  }

  private recalculateMaxSheetLift(): void {
    const heroElement = this.heroSection?.nativeElement;
    const welcomeElement = this.welcomeBlock?.nativeElement;
    const quickActionsElement = this.quickActionsWrap?.nativeElement;
    if (!heroElement) {
      this.maxSheetLift.set(0);
      this.sheetLift.set(0);
      this.heroHeight.set(0);
      return;
    }

    const heroRect = heroElement.getBoundingClientRect();
    this.heroHeight.set(Math.max(0, heroRect.height));
    const initialSheetTop = heroRect.height - this.sheetInitialOverlapPx;
    const targetTop =
      (welcomeElement?.getBoundingClientRect().bottom ??
        quickActionsElement?.getBoundingClientRect().top ??
        initialSheetTop) + this.sheetStopGapPx;
    const anchorCap = Math.max(0, initialSheetTop - targetTop);
    this.maxSheetLift.set(Math.min(anchorCap, this.sheetHardCapPx));
    this.sheetLift.update((value) => Math.min(value, this.maxSheetLift()));
  }

  private updateSheetLift(): void {
    const pageScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    this.sheetLift.set(Math.min(Math.max(pageScrollTop, 0), this.maxSheetLift()));
  }

  private scheduleSheetLiftUpdate(): void {
    if (this.pendingScrollRaf) {
      return;
    }
    this.pendingScrollRaf = true;
    requestAnimationFrame(() => {
      this.pendingScrollRaf = false;
      this.updateSheetLift();
    });
  }

}
