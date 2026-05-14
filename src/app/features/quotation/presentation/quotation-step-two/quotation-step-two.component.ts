import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { APP_BRAND_LOGO_SRC } from '../../../../shared/branding/app-brand-logo';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';
import { toQuotationVehicleOptions } from '../../../policies/domain/policy.model';

@Component({
  selector: 'app-quotation-step-two',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './quotation-step-two.component.html',
  styleUrl: './quotation-step-two.component.scss',
})
export class QuotationStepTwoComponent {
  private readonly inAppNav = inject(InAppNavigationHistoryService);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  readonly logoBrandSrc = APP_BRAND_LOGO_SRC;

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
    this.inAppNav.backOrNavigate(['/quotation']);
  }

  selectVehicle(id: string): void {
    this.selectedVehicleId.set(id);
  }

  continue(): void {
    // Next step to be implemented.
  }
}
