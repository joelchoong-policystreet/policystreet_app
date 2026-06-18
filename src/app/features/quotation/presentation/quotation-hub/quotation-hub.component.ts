import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';

import {
  getActiveQuotes,
  markQuoteReadyNoticeDismissed,
} from '../../data/active-quotes.storage';
import { showActiveQuoteRowViewQuote } from '../../domain/active-quote.presentation';
import { sortActiveQuotesLatestFirst } from '../../domain/active-quotes.fixture';
import type { ActiveQuote } from '../../domain/active-quote.model';
import { QuotationFlowService } from '../../domain/quotation-flow.service';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { ActiveQuoteCardComponent } from '../../../../shared/presentation/active-quote-card/active-quote-card.component';
import { PageChromeComponent } from '../../../../shared/presentation/page-chrome/page-chrome.component';
import { ShellHeaderStore } from '../../../../shared/presentation/shell-header/shell-header.store';
import { WhatsappFabComponent } from '../../../../shared/presentation/whatsapp-fab/whatsapp-fab.component';

@Component({
  selector: 'app-quotation-hub',
  standalone: true,
  imports: [
    CachedAssetImgDirective,
    ActiveQuoteCardComponent,
    PageChromeComponent,
    WhatsappFabComponent,
  ],
  templateUrl: './quotation-hub.component.html',
  styleUrl: './quotation-hub.component.scss',
})
export class QuotationHubComponent implements OnInit, OnDestroy {
  private readonly flow = inject(QuotationFlowService);
  private readonly shellHeader = inject(ShellHeaderStore);
  private refreshTimer?: ReturnType<typeof setInterval>;

  /**
   * In-progress quotations — Figma `3115:1504` when empty, `3115:1566` when filled.
   * User-submitted quotes are persisted in localStorage.
   */
  readonly activeQuotes = signal<readonly ActiveQuote[]>(getActiveQuotes());

  readonly sortedActiveQuotes = computed(() =>
    sortActiveQuotesLatestFirst(this.activeQuotes()),
  );

  refreshActiveQuotes(): void {
    this.activeQuotes.set(getActiveQuotes());
  }

  ngOnInit(): void {
    this.shellHeader.set({
      title: 'Get New Quote',
      showBack: true,
      onBack: () => this.goBack(),
    });
    this.refreshActiveQuotes();
    this.refreshTimer = setInterval(() => this.refreshActiveQuotes(), 30_000);
  }

  ngOnDestroy(): void {
    this.shellHeader.clear();
    clearInterval(this.refreshTimer);
  }

  goBack(): void {
    void this.flow.exitToHome();
  }

  getNewQuote(): void {
    void this.flow.startNewQuote();
  }

  acknowledgeReadyQuote(quoteId: string): void {
    markQuoteReadyNoticeDismissed(quoteId);
    this.refreshActiveQuotes();
  }

  viewQuote(quoteId: string): void {
    const quote = this.activeQuotes().find((item) => item.id === quoteId);
    if (!quote || !showActiveQuoteRowViewQuote(quote)) {
      return;
    }
    void this.flow.viewQuote(quoteId);
  }
}
