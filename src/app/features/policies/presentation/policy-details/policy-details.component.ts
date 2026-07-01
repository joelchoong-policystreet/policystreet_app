import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { map, switchMap } from 'rxjs/operators';

import { MOTOR_POLICIES_FIXTURE } from '../../data/motor-policies.fixture';
import { POLICY_REPOSITORY } from '../../domain/policy-repository.token';
import {
  daysUntilCoverageEnd,
  formatExpiryDayLabel,
  toPolicyDetailsView,
  type PolicyDetailsView,
  type PolicyPersonalDetailsPatch,
  type PolicyStatus,
} from '../../domain/policy.model';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';
import { ShellHeaderStore } from '../../../../shared/presentation/shell-header/shell-header.store';

const POLICY_STATUS_LABELS: Record<PolicyStatus, string> = {
  ACTIVE: 'Active',
  'EXPIRING SOON': 'Expiring Soon',
  EXPIRED: 'Expired',
};

@Component({
  selector: 'app-policy-details',
  standalone: true,
  imports: [ReactiveFormsModule, CachedAssetImgDirective],
  templateUrl: './policy-details.component.html',
  styleUrl: './policy-details.component.scss',
})
export class PolicyDetailsComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly inAppNav = inject(InAppNavigationHistoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly policyRepository = inject(POLICY_REPOSITORY);
  private readonly fb = inject(FormBuilder);
  private readonly shellHeader = inject(ShellHeaderStore);

  readonly maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'] as const;
  readonly genderOptions = ['Male', 'Female'] as const;

  readonly policy = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) =>
        this.policyRepository.getPolicies().pipe(
          map((all) => {
            const list = all.length > 0 ? all : MOTOR_POLICIES_FIXTURE;
            const id = params.get('id');
            const motor = list.find((p) => p.id === id) ?? list[0];
            return toPolicyDetailsView(motor);
          }),
        ),
      ),
    ),
    { initialValue: toPolicyDetailsView(MOTOR_POLICIES_FIXTURE[0]) },
  );

  readonly personalDetailsForm = this.fb.nonNullable.group({
    ownerFullName: ['', Validators.required],
    ownerIcNumber: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    maritalStatus: ['', Validators.required],
    gender: ['', Validators.required],
    residentialAddress: ['', Validators.required],
  });

  readonly isEditingPersonalDetails = signal(false);

  private lastSyncedPersonalDetailsPolicyId: string | undefined;

  readonly isRenewDisabled = computed(() => this.policy()?.status === 'ACTIVE');
  readonly statusLabel = computed(() => POLICY_STATUS_LABELS[this.policy().status]);
  readonly isPolicyAlertDismissed = signal(false);
  readonly showPolicyAlert = computed(() => {
    if (this.isPolicyAlertDismissed()) {
      return false;
    }
    const status = this.policy().status;
    return status === 'EXPIRING SOON' || status === 'EXPIRED';
  });
  readonly daysUntilExpiry = computed(() =>
    daysUntilCoverageEnd(this.policy().coverageEndDate),
  );
  readonly expiryDayLabel = computed(() => formatExpiryDayLabel(this.daysUntilExpiry()));
  readonly isDeleteConfirmOpen = signal(false);

  constructor() {
    effect(() => {
      const p = this.policy();
      const idChanged = this.lastSyncedPersonalDetailsPolicyId !== p.id;
      if (idChanged) {
        this.lastSyncedPersonalDetailsPolicyId = p.id;
        this.isEditingPersonalDetails.set(false);
        this.isPolicyAlertDismissed.set(false);
        this.patchPersonalDetailsForm(p);
        return;
      }
      if (!this.isEditingPersonalDetails()) {
        this.patchPersonalDetailsForm(p);
      }
    });

    // Publish the page header so the desktop shell renders it beside the profile
    // avatar (one combined header bar). Re-runs to keep the Renew state in sync.
    effect(() => {
      this.shellHeader.set({
        title: 'Policy Information',
        showBack: true,
        onBack: () => this.goBack(),
        action: {
          label: 'Renew Now',
          disabled: this.isRenewDisabled(),
          handler: () => this.onRenewNow(),
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.shellHeader.clear();
  }

  goBack(): void {
    this.inAppNav.backOrNavigate(['/policies']);
  }

  onRenewNow(): void {
    if (this.isRenewDisabled()) {
      return;
    }
  }

  openDeleteConfirm(): void {
    this.isDeleteConfirmOpen.set(true);
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen.set(false);
  }

  dismissPolicyAlert(): void {
    this.isPolicyAlertDismissed.set(true);
  }

  onDeletePolicyConfirmed(): void {
    this.isDeleteConfirmOpen.set(false);
    const policyId = this.policy()?.id;
    if (!policyId) {
      return;
    }
    this.policyRepository
      .deletePolicy(policyId)
      .pipe(take(1))
      .subscribe(() => {
        void this.router.navigate(['/policies']);
      });
  }

  startEditPersonalDetails(): void {
    this.patchPersonalDetailsForm(this.policy());
    this.isEditingPersonalDetails.set(true);
  }

  cancelEditPersonalDetails(): void {
    this.patchPersonalDetailsForm(this.policy());
    this.isEditingPersonalDetails.set(false);
  }

  savePersonalDetails(): void {
    if (this.personalDetailsForm.invalid) {
      this.personalDetailsForm.markAllAsTouched();
      return;
    }
    const policyId = this.policy().id;
    const patch = this.personalDetailsForm.getRawValue() as PolicyPersonalDetailsPatch;
    this.policyRepository
      .updatePolicyPersonalDetails(policyId, patch)
      .pipe(take(1))
      .subscribe(() => {
        this.isEditingPersonalDetails.set(false);
      });
  }

  private patchPersonalDetailsForm(p: PolicyDetailsView): void {
    this.personalDetailsForm.patchValue({
      ownerFullName: p.ownerFullName,
      ownerIcNumber: p.ownerIcNumber,
      mobileNumber: p.mobileNumber,
      emailAddress: p.emailAddress,
      maritalStatus: p.maritalStatus,
      gender: p.gender,
      residentialAddress: p.residentialAddress,
    });
  }
}
