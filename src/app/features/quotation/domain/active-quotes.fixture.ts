import type { HomeActiveQuote } from '../../home/domain/home-dashboard.model';

/** Demo active quotes — Figma `3115:1566` (VEJ1234 latest, then ABC8888). */
export const ACTIVE_QUOTES_DEMO: readonly HomeActiveQuote[] = [
  {
    id: 'quote-demo-vej1234',
    plate: 'VEJ1234',
    dateLabel: '13 May 2026 03:52PM',
    createdAt: '2026-05-13T15:52:00+08:00',
    status: 'ready',
  },
  {
    id: 'quote-demo-abc8888',
    plate: 'ABC8888',
    dateLabel: '05 May 2026 02:52PM',
    createdAt: '2026-05-05T14:52:00+08:00',
    status: 'ready',
  },
];

/** Latest quote first — sort key is `createdAt`, not plate. */
export function sortActiveQuotesLatestFirst(
  quotes: readonly HomeActiveQuote[],
): readonly HomeActiveQuote[] {
  return [...quotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
