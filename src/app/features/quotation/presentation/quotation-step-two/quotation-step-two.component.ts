import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { PageChromeComponent } from '../../../../shared/presentation/page-chrome/page-chrome.component';
import { toQuotationVehicleOptions } from '../../../policies/domain/policy.model';
import { AddVehicleDialogComponent } from '../add-vehicle-dialog/add-vehicle-dialog.component';
import { QuotationFlowService } from '../../domain/quotation-flow.service';

@Component({
  selector: 'app-quotation-step-two',
  standalone: true,
  imports: [CachedAssetImgDirective, PageChromeComponent, AddVehicleDialogComponent],
  templateUrl: './quotation-step-two.component.html',
  styleUrl: './quotation-step-two.component.scss',
})
export class QuotationStepTwoComponent {
  private readonly flow = inject(QuotationFlowService);
  private readonly route = inject(ActivatedRoute);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  /** Same `MotorPolicy[]` as My Vehicles (fixture today, API later). */
  private readonly motorPolicies = toSignal(this.policyRepository.getPolicies(), {
    requireSync: true,
  });

  readonly vehicles = computed(() => toQuotationVehicleOptions(this.motorPolicies()));

  private readonly queryVehicleId = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('vehicleId'))),
    { initialValue: this.route.snapshot.queryParamMap.get('vehicleId') },
  );

  readonly selectedVehicleId = signal<string | null>(null);
  readonly addVehicleDialogOpen = signal(false);
  readonly canContinue = computed(() => this.selectedVehicleId() !== null);

  constructor() {
    effect(() => {
      const vehicleId = this.queryVehicleId();
      if (vehicleId) {
        this.selectedVehicleId.set(vehicleId);
      }
    });
  }

  goBack(): void {
    void this.flow.goToHub();
  }

  addVehicle(): void {
    this.addVehicleDialogOpen.set(true);
  }

  onAddVehicleDialogClosed(): void {
    this.addVehicleDialogOpen.set(false);
  }

  onVehicleAdded(vehicleId: string): void {
    if (vehicleId) {
      this.selectedVehicleId.set(vehicleId);
    }
  }

  selectVehicle(id: string): void {
    this.selectedVehicleId.update((current) => (current === id ? null : id));
  }

  continue(): void {
    const vehicleId = this.selectedVehicleId();
    if (!vehicleId) {
      return;
    }
    void this.flow.goToRequestForm(vehicleId);
  }
}
