import { InjectionToken } from '@angular/core';

import type { PolicyRepository } from './policy.repository';

export const POLICY_REPOSITORY = new InjectionToken<PolicyRepository>('POLICY_REPOSITORY');
