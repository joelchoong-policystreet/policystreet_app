import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AuthRepositoryStub } from './features/auth/data/auth.repository.stub';
import { AUTH_REPOSITORY } from './features/auth/domain/auth-repository.token';
import { LocalOnboardingStorage } from './features/onboarding/data/local-onboarding.storage';
import { ONBOARDING_STORAGE } from './features/onboarding/domain/onboarding-storage.token';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: AUTH_REPOSITORY, useClass: AuthRepositoryStub },
    { provide: ONBOARDING_STORAGE, useClass: LocalOnboardingStorage },
  ],
};
