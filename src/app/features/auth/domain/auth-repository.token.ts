import { InjectionToken } from '@angular/core';
import type { AuthRepository } from './auth.repository';

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
