import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import {
  addInProgressActiveQuote,
  createInProgressActiveQuote,
} from '../../data/active-quotes.storage';
import {
  resolveQuotationOwnerPreferences,
  saveQuotationOwnerPreferences,
} from '../../data/quotation-owner-preferences.storage';
import type {
  EHailingUsage,
  QuotationContactMethod,
  QuotationMaritalStatus,
  QuotationOwnerPreferences,
} from '../../domain/quotation-preferences.model';
import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';

export type QuotationCustomerTab = 'malaysian' | 'foreigner' | 'company' | 'commercial';

@Component({
  selector: 'app-quotation-preferences',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './quotation-preferences.component.html',
  styleUrl: './quotation-preferences.component.scss',
})
export class QuotationPreferencesComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  readonly infoIconSrc = '/assets/quotation/info.svg';
  readonly whatsappHref = 'https://wa.me/60182822320';

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

  private readonly ownerFullNameParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('ownerFullName')?.trim() ?? '')),
    { initialValue: this.route.snapshot.queryParamMap.get('ownerFullName')?.trim() ?? '',
  });

  readonly selectedVehicle = computed(() => {
    const id = this.vehicleId();
    if (!id) {
      return null;
    }
    return this.motorPolicies().find((policy) => policy.id === id) ?? null;
  });

  readonly ownerFullName = computed(() => {
    const fromQuery = this.ownerFullNameParam();
    if (fromQuery) {
      return fromQuery;
    }
    return this.selectedVehicle()?.ownerFullName.trim() ?? '';
  });

  readonly activeCustomerTab = signal<QuotationCustomerTab>('malaysian');
  readonly eHailingUsage = signal<EHailingUsage>('no');
  readonly maritalStatus = signal<QuotationMaritalStatus>('single');
  readonly contactMethod = signal<QuotationContactMethod>('whatsapp');

  readonly showMalaysianForm = computed(() => this.activeCustomerTab() === 'malaysian');

  readonly canSubmit = computed(() => this.showMalaysianForm() && this.ownerFullName().length > 0);

  constructor() {
    const vehicleId = this.vehicleId();
    if (!vehicleId) {
      void this.router.navigate(['/quotation/new']);
      return;
    }

    effect(() => {
      const ownerFullName = this.ownerFullName();
      if (ownerFullName) {
        this.applyPreferencesForOwner(ownerFullName);
      }
    });
  }

  goBack(): void {
    const vehicleId = this.vehicleId();
    const ownerFullName = this.ownerFullName();
    void this.router.navigate(['/quotation/form'], {
      queryParams: {
        ...(vehicleId ? { vehicleId } : {}),
        ...(ownerFullName ? { ownerFullName } : {}),
      },
    });
  }

  setCustomerTab(tab: QuotationCustomerTab): void {
    this.activeCustomerTab.set(tab);
  }

  setEHailingUsage(value: EHailingUsage): void {
    this.eHailingUsage.set(value);
  }

  setMaritalStatus(value: QuotationMaritalStatus): void {
    this.maritalStatus.set(value);
  }

  setContactMethod(value: QuotationContactMethod): void {
    this.contactMethod.set(value);
  }

  findBestPrices(): void {
    if (!this.canSubmit()) {
      return;
    }

    const ownerFullName = this.ownerFullName();
    const preferences: QuotationOwnerPreferences = {
      eHailingUsage: this.eHailingUsage(),
      maritalStatus: this.maritalStatus(),
      contactMethod: this.contactMethod(),
    };

    saveQuotationOwnerPreferences(ownerFullName, preferences);

    const vehicle = this.selectedVehicle();
    if (!vehicle) {
      return;
    }

    addInProgressActiveQuote(createInProgressActiveQuote(vehicle.plate, vehicle.id));
    void this.router.navigate(['/quotation']);
  }

  private applyPreferencesForOwner(ownerFullName: string): void {
    if (!ownerFullName) {
      return;
    }

    const preferences = resolveQuotationOwnerPreferences(ownerFullName);
    this.eHailingUsage.set(preferences.eHailingUsage);
    this.maritalStatus.set(preferences.maritalStatus);
    this.contactMethod.set(preferences.contactMethod);
  }
}
