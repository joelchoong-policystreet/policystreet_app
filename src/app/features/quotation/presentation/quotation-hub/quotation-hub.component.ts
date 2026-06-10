import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  getActiveQuotes,
  isQuoteTimerRunning,
  markQuoteReadyNoticeDismissed,
  remainingQuoteReadyMinutes,
} from '../../data/active-quotes.storage';
import { sortActiveQuotesLatestFirst } from '../../domain/active-quotes.fixture';
import type { HomeActiveQuote } from '../../../home/domain/home-dashboard.model';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';

@Component({
  selector: 'app-quotation-hub',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './quotation-hub.component.html',
  styleUrl: './quotation-hub.component.scss',
})
export class QuotationHubComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private refreshTimer?: ReturnType<typeof setInterval>;

  /**
   * In-progress quotations — Figma `3115:1504` when empty, `3115:1566` when filled.
   * User-submitted quotes are persisted in localStorage.
   */
  readonly activeQuotes = signal<readonly HomeActiveQuote[]>(getActiveQuotes());

  readonly sortedActiveQuotes = computed(() =>
    sortActiveQuotesLatestFirst(this.activeQuotes()),
  );

  refreshActiveQuotes(): void {
    this.activeQuotes.set(getActiveQuotes());
  }

  isTimerRunning(quote: HomeActiveQuote): boolean {
    return isQuoteTimerRunning(quote);
  }

  showReadyNotice(quote: HomeActiveQuote): boolean {
    return quote.status === 'ready' && !!quote.submittedAt && !quote.readyNoticeDismissed;
  }

  showRowViewQuote(quote: HomeActiveQuote): boolean {
    return quote.status === 'ready' && !this.showReadyNotice(quote);
  }

  readyInMinutes(quote: HomeActiveQuote): number {
    return remainingQuoteReadyMinutes(quote);
  }

  ngOnInit(): void {
    this.refreshActiveQuotes();
    this.refreshTimer = setInterval(() => this.refreshActiveQuotes(), 30_000);
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshTimer);
  }

  goBack(): void {
    void this.router.navigate(['/home']);
  }

  getNewQuote(): void {
    void this.router.navigate(['/quotation/new']);
  }

  acknowledgeReadyQuote(quoteId: string): void {
    markQuoteReadyNoticeDismissed(quoteId);
    this.refreshActiveQuotes();
  }

  viewQuote(quoteId: string): void {
    const quote = this.activeQuotes().find((item) => item.id === quoteId);
    if (!quote || !this.showRowViewQuote(quote)) {
      return;
    }
    void this.router.navigate(['/quotation/new'], { queryParams: { quoteId } });
  }
}
