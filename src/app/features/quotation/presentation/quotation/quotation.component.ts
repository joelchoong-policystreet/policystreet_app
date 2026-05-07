import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

type QuoteTarget = 'myself' | 'someone-else';

@Component({
  selector: 'app-quotation',
  standalone: true,
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss',
})
export class QuotationComponent {
  constructor(private readonly router: Router) {}

  readonly logoBrandSrc = '/assets/home/PS Car Insurance Logo.svg';
  readonly selected = signal<QuoteTarget>('myself');

  goBack(): void {
    void this.router.navigate(['/home']);
  }

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
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

