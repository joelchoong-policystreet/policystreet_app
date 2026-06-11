import { Component, input, output } from '@angular/core';

import type { ActiveQuote } from '../../../features/quotation/domain/active-quote.model';
import {
  activeQuoteReadyInMinutes,
  isActiveQuoteTimerRunning,
  showActiveQuoteLegacyReadyBanner,
  showActiveQuoteReadyNotice,
  showActiveQuoteRowViewQuote,
} from '../../../features/quotation/domain/active-quote.presentation';
import { CachedAssetImgDirective } from '../../assets/cached-asset-img.directive';

export type ActiveQuoteCardVariant = 'home' | 'hub';

@Component({
  selector: 'app-active-quote-card',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './active-quote-card.component.html',
  styleUrl: './active-quote-card.component.scss',
  host: {
    '[class.active-quote-card--home]': 'variant() === "home"',
    '[class.active-quote-card--hub]': 'variant() === "hub"',
  },
})
export class ActiveQuoteCardComponent {
  readonly quote = input.required<ActiveQuote>();
  readonly variant = input<ActiveQuoteCardVariant>('home');

  readonly viewQuote = output<string>();
  readonly acknowledgeReady = output<string>();

  showReadyNotice(quote: ActiveQuote): boolean {
    return showActiveQuoteReadyNotice(quote);
  }

  showRowViewQuote(quote: ActiveQuote): boolean {
    return showActiveQuoteRowViewQuote(quote);
  }

  showLegacyReadyBanner(quote: ActiveQuote): boolean {
    return showActiveQuoteLegacyReadyBanner(quote);
  }

  isTimerRunning(quote: ActiveQuote): boolean {
    return isActiveQuoteTimerRunning(quote);
  }

  readyInMinutes(quote: ActiveQuote): number {
    return activeQuoteReadyInMinutes(quote);
  }

  onViewQuoteClick(quoteId: string): void {
    this.viewQuote.emit(quoteId);
  }

  onAcknowledgeReadyClick(quoteId: string): void {
    this.acknowledgeReady.emit(quoteId);
  }
}
