import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/app-entry/gate.component').then((m) => m.GateComponent),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import(
        './features/onboarding/presentation/onboarding/onboarding.component'
      ).then((m) => m.OnboardingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/presentation/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/presentation/home/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/presentation/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  {
    path: 'policies',
    loadComponent: () =>
      import('./features/policies/presentation/policies/policies.component').then(
        (m) => m.PoliciesComponent,
      ),
  },
  {
    path: 'claims',
    loadComponent: () =>
      import('./features/claims/presentation/claims/claims.component').then(
        (m) => m.ClaimsComponent,
      ),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import(
        './features/notifications/presentation/notifications/notifications.component'
      ).then((m) => m.NotificationsComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
