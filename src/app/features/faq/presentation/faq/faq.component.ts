import { Component, inject, signal } from '@angular/core';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';
import { PageChromeComponent } from '../../../../shared/presentation/page-chrome/page-chrome.component';
import { FAQ_EXTERNAL_PAGE_URL, FAQ_ITEMS } from '../../domain/faq.fixture';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [PageChromeComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  private readonly inAppNav = inject(InAppNavigationHistoryService);

  readonly items = FAQ_ITEMS;
  readonly externalFaqUrl = FAQ_EXTERNAL_PAGE_URL;

  readonly expandedId = signal(FAQ_ITEMS[0]?.id ?? '');

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
