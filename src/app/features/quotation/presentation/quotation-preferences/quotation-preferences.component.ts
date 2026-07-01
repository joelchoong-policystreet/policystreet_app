import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
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
import { WhatsappFabComponent } from '../../../../shared/presentation/whatsapp-fab/whatsapp-fab.component';
import { PageChromeComponent } from '../../../../shared/presentation/page-chrome/page-chrome.component';
import { ShellHeaderStore } from '../../../../shared/presentation/shell-header/shell-header.store';
import {
  QUOTATION_CUSTOMER_TABS,
  isQuotationCustomerTabImplemented,
  parseQuotationCustomerTab,
  type QuotationCustomerTab,
} from '../../domain/quotation-customer.model';
import { QuotationFlowService } from '../../domain/quotation-flow.service';

@Component({
  selector: 'app-quotation-preferences',
  standalone: true,
  imports: [CachedAssetImgDirective, WhatsappFabComponent, PageChromeComponent],
  templateUrl: './quotation-preferences.component.html',
  styleUrl: './quotation-preferences.component.scss',
})
export class QuotationPreferencesComponent implements OnInit, OnDestroy {
  private readonly flow = inject(QuotationFlowService);
  private readonly route = inject(ActivatedRoute);
  private readonly policyRepository = inject(POLICY_REPOSITORY);
  private readonly shellHeader = inject(ShellHeaderStore);

  readonly infoIconSrc = '/assets/quotation/info.svg';

  readonly customerTabs = QUOTATION_CUSTOMER_TABS;
  readonly isCustomerTabImplemented = isQuotationCustomerTabImplemented;

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
  readonly showForeignerForm = computed(() => this.activeCustomerTab() === 'foreigner');

  readonly submitLabel = computed(() =>
    this.activeCustomerTab() === 'foreigner' ? 'Find The BEST Price!' : 'Find the BEST prices!',
  );

  readonly canSubmit = computed(() => {
    if (this.ownerFullName().length === 0) {
      return false;
    }
    return this.showMalaysianForm() || this.showForeignerForm();
  });

  constructor() {
    if (!this.flow.requireVehicleIdOrRedirect(this.vehicleId())) {
      return;
    }

    this.activeCustomerTab.set(this.customerTabParam());
    if (this.customerTabParam() === 'foreigner') {
      this.contactMethod.set('email');
    }

    effect(() => {
      const ownerFullName = this.ownerFullName();
      const tab = this.activeCustomerTab();
      if (ownerFullName && tab === 'malaysian') {
        this.applyPreferencesForOwner(ownerFullName);
      }
    });
  }

  ngOnInit(): void {
    this.shellHeader.set({
      title: 'Get New Quote',
      showBack: true,
      onBack: () => this.goBack(),
    });
  }

  ngOnDestroy(): void {
    this.shellHeader.clear();
  }

  goBack(): void {
    void this.flow.backToRequestForm(
      this.vehicleId(),
      this.ownerFullName(),
      this.activeCustomerTab(),
    );
  }

  setCustomerTab(tab: QuotationCustomerTab): void {
    if (!isQuotationCustomerTabImplemented(tab)) {
      return;
    }
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
      eHailingUsage: this.activeCustomerTab() === 'foreigner' ? 'no' : this.eHailingUsage(),
      maritalStatus: this.maritalStatus(),
      contactMethod: this.contactMethod(),
    };

    saveQuotationOwnerPreferences(ownerFullName, preferences);

    const vehicle = this.selectedVehicle();
    if (!vehicle) {
      return;
    }

    addInProgressActiveQuote(createInProgressActiveQuote(vehicle.plate, vehicle.id));
    void this.flow.goToHub();
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
