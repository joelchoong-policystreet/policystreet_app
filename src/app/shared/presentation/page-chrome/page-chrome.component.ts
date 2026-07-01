import { Component, input, output } from '@angular/core';

/**
 * Nested-flow header chrome (Figma 3115:1490).
 * Parent handles `(back)` — use explicit `router.navigate` for wizard steps,
 * or `InAppNavigationHistoryService.backOrNavigate` for hub-style screens.
 */
@Component({
  selector: 'app-page-chrome',
  standalone: true,
  templateUrl: './page-chrome.component.html',
  styleUrl: './page-chrome.component.scss',
  host: {
    '[class.page-chrome-host--bordered]': 'showBorder()',
  },
})
export class PageChromeComponent {
  readonly title = input.required<string>();
  readonly backAriaLabel = input('Back');
  readonly showBorder = input(true);
  /** Optional `aria-label` on the header element. */
  readonly headerAriaLabel = input<string | undefined>(undefined);

  readonly back = output<void>();

  onBack(): void {
    this.back.emit();
  }
}
