import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { sortMotorPoliciesForAllTab } from '../../../policies/domain/policy.model';
import { SAMPLE_USER } from '../../domain/sample-user';
import {
  type HomeLatestClaim,
  homeLatestPolicyFromMotor,
  HOME_NEWS_ITEMS,
} from '../../domain/home-dashboard.model';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  /** Full-colour brand lockup for light hero backgrounds (same asset as onboarding header). */
  readonly logoBrandSrc = '/assets/home/PS Car Insurance Logo.svg';

  /** Mock banner for home carousel preview. */
  readonly adsBannerSrc = '/assets/home/ads-banner-home-mock.png';

  readonly user = SAMPLE_USER;

  private readonly motorPolicies = toSignal(this.policyRepository.getPolicies(), {
    requireSync: true,
  });

  /**
   * First row on Policies → “All” (same sort as `sortMotorPoliciesForAllTab` / list screen).
   * Replace with explicit “primary” / API field when backends define it.
   */
  readonly latestPolicy = computed(() => {
    const rows = this.motorPolicies();
    if (rows.length === 0) {
      return null;
    }
    const top = sortMotorPoliciesForAllTab(rows)[0];
    return top ? homeLatestPolicyFromMotor(top) : null;
  });

  readonly heroPolicyStatus = computed<
    { tone: 'ok' | 'expiring' | 'expired'; message: string; targetPolicyId?: string } | null
  >(() => {
    const rows = this.motorPolicies();
    if (rows.length === 0) {
      return null;
    }

    const firstExpired = sortMotorPoliciesForAllTab(rows).find(
      (policy) => policy.status === 'EXPIRED',
    );
    if (firstExpired) {
      return {
        tone: 'expired',
        message: 'Some policies have expired',
        targetPolicyId: firstExpired.id,
      };
    }

    if (rows.some((p) => p.status === 'EXPIRING SOON')) {
      return {
        tone: 'expiring',
        message: 'Some policies are expiring soon',
      };
    }

    return {
      tone: 'ok',
      message: 'All policies are up to date',
    };
  });

  /** Mock collections (API-ready): scenario = has policies, no claims. */
  readonly claims: ReadonlyArray<HomeLatestClaim> = [];
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
  private readonly sheetSoftCapRangePx = 28;
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
    if (!this.latestPolicy()) {
      return;
    }
    void this.router.navigate(['/policies'], { queryParams: { filter: 'all' } });
  }

  goLatestPolicyDetails(policyId: string): void {
    void this.router.navigate(['/policies', policyId]);
  }

  goExpiredPolicyDetails(policyId?: string): void {
    if (!policyId) {
      return;
    }
    void this.router.navigate(['/policies', policyId]);
  }

  goClaimsAll(): void {
    if (!this.latestClaim) {
      return;
    }
    void this.router.navigate(['/claims']);
  }

  goClaims(): void {
    void this.router.navigate(['/claims']);
  }

  goQuotation(): void {
    void this.router.navigate(['/quotation']);
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
    this.sheetLift.set(this.getSmoothedLift(Math.max(pageScrollTop, 0), this.maxSheetLift()));
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

  private getSmoothedLift(scrollTop: number, cap: number): number {
    if (cap <= 0) {
      return 0;
    }

    const softRange = Math.min(this.sheetSoftCapRangePx, cap);
    const softStart = cap - softRange;

    if (scrollTop <= softStart) {
      return scrollTop;
    }

    // Asymptotic easing toward cap avoids a hard stop/snap at max lift.
    const distanceIntoSoftZone = scrollTop - softStart;
    const lift = cap - softRange * Math.exp(-distanceIntoSoftZone / softRange);
    return Math.min(lift, cap);
  }

}
