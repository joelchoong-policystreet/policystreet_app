import { InjectionToken } from '@angular/core';

import type { AuthSessionStorage } from './auth-session.storage';

export const AUTH_SESSION_STORAGE = new InjectionToken<AuthSessionStorage>('AUTH_SESSION_STORAGE');
