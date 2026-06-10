import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';

type QuoteTarget = 'myself' | 'someone-else';

@Component({
  selector: 'app-quotation',
  standalone: true,
  imports: [],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss',
})
export class QuotationComponent {
  constructor(
    private readonly router: Router,
    private readonly inAppNav: InAppNavigationHistoryService,
  ) {}

  readonly selected = signal<QuoteTarget>('myself');

  goBack(): void {
    this.inAppNav.backOrNavigate(['/quotation']);
  }

  select(target: QuoteTarget): void {
    this.selected.set(target);
  }

  continue(): void {
    void this.router.navigate(['/quotation/step-2'], {
      queryParams: { target: this.selected() },
    });
  }
}

