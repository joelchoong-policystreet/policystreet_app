import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { MOTOR_POLICIES_FIXTURE } from '../../data/motor-policies.fixture';
import { POLICY_REPOSITORY } from '../../domain/policy-repository.token';
import { toPolicyDetailsView } from '../../domain/policy.model';

@Component({
  selector: 'app-policy-details',
  standalone: true,
  templateUrl: './policy-details.component.html',
  styleUrl: './policy-details.component.scss',
})
export class PolicyDetailsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  readonly policy = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) =>
        this.policyRepository.getPolicies().pipe(
          map((all) => {
            // Replace with real empty-state when API is wired; fixture import can then go away.
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

  readonly isRenewDisabled = computed(() => this.policy()?.status === 'ACTIVE');

  goBack(): void {
    void this.router.navigate(['/policies']);
  }

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }

  onRenewNow(): void {
    if (this.isRenewDisabled()) {
      return;
    }
    // Placeholder action until renewal flow route is confirmed.
  }
}
