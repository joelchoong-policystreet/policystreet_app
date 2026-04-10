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
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
