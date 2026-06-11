import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, startWith } from 'rxjs/operators';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { DEMO_PROFILE_EDIT_DETAILS } from '../../../profile/domain/profile-details.model';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { WhatsappFabComponent } from '../../../../shared/presentation/whatsapp-fab/whatsapp-fab.component';
import { PageChromeComponent } from '../../../../shared/presentation/page-chrome/page-chrome.component';
import { QUOTATION_NATIONALITY_OPTIONS } from '../../domain/quotation-foreigner.fixture';
import {
  QUOTATION_CUSTOMER_TABS,
  isQuotationCustomerTabImplemented,
  parseQuotationCustomerTab,
  type QuotationCustomerTab,
  type QuotationGender,
  type QuotationIdentityType,
} from '../../domain/quotation-customer.model';
import { QuotationFlowService } from '../../domain/quotation-flow.service';

const CAR_INSURANCE_OPTIONS = ['Comprehensive', 'Third Party', 'Third Party, Fire & Theft'] as const;
const DEMO_POSTCODE = '52000';

@Component({
  selector: 'app-quotation-request-form',
  standalone: true,
  imports: [ReactiveFormsModule, CachedAssetImgDirective, WhatsappFabComponent, PageChromeComponent],
  templateUrl: './quotation-request-form.component.html',
  styleUrl: './quotation-request-form.component.scss',
})
export class QuotationRequestFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly flow = inject(QuotationFlowService);
  private readonly route = inject(ActivatedRoute);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  readonly carInsuranceOptions = CAR_INSURANCE_OPTIONS;
  readonly nationalityOptions = QUOTATION_NATIONALITY_OPTIONS;
  readonly insuranceInfoIconSrc = '/assets/quotation/info.svg';
  readonly calendarIconSrc = '/assets/quotation/calendar-outlined.svg';

  readonly insuranceTooltipOpen = signal(false);

  readonly customerTabs = QUOTATION_CUSTOMER_TABS;
  readonly isCustomerTabImplemented = isQuotationCustomerTabImplemented;

  private readonly motorPolicies = toSignal(this.policyRepository.getPolicies(), {
    requireSync: true,
  });

  private readonly vehicleId = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('vehicleId'))),
    { initialValue: this.route.snapshot.queryParamMap.get('vehicleId') },
  );

  private readonly customerTabParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => parseQuotationCustomerTab(params.get('customerTab')))),
    {
      initialValue: parseQuotationCustomerTab(this.route.snapshot.queryParamMap.get('customerTab')),
    },
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
  readonly gender = signal<QuotationGender>('female');
  readonly consentChecked = signal(false);
  readonly foreignerConsentChecked = signal(false);

  readonly form = this.fb.nonNullable.group({
    insuranceType: ['Comprehensive', Validators.required],
    plateNo: ['', Validators.required],
    ownerFullName: ['', Validators.required],
    ownerIcNumber: ['', Validators.required],
    residentialPostcode: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
  });

  readonly foreignerForm = this.fb.nonNullable.group({
    insuranceType: ['Comprehensive', Validators.required],
    plateNo: ['', Validators.required],
    ownerFullName: ['', Validators.required],
    passportNumber: ['', Validators.required],
    nationality: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    residentialPostcode: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
  });

  readonly canContinue = toSignal(
    this.form.statusChanges.pipe(
      map(() => this.form.valid),
      startWith(this.form.valid),
    ),
    { initialValue: false },
  );

  readonly canContinueForeigner = toSignal(
    this.foreignerForm.statusChanges.pipe(
      map(() => this.foreignerForm.valid),
      startWith(this.foreignerForm.valid),
    ),
    { initialValue: false },
  );

  readonly submitLabel = computed(() =>
    this.activeCustomerTab() === 'foreigner' ? 'Next' : 'Continue',
  );

  readonly canSubmit = computed(() => {
    const tab = this.activeCustomerTab();
    if (tab === 'malaysian') {
      return (this.canContinue() ?? false) && this.consentChecked();
    }
    if (tab === 'foreigner') {
      return (this.canContinueForeigner() ?? false) && this.foreignerConsentChecked();
    }
    return false;
  });

  constructor() {
    if (!this.flow.requireVehicleIdOrRedirect(this.vehicleId())) {
      return;
    }
    this.activeCustomerTab.set(this.customerTabParam());
    this.prefillFromSelection();
  }

  goBack(): void {
    void this.flow.backToVehicleSelect(this.vehicleId());
  }

  setCustomerTab(tab: QuotationCustomerTab): void {
    if (!isQuotationCustomerTabImplemented(tab)) {
      return;
    }
    this.activeCustomerTab.set(tab);
  }

  setIdentityType(type: QuotationIdentityType): void {
    this.identityType.set(type);
  }

  setGender(value: QuotationGender): void {
    this.gender.set(value);
  }

  toggleConsent(): void {
    this.consentChecked.update((checked) => !checked);
  }

  toggleForeignerConsent(): void {
    this.foreignerConsentChecked.update((checked) => !checked);
  }

  openInsuranceTooltip(): void {
    this.insuranceTooltipOpen.set(true);
  }

  closeInsuranceTooltip(): void {
    this.insuranceTooltipOpen.set(false);
  }

  openDatePicker(input: HTMLInputElement): void {
    input.showPicker?.();
    input.focus();
  }

  continue(): void {
    if (!this.canSubmit()) {
      return;
    }
    const vehicleId = this.vehicleId();
    if (!vehicleId) {
      return;
    }
    const tab = this.activeCustomerTab();
    const ownerFullName =
      tab === 'foreigner'
        ? this.foreignerForm.getRawValue().ownerFullName.trim()
        : this.form.getRawValue().ownerFullName.trim();
    void this.flow.goToPreferences(vehicleId, ownerFullName, tab);
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

    this.foreignerForm.patchValue({
      insuranceType: vehicle?.coverageType ?? 'Comprehensive',
      plateNo: vehicle?.plate ?? '',
      ownerFullName: profile.fullName,
      passportNumber: profile.nricPassportNo,
      nationality: 'Singapore',
      dateOfBirth: '1990-01-15',
      residentialPostcode: DEMO_POSTCODE,
      mobileNumber: profile.mobileNo,
      emailAddress: profile.email,
    });
  }
}
