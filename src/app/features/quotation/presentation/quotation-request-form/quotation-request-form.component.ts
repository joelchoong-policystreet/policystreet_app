import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { DEMO_PROFILE_EDIT_DETAILS } from '../../../profile/domain/profile-details.model';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';

export type QuotationCustomerTab = 'malaysian' | 'foreigner' | 'company' | 'commercial';
export type QuotationIdentityType = 'malaysian' | 'police-army';

const CAR_INSURANCE_OPTIONS = ['Comprehensive', 'Third Party', 'Third Party, Fire & Theft'] as const;
const DEMO_POSTCODE = '52000';

@Component({
  selector: 'app-quotation-request-form',
  standalone: true,
  imports: [ReactiveFormsModule, CachedAssetImgDirective],
  templateUrl: './quotation-request-form.component.html',
  styleUrl: './quotation-request-form.component.scss',
})
export class QuotationRequestFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  readonly carInsuranceOptions = CAR_INSURANCE_OPTIONS;
  readonly whatsappHref = 'https://wa.me/60182822320';
  readonly insuranceInfoIconSrc = '/assets/quotation/info.svg';

  readonly insuranceTooltipOpen = signal(false);

  readonly customerTabs: ReadonlyArray<{ id: QuotationCustomerTab; label: string }> = [
    { id: 'malaysian', label: 'Malaysian' },
    { id: 'foreigner', label: 'Foreigner' },
    { id: 'company', label: 'Company' },
    { id: 'commercial', label: 'Commercial' },
  ];

  private readonly motorPolicies = toSignal(this.policyRepository.getPolicies(), {
    requireSync: true,
  });

  private readonly vehicleId = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('vehicleId'))),
    { initialValue: this.route.snapshot.queryParamMap.get('vehicleId') },
  );

  readonly selectedVehicle = computed(() => {
    const id = this.vehicleId();
    if (!id) {
      return null;
    }
    return this.motorPolicies().find((policy) => policy.id === id) ?? null;
  });

  readonly activeCustomerTab = signal<QuotationCustomerTab>('malaysian');
  readonly identityType = signal<QuotationIdentityType>('malaysian');
  readonly consentChecked = signal(false);

  readonly form = this.fb.nonNullable.group({
    insuranceType: ['Comprehensive', Validators.required],
    plateNo: ['', Validators.required],
    ownerFullName: ['', Validators.required],
    ownerIcNumber: ['', Validators.required],
    residentialPostcode: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
  });

  readonly canContinue = toSignal(
    this.form.statusChanges.pipe(
      map(() => this.isFormReady()),
      startWith(this.isFormReady()),
    ),
    { initialValue: false },
  );

  readonly showMalaysianForm = computed(() => this.activeCustomerTab() === 'malaysian');

  readonly canSubmit = computed(
    () => this.showMalaysianForm() && (this.canContinue() ?? false) && this.consentChecked(),
  );

  constructor() {
    const vehicleId = this.vehicleId();
    if (!vehicleId) {
      void this.router.navigate(['/quotation/new']);
      return;
    }
    this.prefillFromSelection();
  }

  goBack(): void {
    const vehicleId = this.vehicleId();
    void this.router.navigate(['/quotation/new'], {
      queryParams: vehicleId ? { vehicleId } : undefined,
    });
  }

  setCustomerTab(tab: QuotationCustomerTab): void {
    this.activeCustomerTab.set(tab);
  }

  setIdentityType(type: QuotationIdentityType): void {
    this.identityType.set(type);
  }

  toggleConsent(): void {
    this.consentChecked.update((checked) => !checked);
  }

  openInsuranceTooltip(): void {
    this.insuranceTooltipOpen.set(true);
  }

  closeInsuranceTooltip(): void {
    this.insuranceTooltipOpen.set(false);
  }

  continue(): void {
    if (!this.canSubmit()) {
      return;
    }
    const vehicleId = this.vehicleId();
    const ownerFullName = this.form.getRawValue().ownerFullName.trim();
    void this.router.navigate(['/quotation/preferences'], {
      queryParams: {
        ...(vehicleId ? { vehicleId } : {}),
        ...(ownerFullName ? { ownerFullName } : {}),
      },
    });
  }

  private prefillFromSelection(): void {
    const vehicle = this.selectedVehicle();
    const profile = DEMO_PROFILE_EDIT_DETAILS.personal;

    this.form.patchValue({
      insuranceType: vehicle?.coverageType ?? 'Comprehensive',
      plateNo: vehicle?.plate ?? '',
      ownerFullName: profile.fullName,
      ownerIcNumber: profile.nricPassportNo,
      residentialPostcode: DEMO_POSTCODE,
      mobileNumber: profile.mobileNo,
      emailAddress: profile.email,
    });
  }

  private isFormReady(): boolean {
    return this.form.valid;
  }
}
