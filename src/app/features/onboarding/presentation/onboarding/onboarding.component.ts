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
import { ONBOARDING_SLIDES } from '../../domain/onboarding-slides';
import { ONBOARDING_STORAGE } from '../../domain/onboarding-storage.token';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly onboardingStorage = inject(ONBOARDING_STORAGE);
  private readonly destroyRef = inject(DestroyRef);

  private pointerStartX = 0;
  private autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly autoAdvanceMs = 3000;

  readonly slides = ONBOARDING_SLIDES;
  readonly slideCount = ONBOARDING_SLIDES.length;

  readonly currentSlide = signal(0);

  readonly slide = computed(() => this.slides[this.currentSlide()]);

  readonly pageBackgroundImage = computed(() => {
    const src = this.slide().backgroundSrc ?? '/assets/onboarding/onboarding-bg.png';
    return `url("${src}")`;
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.clearAutoAdvanceTimer());

    effect(() => {
      const index = this.currentSlide();
      this.scheduleAutoAdvance(index);
    });
  }

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    const afterSignIn = q.get('postLogin') === '1';

    if (q.get('resetOnboarding') === '1') {
      this.onboardingStorage.clearCompletion();
      void this.router.navigate(['/onboarding'], {
        replaceUrl: true,
        queryParams: afterSignIn ? { postLogin: '1' } : {},
      });
      return;
    }

    // Deep-link to /onboarding: skip if already done. postLogin=1 keeps the route when revisiting after login.
    if (this.onboardingStorage.isComplete() && !afterSignIn) {
      void this.router.navigate(['/home'], { replaceUrl: true });
    }
  }

  private clearAutoAdvanceTimer(): void {
    if (this.autoAdvanceTimer !== null) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }

  /** Advance after 3s on slides 1–2; resets when the slide index changes (swipe / dots). */
  private scheduleAutoAdvance(index: number): void {
    this.clearAutoAdvanceTimer();
    if (index >= this.slideCount - 1) {
      return;
    }
    this.autoAdvanceTimer = window.setTimeout(() => {
      this.autoAdvanceTimer = null;
      this.goForward();
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
