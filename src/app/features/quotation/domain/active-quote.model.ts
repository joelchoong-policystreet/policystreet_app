export interface ActiveQuote {
  id: string;
  plate: string;
  /** Pre-formatted display label, e.g. `13 May 2026 03:52PM`. */
  dateLabel: string;
  /** ISO-8601 sort key — hub lists latest first regardless of plate. */
  createdAt: string;
  status: 'ready' | 'in-progress';
  /** Estimated minutes until the quote is ready (in-progress only). */
  readyInMinutes?: number;
  /** ISO-8601 submission time — used to compute remaining minutes. */
  submittedAt?: string;
  /** Hides the post-timer ready banner after the user taps View Quote. */
  readyNoticeDismissed?: boolean;
}

/** @deprecated Use `ActiveQuote`. Kept for existing home/hub naming. */
export type HomeActiveQuote = ActiveQuote;

/** Demo active quotation — Figma `3089:24699`. */
export const HOME_ACTIVE_QUOTE_DEMO: ActiveQuote = {
  id: 'quote-demo-vej1234',
  plate: 'VEJ1234',
  dateLabel: '13 May 2026 03:52PM',
  createdAt: '2026-05-13T15:52:00+08:00',
  status: 'ready',
};
