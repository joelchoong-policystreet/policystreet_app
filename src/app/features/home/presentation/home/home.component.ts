import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { SAMPLE_USER } from '../../domain/sample-user';
import {
  HOME_ACTIVE_QUOTE,
  homeLatestCoverNoteFromMotor,
  HOME_NEWS_ITEMS,
} from '../../domain/home-dashboard.model';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { APP_BRAND_LOGO_SRC } from '../../../../shared/branding/app-brand-logo';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  /** Full-colour brand lockup for light hero backgrounds (same asset as onboarding header). */
  readonly logoBrandSrc = APP_BRAND_LOGO_SRC;

  readonly user = SAMPLE_USER;

  private readonly motorPolicies = toSignal(this.policyRepository.getPolicies(), {
    requireSync: true,
  });

  /** Demo active quote — Figma `3089:24694`; replace with API when available. */
  readonly activeQuote = HOME_ACTIVE_QUOTE;

  /**
   * Latest active cover note for home (prefers `ABC1234` in demo data to match Figma).
   * Replace with explicit “primary” / API field when backends define it.
   */
  readonly latestCoverNote = computed(() => {
    const rows = this.motorPolicies().filter((policy) => policy.status === 'ACTIVE');
    if (rows.length === 0) {
      return null;
    }
    const preferred = rows.find((policy) => policy.plate === 'ABC1234');
    const pick = preferred ?? rows[0];
    return pick ? homeLatestCoverNoteFromMotor(pick) : null;
  });

  readonly newsItems = HOME_NEWS_ITEMS;

  readonly sheetLift = signal(0);
  readonly maxSheetLift = signal(0);
  readonly heroHeight = signal(0);
  private readonly sheetInitialOverlapPx = 0;
  private readonly sheetStopGapPx = 8;
  private readonly sheetHardCapPx = 170;
  private readonly sheetSoftCapRangePx = 28;
  private pendingScrollRaf = false;

  @ViewChild('heroSection') private heroSection?: ElementRef<HTMLElement>;
  @ViewChild('welcomeBlock') private welcomeBlock?: ElementRef<HTMLElement>;
  @ViewChild('quickActionsWrap') private quickActionsWrap?: ElementRef<HTMLElement>;

  goQuotesAll(): void {
    void this.router.navigate(['/quotation']);
  }

  goCoverNotesAll(): void {
    if (!this.latestCoverNote()) {
      return;
    }
    void this.router.navigate(['/policies'], { queryParams: { filter: 'active' } });
  }

  goLatestCoverNoteDetails(policyId: string): void {
    void this.router.navigate(['/policies', policyId]);
  }

  goActiveQuote(): void {
    void this.router.navigate(['/quotation/step-2']);
  }

  goQuotation(): void {
    void this.router.navigate(['/quotation']);
  }

  goContactSupport(): void {
    void this.router.navigate(['/contact-support']);
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
