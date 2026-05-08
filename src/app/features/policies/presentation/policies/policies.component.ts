import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type PolicyStatus = 'ACTIVE' | 'EXPIRING SOON' | 'EXPIRED';
type PolicyFilter = 'all' | 'active' | 'expiring' | 'expired';

type PolicyCard = {
  id: string;
  plate: string;
  carModel: string;
  policyNo: string;
  coverageType: string;
  coveragePeriod: string;
  status: PolicyStatus;
  secondaryAction?: string;
};

const POLICY_STATUS_PRIORITY: Record<PolicyStatus, number> = {
  EXPIRED: 0,
  'EXPIRING SOON': 1,
  ACTIVE: 2,
};

@Component({
  selector: 'app-policies',
  standalone: true,
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.scss',
})
export class PoliciesComponent implements AfterViewInit {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const filter = params.get('filter');
      if (this.isPolicyFilter(filter)) {
        this.activeFilter.set(filter);
      }
    });
  }

  readonly activeFilter = signal<PolicyFilter>('all');
  readonly expandedPolicyId = signal<string | null>(null);

  readonly tabs: Array<{ id: PolicyFilter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expiring', label: 'Expiring Soon' },
    { id: 'expired', label: 'Expired' },
  ];

  readonly policies: PolicyCard[] = [
    {
      id: 'p1',
      plate: 'VEJ1234',
      carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
      policyNo: 'Motor-Policy20250704-1536123412341',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'ACTIVE',
    },
    {
      id: 'p2',
      plate: 'QME1324',
      carModel: 'MAZDA CX-5 2022 GVC PLUS 2.5G HIGH 2488 6 SP AUTOMATIC CONVENTIONAL',
      policyNo: 'Motor-Policy20250704-1536123412341',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'EXPIRING SOON',
      secondaryAction: 'Renew Now',
    },
    {
      id: 'p3',
      plate: 'ABC8888',
      carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
      policyNo: 'Motor-Policy20250704-1536123412341',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'EXPIRED',
      secondaryAction: 'Renew Now',
    },
    {
      id: 'p4',
      plate: 'WQJ4721',
      carModel: 'TOYOTA VIOS 2021 G 1496 7 SP CVT',
      policyNo: 'Motor-Policy20250704-1536123412399',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'ACTIVE',
    },
    {
      id: 'p5',
      plate: 'JTB9016',
      carModel: 'PERODUA MYVI 2020 AV 1496 4 SP AUTOMATIC',
      policyNo: 'Motor-Policy20250704-1536123412477',
      coverageType: 'Third Party, Fire & Theft',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'EXPIRING SOON',
      secondaryAction: 'Renew Now',
    },
    {
      id: 'p6',
      plate: 'PKR3308',
      carModel: 'HONDA HR-V 2023 RS e:HEV 1498 E-CVT',
      policyNo: 'Motor-Policy20250704-1536123412554',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'ACTIVE',
    },
    {
      id: 'p7',
      plate: 'MNS7642',
      carModel: 'PROTON X50 2022 PREMIUM 1477 7DCT',
      policyNo: 'Motor-Policy20250704-1536123412631',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'EXPIRED',
      secondaryAction: 'Renew Now',
    },
    {
      id: 'p8',
      plate: 'BHV2195',
      carModel: 'MAZDA 3 2021 HIGH PLUS 1998 6 SP AUTOMATIC',
      policyNo: 'Motor-Policy20250704-1536123412702',
      coverageType: 'Comprehensive',
      coveragePeriod: 'DD/MM/YY - DD/MM/YY',
      status: 'EXPIRING SOON',
      secondaryAction: 'Renew Now',
    },
  ];

  readonly visiblePolicies = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') {
      return [...this.policies].sort(
        (a, b) => POLICY_STATUS_PRIORITY[a.status] - POLICY_STATUS_PRIORITY[b.status],
      );
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

  readonly useDropdownCards = computed(() => this.visiblePolicies().length > 3);
  readonly effectiveExpandedPolicyId = computed(() => {
    if (!this.useDropdownCards()) {
      return null;
    }
    return this.expandedPolicyId();
  });

  ngAfterViewInit(): void {
    // Expand the first card only once on initial load.
    if (!this.useDropdownCards()) {
      return;
    }
    const firstPolicy = this.visiblePolicies()[0];
    if (firstPolicy) {
      this.expandedPolicyId.set(firstPolicy.id);
    }
  }

  setFilter(filter: PolicyFilter): void {
    this.activeFilter.set(filter);
    this.expandedPolicyId.set(null);
  }

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }

  isPolicyExpanded(policy: PolicyCard): boolean {
    if (!this.useDropdownCards()) {
      return true;
    }
    return this.effectiveExpandedPolicyId() === policy.id;
  }

  togglePolicy(policy: PolicyCard): void {
    if (!this.useDropdownCards()) {
      return;
    }
    this.expandedPolicyId.update((current) => (current === policy.id ? null : policy.id));
  }

  private isPolicyFilter(value: string | null): value is PolicyFilter {
    return value === 'all' || value === 'active' || value === 'expiring' || value === 'expired';
  }
}

