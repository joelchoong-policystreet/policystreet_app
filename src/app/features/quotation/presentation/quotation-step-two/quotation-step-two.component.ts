import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { toQuotationVehicleOptions } from '../../../policies/domain/policy.model';

@Component({
  selector: 'app-quotation-step-two',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './quotation-step-two.component.html',
  styleUrl: './quotation-step-two.component.scss',
})
export class QuotationStepTwoComponent {
  private readonly router = inject(Router);
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
    void this.router.navigate(['/quotation']);
  }

  addVehicle(): void {
    void this.router.navigate(['/my-vehicles/add'], {
      queryParams: { returnTo: '/quotation/new' },
    });
  }

  selectVehicle(id: string): void {
    this.selectedVehicleId.update((current) => (current === id ? null : id));
  }

  continue(): void {
    const vehicleId = this.selectedVehicleId();
    if (!vehicleId) {
      return;
    }
    void this.router.navigate(['/quotation/form'], {
      queryParams: { vehicleId },
    });
  }
}
