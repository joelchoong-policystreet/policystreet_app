/** `none` = text-only slide (full-page background only). */
export type OnboardingIconKind = 'none' | 'document' | 'lightning';

/** Subtle hero motion (`float` ≈ Welcome Screen 2 — illustration drifts). */
export type OnboardingHeroMotion = 'float';

export interface OnboardingSlide {
  readonly headline: string;
  /** Main paragraph (screens 1–2) or second paragraph (screen 3). */
  readonly body: string;
  /** Optional bold lead line (screen 3). */
  readonly bodyLeadBold?: string;
  readonly icon: OnboardingIconKind;
  /** Welcome hero illustration (shown above headline). */
  readonly heroIllustrationSrc?: string;
  /** Back layer SVG with drift animation (foreground hero stays static); e.g. welcome screen 2. */
  readonly heroFloatLayerSrc?: string;
  /** Optional second back layer, aligned and animated with the first (e.g. welcome screen 2 float pair). */
  readonly heroFloatLayerSrc2?: string;
  /** Pendulum key layer; positioned over the hero when set. */
  readonly heroSwingKeySrc?: string;
  /** Clock hands layered on `heroIllustrationSrc`; both rotate continuously (minute faster). */
  readonly heroClockHands?: {
    readonly minuteHandSrc: string;
    readonly hourHandSrc: string;
    /** Optional dial cap centred on pivot, drawn above the hands */
    readonly hubSrc?: string;
  };
  /** Single-layer float (deco chips + animate hero-art); unused when `heroFloatLayerSrc` is set. */
  readonly heroMotion?: OnboardingHeroMotion;
  /** Full-screen page backdrop; defaults to `/assets/onboarding/onboarding-bg.png`. */
  readonly backgroundSrc?: string;
}
