import type { ActiveQuote } from '../domain/active-quote.model';
import {
  isQuoteTimerRunning,
  remainingQuoteReadyMinutes,
} from '../data/active-quotes.storage';

export function showActiveQuoteReadyNotice(quote: ActiveQuote): boolean {
  return quote.status === 'ready' && !!quote.submittedAt && !quote.readyNoticeDismissed;
}

export function showActiveQuoteRowViewQuote(quote: ActiveQuote): boolean {
  return quote.status === 'ready' && !showActiveQuoteReadyNotice(quote);
}

/** Pre-submitted-flow demo quotes without `submittedAt`. */
export function showActiveQuoteLegacyReadyBanner(quote: ActiveQuote): boolean {
  return showActiveQuoteRowViewQuote(quote) && !quote.submittedAt;
}

export function isActiveQuoteTimerRunning(quote: ActiveQuote): boolean {
  return isQuoteTimerRunning(quote);
}

export function activeQuoteReadyInMinutes(quote: ActiveQuote): number {
  return remainingQuoteReadyMinutes(quote);
}
