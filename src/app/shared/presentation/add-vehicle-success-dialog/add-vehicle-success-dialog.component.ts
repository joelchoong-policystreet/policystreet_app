import { Component, effect, input, output, signal } from '@angular/core';

import { CachedAssetImgDirective } from '../../assets/cached-asset-img.directive';

@Component({
  selector: 'app-add-vehicle-success-dialog',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './add-vehicle-success-dialog.component.html',
  styleUrl: './add-vehicle-success-dialog.component.scss',
})
export class AddVehicleSuccessDialogComponent {
  readonly open = input(false);

  readonly closed = output<void>();

  readonly showPawsper = signal(false);

  readonly successHeroSrc = '/assets/quotation/vehicle-added-success-hero.png';
  readonly pawsperSrc = '/assets/quotation/vehicle-added-pawsper.png';

  constructor() {
    effect(() => {
      if (this.open()) {
        this.showPawsper.set(false);
        requestAnimationFrame(() => {
          this.showPawsper.set(true);
        });
        return;
      }
      this.showPawsper.set(false);
    });
  }

  onClose(): void {
    this.closed.emit();
  }
}
