import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppBottomNavComponent } from '../../../../shared/presentation/app-bottom-nav/app-bottom-nav.component';

type PolicyStatus = 'ACTIVE' | 'EXPIRING SOON' | 'EXPIRED';
type PolicyFilter = 'all' | 'active' | 'expiring' | 'expired';

type PolicyCard = {
  plate: string;
  carModel: string;
  policyNo: string;
  coverageType: string;
  coveragePeriod: string;
  status: PolicyStatus;
  secondaryAction?: string;
};

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [AppBottomNavComponent],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.scss',
})
export class PoliciesComponent {
  constructor(private readonly router: Router) {}

  readonly logoSrc = '/assets/home/ps-car-insurance-04.svg';
  readonly activeFilter = signal<PolicyFilter>('all');
  readonly hideExpiringNotice = signal(false);
  readonly hideExpiredNotice = signal(false);

  readonly tabs: Array<{ id: PolicyFilter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expiring', label: 'Expiring Soon' },
    { id: 'expired', label: 'Expired' },
  ];

  readonly policies: PolicyCard[] = [
    {
      plate: 'VEJ1234',
      carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
      policyNo: 'Motor-Policy20250704-1536123412341',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'ACTIVE',
    },
    {
      plate: 'QME1324',
      carModel: 'MAZDA CX-5 2022 GVC PLUS 2.5G HIGH 2488 6 SP AUTOMATIC CONVENTIONAL',
      policyNo: 'Motor-Policy20250704-1536123412341',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'EXPIRING SOON',
      secondaryAction: 'Renew Now',
    },
    {
      plate: 'ABC8888',
      carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
      policyNo: 'Motor-Policy20250704-1536123412341',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'EXPIRED',
      secondaryAction: 'Get A Quote',
    },
  ];

  readonly visiblePolicies = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') {
      return this.policies;
    }

    return this.policies.filter((policy) => {
      if (filter === 'active') {
        return policy.status === 'ACTIVE';
      }
      if (filter === 'expiring') {
        return policy.status === 'EXPIRING SOON';
      }
      return policy.status === 'EXPIRED';
    });
  });

  readonly showExpiringNotice = computed(
    () => this.activeFilter() === 'expiring' && !this.hideExpiringNotice(),
  );

  readonly showExpiredNotice = computed(
    () => this.activeFilter() === 'expired' && !this.hideExpiredNotice(),
  );

  setFilter(filter: PolicyFilter): void {
    this.activeFilter.set(filter);
  }

  dismissExpiringNotice(): void {
    this.hideExpiringNotice.set(true);
  }

  dismissExpiredNotice(): void {
    this.hideExpiredNotice.set(true);
  }

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }
}

