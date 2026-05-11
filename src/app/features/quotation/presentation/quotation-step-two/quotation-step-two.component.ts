import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { toQuotationVehicleOptions } from '../../../policies/domain/policy.model';

@Component({
  selector: 'app-quotation-step-two',
  standalone: true,
  templateUrl: './quotation-step-two.component.html',
  styleUrl: './quotation-step-two.component.scss',
})
export class QuotationStepTwoComponent {
  private readonly router = inject(Router);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  readonly logoBrandSrc = '/assets/home/PS Car Insurance Logo.svg';

  /** Same `MotorPolicy[]` as policies list (fixture today, API later). */
  private readonly motorPolicies = toSignal(this.policyRepository.getPolicies(), {
    /** Stub uses `of()`; drop when wiring async HTTP + `initialValue: []`. */
    requireSync: true,
  });

  /** Same rows as policies / policy details, in quotation card shape. */
  readonly vehicles = computed(() => toQuotationVehicleOptions(this.motorPolicies()));

  readonly selectedVehicleId = signal<string | null>(null);
  readonly canContinue = computed(() => this.selectedVehicleId() !== null);

  goBack(): void {
    void this.router.navigate(['/quotation']);
  }

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }

  selectVehicle(id: string): void {
    this.selectedVehicleId.set(id);
  }

  continue(): void {
    // Next step to be implemented.
  }
}
