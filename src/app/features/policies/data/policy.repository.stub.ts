import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MOTOR_POLICIES_FIXTURE } from './motor-policies.fixture';
import type { MotorPolicy } from '../domain/policy.model';
import type { PolicyRepository } from '../domain/policy.repository';

@Injectable()
export class PolicyRepositoryStub implements PolicyRepository {
  getPolicies(): Observable<ReadonlyArray<MotorPolicy>> {
    return of(MOTOR_POLICIES_FIXTURE);
  }
}
