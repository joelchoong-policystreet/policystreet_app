import type { ActiveQuote } from '../domain/active-quote.model';
import {
  createInProgressActiveQuote,
  formatActiveQuoteDateLabel,
  getLatestActiveQuote,
  isQuoteTimerElapsed,
  isQuoteTimerRunning,
  markQuoteReadyNoticeDismissed,
  remainingQuoteReadyMinutes,
  syncElapsedQuotes,
} from './active-quotes.storage';

const STORAGE_KEY = 'policystreet.active-quotes.v1';

function seedQuotes(quotes: readonly ActiveQuote[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

describe('active-quotes.storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('formatActiveQuoteDateLabel uses 12-hour clock with meridiem', () => {
    const label = formatActiveQuoteDateLabel(new Date(2026, 4, 28, 15, 52, 0));
    expect(label).toBe('28 May 2026 03:52PM');
  });

  it('syncElapsedQuotes promotes in-progress quotes when timer elapsed', () => {
    const submittedAt = new Date(Date.now() - 6 * 60_000).toISOString();
    const quotes: ActiveQuote[] = [
      {
        id: 'q1',
        plate: 'ABC1234',
        dateLabel: 'test',
        createdAt: submittedAt,
        status: 'in-progress',
        readyInMinutes: 5,
        submittedAt,
      },
    ];

    const synced = syncElapsedQuotes(quotes);
    expect(synced[0].status).toBe('ready');
  });

  it('isQuoteTimerRunning is false after elapsed timer', () => {
    const submittedAt = new Date(Date.now() - 10 * 60_000).toISOString();
    const quote: ActiveQuote = {
      id: 'q1',
      plate: 'ABC1234',
      dateLabel: 'test',
      createdAt: submittedAt,
      status: 'in-progress',
      readyInMinutes: 5,
      submittedAt,
    };

    expect(isQuoteTimerElapsed(quote)).toBeTrue();
    expect(isQuoteTimerRunning(quote)).toBeFalse();
  });

  it('remainingQuoteReadyMinutes returns at least 1 while timer runs', () => {
    const submittedAt = new Date(Date.now() - 60_000).toISOString();
    const quote: ActiveQuote = {
      id: 'q1',
      plate: 'ABC1234',
      dateLabel: 'test',
      createdAt: submittedAt,
      status: 'in-progress',
      readyInMinutes: 5,
      submittedAt,
    };

    expect(remainingQuoteReadyMinutes(quote)).toBeGreaterThanOrEqual(1);
  });

  it('getLatestActiveQuote returns newest by createdAt', () => {
    seedQuotes([
      {
        id: 'older',
        plate: 'OLD1',
        dateLabel: 'older',
        createdAt: '2026-05-01T10:00:00+08:00',
        status: 'ready',
      },
      {
        id: 'newer',
        plate: 'NEW1',
        dateLabel: 'newer',
        createdAt: '2026-05-13T10:00:00+08:00',
        status: 'ready',
      },
    ]);

    expect(getLatestActiveQuote()?.id).toBe('newer');
  });

  it('markQuoteReadyNoticeDismissed sets readyNoticeDismissed', () => {
    seedQuotes([
      {
        id: 'q1',
        plate: 'ABC1234',
        dateLabel: 'test',
        createdAt: new Date().toISOString(),
        status: 'ready',
        submittedAt: new Date().toISOString(),
      },
    ]);

    markQuoteReadyNoticeDismissed('q1');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!) as ActiveQuote[];
    expect(stored[0].readyNoticeDismissed).toBeTrue();
  });

  it('createInProgressActiveQuote seeds in-progress fields', () => {
    const quote = createInProgressActiveQuote('VEJ1234', 'veh-1');
    expect(quote.plate).toBe('VEJ1234');
    expect(quote.status).toBe('in-progress');
    expect(quote.readyInMinutes).toBe(5);
    expect(quote.submittedAt).toBeTruthy();
  });
});
