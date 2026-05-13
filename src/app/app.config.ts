import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { AuthRepositoryStub } from './features/auth/data/auth.repository.stub';
import { AUTH_REPOSITORY } from './features/auth/domain/auth-repository.token';
import { PolicyRepositoryStub } from './features/policies/data/policy.repository.stub';
import { POLICY_REPOSITORY } from './features/policies/domain/policy-repository.token';
import { LocalOnboardingStorage } from './features/onboarding/data/local-onboarding.storage';
import { ONBOARDING_STORAGE } from './features/onboarding/domain/onboarding-storage.token';
import { routes } from './app.routes';
import { AssetSessionCacheService } from './shared/assets/asset-session-cache.service';
import { InAppNavigationHistoryService } from './shared/navigation/in-app-navigation-history.service';

function initInAppNavigationHistory(_history: InAppNavigationHistoryService): () => void {
  return () => undefined;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      inject(AssetSessionCacheService).warmSessionAssets();
    }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initInAppNavigationHistory,
      deps: [InAppNavigationHistoryService],
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    { provide: AUTH_REPOSITORY, useClass: AuthRepositoryStub },
    { provide: ONBOARDING_STORAGE, useClass: LocalOnboardingStorage },
    { provide: POLICY_REPOSITORY, useClass: PolicyRepositoryStub },
  ],
};
