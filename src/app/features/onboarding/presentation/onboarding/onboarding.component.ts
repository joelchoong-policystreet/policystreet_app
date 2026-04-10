import {
  Component,
  DestroyRef,
  HostListener,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTopBarComponent } from '../../../../shared/presentation/app-top-bar/app-top-bar.component';
import { ONBOARDING_SLIDES } from '../../domain/onboarding-slides';
import { ONBOARDING_STORAGE } from '../../domain/onboarding-storage.token';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [AppTopBarComponent],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly onboardingStorage = inject(ONBOARDING_STORAGE);
  private readonly destroyRef = inject(DestroyRef);

  private pointerStartX = 0;
  private autoAdvanceTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Auto-advance interval (ms); resets whenever the slide changes. */
  private readonly autoAdvanceMs = 3000;

  /**
   * Screen 1 hero only (stacked shield + wordmark, transparent PNG). Not `policystreet-logo.png` (header) or `bg-pmark.svg` (watermark).
   */
  readonly welcomeScreenLogoSrc = '/assets/onboarding-welcome-logo.png';

  readonly slides = ONBOARDING_SLIDES;
  readonly slideCount = ONBOARDING_SLIDES.length;

  readonly currentSlide = signal(0);

  readonly slide = computed(() => this.slides[this.currentSlide()]);

  constructor() {
    this.destroyRef.onDestroy(() => this.clearAutoAdvance());

    effect(() => {
      const index = this.currentSlide();
      this.scheduleAutoAdvanceAfterSlideChange(index);
    });
  }

  ngOnInit(): void {
    const afterSignIn =
      this.route.snapshot.queryParamMap.get('postLogin') === '1';
    if (this.onboardingStorage.isComplete() && !afterSignIn) {
      void this.router.navigate(['/home'], { replaceUrl: true });
    }
  }

  private clearAutoAdvance(): void {
    if (this.autoAdvanceTimeout !== null) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }
  }

  /** After any slide change, start a fresh countdown; no auto step from the last slide. */
  private scheduleAutoAdvanceAfterSlideChange(index: number): void {
    this.clearAutoAdvance();
    if (index >= this.slideCount - 1) {
      return;
    }
    this.autoAdvanceTimeout = setTimeout(() => {
      this.autoAdvanceTimeout = null;
      const i = this.currentSlide();
      if (i < this.slideCount - 1) {
        this.currentSlide.set(i + 1);
      }
    }, this.autoAdvanceMs);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.goForward();
    }
    if (event.key === 'ArrowLeft') {
      this.goBack();
    }
  }

  onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
  }

  onPointerUp(event: PointerEvent): void {
    const dx = event.clientX - this.pointerStartX;
    if (Math.abs(dx) < 48) {
      return;
    }
    if (dx < 0) {
      this.goForward();
    } else {
      this.goBack();
    }
  }

  goToSlide(index: number): void {
    const safe = Math.max(0, Math.min(this.slideCount - 1, index));
    this.currentSlide.set(safe);
  }

  goForward(): void {
    const i = this.currentSlide();
    if (i < this.slideCount - 1) {
      this.currentSlide.set(i + 1);
    } else {
      this.finish();
    }
  }

  goBack(): void {
    const i = this.currentSlide();
    if (i > 0) {
      this.currentSlide.set(i - 1);
    }
  }

  skip(): void {
    this.onboardingStorage.markComplete();
    void this.router.navigate(['/home']);
  }

  finish(): void {
    this.onboardingStorage.markComplete();
    void this.router.navigate(['/home']);
  }
}
