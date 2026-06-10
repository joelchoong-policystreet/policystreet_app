import type { HomeActiveQuote } from '../../home/domain/home-dashboard.model';
import { ACTIVE_QUOTES_DEMO, sortActiveQuotesLatestFirst } from '../domain/active-quotes.fixture';

const STORAGE_KEY = 'policystreet.active-quotes.v1';

function readStore(): HomeActiveQuote[] | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as HomeActiveQuote[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStore(quotes: readonly HomeActiveQuote[]): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

export function getActiveQuotes(): readonly HomeActiveQuote[] {
  const base = readStore() ?? [...ACTIVE_QUOTES_DEMO];
  return syncElapsedQuotes(base);
}

export function getLatestActiveQuote(): HomeActiveQuote | null {
  const quotes = sortActiveQuotesLatestFirst(getActiveQuotes());
  return quotes[0] ?? null;
}

export function markQuoteReadyNoticeDismissed(quoteId: string): void {
  const quotes = getActiveQuotes().map((quote) =>
    quote.id === quoteId ? { ...quote, readyNoticeDismissed: true } : quote,
  );
  writeStore(quotes);
}

export function isQuoteTimerElapsed(quote: HomeActiveQuote): boolean {
  if (quote.status !== 'in-progress' || !quote.submittedAt) {
    return false;
  }

  const readyAt =
    new Date(quote.submittedAt).getTime() + (quote.readyInMinutes ?? 5) * 60_000;
  return Date.now() >= readyAt;
}

export function isQuoteTimerRunning(quote: HomeActiveQuote): boolean {
  return quote.status === 'in-progress' && !isQuoteTimerElapsed(quote);
}

export function syncElapsedQuotes(quotes: readonly HomeActiveQuote[]): HomeActiveQuote[] {
  let changed = false;
  const next = quotes.map((quote) => {
    if (quote.status === 'in-progress' && isQuoteTimerElapsed(quote)) {
      changed = true;
      return { ...quote, status: 'ready' as const };
    }
    return quote;
  });

  if (changed) {
    writeStore(next);
  }

  return next;
}

export function addInProgressActiveQuote(quote: HomeActiveQuote): void {
  const current = getActiveQuotes();
  writeStore([quote, ...current.filter((item) => item.id !== quote.id)]);
}

/** e.g. `28 May 2026 03:52PM` */
export function formatActiveQuoteDateLabel(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours24 >= 12 ? 'PM' : 'AM';

  return `${day} ${month} ${year} ${String(hours12).padStart(2, '0')}:${minutes}${meridiem}`;
}

export function remainingQuoteReadyMinutes(quote: HomeActiveQuote): number {
  const readyInMinutes = quote.readyInMinutes ?? 5;

  if (quote.status !== 'in-progress' || !quote.submittedAt || isQuoteTimerElapsed(quote)) {
    return 0;
  }

  const readyAt =
    new Date(quote.submittedAt).getTime() + readyInMinutes * 60_000;
  return Math.max(1, Math.ceil((readyAt - Date.now()) / 60_000));
}

export function createInProgressActiveQuote(plate: string, vehicleId: string): HomeActiveQuote {
  const now = new Date();
  const readyInMinutes = 5;

  return {
    id: `quote-${vehicleId}-${now.getTime()}`,
    plate,
    dateLabel: formatActiveQuoteDateLabel(now),
    createdAt: now.toISOString(),
    status: 'in-progress',
    readyInMinutes,
    submittedAt: now.toISOString(),
  };
}
