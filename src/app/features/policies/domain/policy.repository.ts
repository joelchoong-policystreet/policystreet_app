import { Observable } from 'rxjs';

import type { AddVehiclePayload, MotorPolicy, PolicyPersonalDetailsPatch } from './policy.model';

/**
 * Port for policy data. Stub uses static fixtures; swap for HTTP when APIs are ready.
 */
export interface PolicyRepository {
  getPolicies(): Observable<ReadonlyArray<MotorPolicy>>;
  addVehicle(payload: AddVehiclePayload): Observable<string>;
  deletePolicy(policyId: string): Observable<void>;
  updatePolicyPersonalDetails(policyId: string, patch: PolicyPersonalDetailsPatch): Observable<void>;
}
