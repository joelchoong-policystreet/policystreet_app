import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { CachedAssetImgDirective } from '../../assets/cached-asset-img.directive';

export type QuickActionId = 'quotation' | 'contact-support' | 'vehicles';

/**
 * Quick Actions rail shown on the top-right of desktop nav pages (Figma 3124:6164).
 * Self-contained navigation so any desktop page can drop it in beside its content.
 */
@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss',
})
export class QuickActionsComponent {
  private readonly router = inject(Router);

  /** Highlights the card for the current page (Figma active quick-action treatment). */
  readonly activeAction = input<QuickActionId | null>(null);

  goQuotation(): void {
    void this.router.navigate(['/quotation']);
  }

  goContactSupport(): void {
    void this.router.navigate(['/contact-support']);
  }

  goMyVehicles(): void {
    void this.router.navigate(['/my-vehicles']);
  }
}
