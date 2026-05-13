import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';

import { POLICY_REPOSITORY } from '../../domain/policy-repository.token';
import {
  type PolicyCard,
  type PolicyFilter,
  sortPolicyCardsForAllTab,
  toPolicyCard,
} from '../../domain/policy.model';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.scss',
})
export class PoliciesComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  readonly activeFilter = signal<PolicyFilter>('all');
  readonly expandedPolicyId = signal<string | null>(null);

  readonly tabs: Array<{ id: PolicyFilter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expiring', label: 'Expiring Soon' },
    { id: 'expired', label: 'Expired' },
  ];

  readonly policies = toSignal(
    this.policyRepository.getPolicies().pipe(map((list) => list.map(toPolicyCard))),
    { initialValue: [] as PolicyCard[] },
  );

  readonly visiblePolicies = computed(() => {
    const list = this.policies();
    const filter = this.activeFilter();
    if (filter === 'all') {
      return sortPolicyCardsForAllTab(list);
    }

    return list.filter((policy) => {
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

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const filter = params.get('filter');
      if (this.isPolicyFilter(filter)) {
        this.activeFilter.set(filter);
      }
    });
  }

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

  goPolicyDetails(policyId: string): void {
    void this.router.navigate(['/policies', policyId]);
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
