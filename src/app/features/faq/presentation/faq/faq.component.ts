import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';
import { PageChromeComponent } from '../../../../shared/presentation/page-chrome/page-chrome.component';
import { QuickActionsComponent } from '../../../../shared/presentation/quick-actions/quick-actions.component';
import { ShellHeaderStore } from '../../../../shared/presentation/shell-header/shell-header.store';
import { WhatsappFabComponent } from '../../../../shared/presentation/whatsapp-fab/whatsapp-fab.component';
import { FAQ_EXTERNAL_PAGE_URL, FAQ_ITEMS } from '../../domain/faq.fixture';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [PageChromeComponent, QuickActionsComponent, WhatsappFabComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements OnInit, OnDestroy {
  private readonly inAppNav = inject(InAppNavigationHistoryService);
  private readonly shellHeader = inject(ShellHeaderStore);

  readonly items = FAQ_ITEMS;
  readonly externalFaqUrl = FAQ_EXTERNAL_PAGE_URL;

  readonly expandedId = signal(FAQ_ITEMS[0]?.id ?? '');

  ngOnInit(): void {
    this.shellHeader.set({
      title: 'FAQ',
      showBack: true,
      onBack: () => this.goBack(),
    });
  }

  ngOnDestroy(): void {
    this.shellHeader.clear();
  }

  isExpanded(id: string): boolean {
    return this.expandedId() === id;
  }

  toggleItem(id: string): void {
    this.expandedId.update((current) => (current === id ? '' : id));
  }

  goBack(): void {
    this.inAppNav.backOrNavigate(['/profile']);
  }
}
