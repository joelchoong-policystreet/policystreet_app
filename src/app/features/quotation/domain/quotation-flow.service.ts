import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import type { QuotationCustomerTab } from './quotation-customer.model';

export type QuotationFlowQuery = {
  vehicleId?: string | null;
  ownerFullName?: string | null;
  customerTab?: QuotationCustomerTab | null;
  quoteId?: string | null;
  returnTo?: string | null;
};

/** Centralizes quotation wizard navigation and query-param assembly. */
@Injectable({ providedIn: 'root' })
export class QuotationFlowService {
  private readonly router = inject(Router);

  goToHub(): Promise<boolean> {
    return this.router.navigate(['/quotation']);
  }

  goToHubFromHome(): Promise<boolean> {
    return this.exitToHome();
  }

  startNewQuote(): Promise<boolean> {
    return this.router.navigate(['/quotation/new']);
  }

  goToVehicleSelect(query: QuotationFlowQuery = {}): Promise<boolean> {
    return this.navigate(['/quotation/new'], query);
  }

  goToRequestForm(vehicleId: string): Promise<boolean> {
    return this.navigate(['/quotation/form'], { vehicleId });
  }

  goToPreferences(
    vehicleId: string,
    ownerFullName?: string,
    customerTab: QuotationCustomerTab = 'malaysian',
  ): Promise<boolean> {
    return this.navigate(['/quotation/preferences'], { vehicleId, ownerFullName, customerTab });
  }

  /** Hub back — returns to home dashboard. */
  exitToHome(): Promise<boolean> {
    return this.router.navigate(['/home']);
  }

  backToVehicleSelect(vehicleId?: string | null): Promise<boolean> {
    return this.navigate(['/quotation/new'], { vehicleId });
  }

  backToRequestForm(
    vehicleId: string | null,
    ownerFullName?: string | null,
    customerTab: QuotationCustomerTab = 'malaysian',
  ): Promise<boolean> {
    return this.navigate(['/quotation/form'], { vehicleId, ownerFullName, customerTab });
  }

  viewQuote(quoteId: string): Promise<boolean> {
    return this.navigate(['/quotation/new'], { quoteId });
  }

  goToAddVehicle(returnTo = '/quotation/new'): Promise<boolean> {
    return this.router.navigate(['/my-vehicles/add'], { queryParams: { returnTo } });
  }

  requireVehicleIdOrRedirect(vehicleId: string | null | undefined): boolean {
    if (vehicleId) {
      return true;
    }
    void this.goToVehicleSelect();
    return false;
  }

  private navigate(path: string[], query: QuotationFlowQuery = {}): Promise<boolean> {
    const queryParams = this.buildQueryParams(query);
    return this.router.navigate(path, {
      queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    });
  }

  private buildQueryParams(query: QuotationFlowQuery): Record<string, string> {
    const params: Record<string, string> = {};
    const vehicleId = query.vehicleId?.trim();
    const ownerFullName = query.ownerFullName?.trim();
    const customerTab = query.customerTab?.trim();
    const quoteId = query.quoteId?.trim();
    const returnTo = query.returnTo?.trim();

    if (vehicleId) {
      params['vehicleId'] = vehicleId;
    }
    if (ownerFullName) {
      params['ownerFullName'] = ownerFullName;
    }
    if (customerTab) {
      params['customerTab'] = customerTab;
    }
    if (quoteId) {
      params['quoteId'] = quoteId;
    }
    if (returnTo) {
      params['returnTo'] = returnTo;
    }

    return params;
  }
}
