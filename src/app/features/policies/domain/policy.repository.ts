import { Observable } from 'rxjs';

import type { MotorPolicy } from './policy.model';

/**
 * Port for policy data. Stub uses static fixtures; swap for HTTP when APIs are ready.
 */
export interface PolicyRepository {
  getPolicies(): Observable<ReadonlyArray<MotorPolicy>>;
  deletePolicy(policyId: string): Observable<void>;
}
