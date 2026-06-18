import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { toSavedVehicleViews, type SavedVehicleView } from '../../../policies/domain/policy.model';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';
import { PageChromeComponent } from '../../../../shared/presentation/page-chrome/page-chrome.component';
import { QuickActionsComponent } from '../../../../shared/presentation/quick-actions/quick-actions.component';
import { ShellHeaderStore } from '../../../../shared/presentation/shell-header/shell-header.store';
import { ViewportFixedDirective } from '../../../../shared/presentation/viewport-fixed/viewport-fixed.directive';
import { WhatsappFabComponent } from '../../../../shared/presentation/whatsapp-fab/whatsapp-fab.component';

@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [
    CachedAssetImgDirective,
    PageChromeComponent,
    QuickActionsComponent,
    ViewportFixedDirective,
    WhatsappFabComponent,
  ],
  templateUrl: './my-vehicles.component.html',
  styleUrl: './my-vehicles.component.scss',
})
export class MyVehiclesComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly inAppNav = inject(InAppNavigationHistoryService);
  private readonly policyRepository = inject(POLICY_REPOSITORY);
  private readonly shellHeader = inject(ShellHeaderStore);

  /** Same `MotorPolicy[]` as policies list and quotation step 2. */
  private readonly motorPolicies = toSignal(this.policyRepository.getPolicies(), {
    requireSync: true,
  });

  readonly vehicles = computed(() => toSavedVehicleViews(this.motorPolicies()));
  readonly isDeleteConfirmOpen = signal(false);
  readonly vehiclePendingDelete = signal<SavedVehicleView | null>(null);

  ngOnInit(): void {
    this.shellHeader.set({
      title: 'My Vehicles',
      showBack: true,
      onBack: () => this.goBack(),
    });
  }

  ngOnDestroy(): void {
    this.shellHeader.clear();
  }

  goBack(): void {
    this.inAppNav.backOrNavigate(['/home']);
  }

  openDeleteConfirm(vehicle: SavedVehicleView): void {
    this.vehiclePendingDelete.set(vehicle);
    this.isDeleteConfirmOpen.set(true);
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen.set(false);
    this.vehiclePendingDelete.set(null);
  }

  onDeleteVehicleConfirmed(): void {
    const vehicle = this.vehiclePendingDelete();
    if (!vehicle) {
      return;
    }

    this.closeDeleteConfirm();
    this.policyRepository
      .deletePolicy(vehicle.id)
      .pipe(take(1))
      .subscribe();
  }

  onAddVehicle(): void {
    void this.router.navigate(['/my-vehicles/add']);
  }
}
