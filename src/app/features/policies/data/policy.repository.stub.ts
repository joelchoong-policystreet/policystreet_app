import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { MOTOR_POLICIES_FIXTURE } from './motor-policies.fixture';
import type { MotorPolicy, PolicyPersonalDetailsPatch } from '../domain/policy.model';
import type { PolicyRepository } from '../domain/policy.repository';

@Injectable()
export class PolicyRepositoryStub implements PolicyRepository {
  private readonly policiesState = new BehaviorSubject<ReadonlyArray<MotorPolicy>>([
    ...MOTOR_POLICIES_FIXTURE,
  ]);

  getPolicies(): Observable<ReadonlyArray<MotorPolicy>> {
    return this.policiesState.asObservable();
  }

  deletePolicy(policyId: string): Observable<void> {
    const next = this.policiesState.getValue().filter((policy) => policy.id !== policyId);
    this.policiesState.next(next);
    return of(void 0);
  }

  updatePolicyPersonalDetails(policyId: string, patch: PolicyPersonalDetailsPatch): Observable<void> {
    const list = this.policiesState.getValue();
    const next = list.map((policy) =>
      policy.id === policyId ? { ...policy, ...patch } : policy,
    );
    this.policiesState.next(next);
    return of(void 0);
  }
}
