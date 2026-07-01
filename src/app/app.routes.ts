import { Routes } from '@angular/router';

import {
  ROUTE_DATA_CLAIMS_TAB,
  ROUTE_DATA_DOCUMENTS_TAB,
  ROUTE_DATA_HIDDEN,
  ROUTE_DATA_HOME_TAB,
  ROUTE_DATA_POLICIES_TAB,
  ROUTE_DATA_PROFILE_TAB,
} from './shared/routing/app-route-data';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: ROUTE_DATA_HIDDEN,
    loadComponent: () =>
      import('./features/app-entry/gate.component').then((m) => m.GateComponent),
  },
  {
    path: 'onboarding',
    data: ROUTE_DATA_HIDDEN,
    loadComponent: () =>
      import(
        './features/onboarding/presentation/onboarding/onboarding.component'
      ).then((m) => m.OnboardingComponent),
  },
  {
    path: 'login',
    data: ROUTE_DATA_HIDDEN,
    loadComponent: () =>
      import('./features/auth/presentation/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'home',
    data: ROUTE_DATA_HOME_TAB,
    loadComponent: () =>
      import('./features/home/presentation/home/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: 'profile/edit',
    data: { ...ROUTE_DATA_HIDDEN, showChrome: true },
    loadComponent: () =>
      import(
        './features/profile/presentation/profile-edit-details/profile-edit-details.component'
      ).then((m) => m.ProfileEditDetailsComponent),
  },
  {
    path: 'profile',
    data: ROUTE_DATA_PROFILE_TAB,
    loadComponent: () =>
      import('./features/profile/presentation/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  {
    path: 'contact-support',
    data: ROUTE_DATA_HOME_TAB,
    loadComponent: () =>
      import(
        './features/contact-support/presentation/contact-support/contact-support.component'
      ).then((m) => m.ContactSupportComponent),
  },
  {
    path: 'faq',
    data: ROUTE_DATA_PROFILE_TAB,
    loadComponent: () =>
      import('./features/faq/presentation/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'my-vehicles/add',
    data: { ...ROUTE_DATA_HIDDEN, showChrome: true },
    loadComponent: () =>
      import(
        './features/my-vehicles/presentation/add-vehicle/add-vehicle.component'
      ).then((m) => m.AddVehicleComponent),
  },
  {
    path: 'my-vehicles',
    data: { ...ROUTE_DATA_HIDDEN, showChrome: true },
    loadComponent: () =>
      import(
        './features/my-vehicles/presentation/my-vehicles/my-vehicles.component'
      ).then((m) => m.MyVehiclesComponent),
  },
  {
    path: 'policies',
    data: ROUTE_DATA_POLICIES_TAB,
    loadComponent: () =>
      import('./features/policies/presentation/policies/policies.component').then(
        (m) => m.PoliciesComponent,
      ),
  },
  {
    path: 'policies/:id',
    data: { ...ROUTE_DATA_HIDDEN, bottomNavTab: 'policies', showChrome: true },
    loadComponent: () =>
      import(
        './features/policies/presentation/policy-details/policy-details.component'
      ).then((m) => m.PolicyDetailsComponent),
  },
  {
    path: 'claims',
    data: ROUTE_DATA_CLAIMS_TAB,
    loadComponent: () =>
      import('./features/claims/presentation/claims/claims.component').then(
        (m) => m.ClaimsComponent,
      ),
  },
  {
    path: 'notifications',
    data: ROUTE_DATA_HOME_TAB,
    loadComponent: () =>
      import(
        './features/notifications/presentation/notifications/notifications.component'
      ).then((m) => m.NotificationsComponent),
  },
  {
    path: 'documents',
    data: ROUTE_DATA_DOCUMENTS_TAB,
    loadComponent: () =>
      import('./features/documents/presentation/documents/documents.component').then(
        (m) => m.DocumentsComponent,
      ),
  },
  {
    path: 'documents/upload',
    data: ROUTE_DATA_HIDDEN,
    loadComponent: () =>
      import(
        './features/documents/presentation/documents-upload/documents-upload.component'
      ).then((m) => m.DocumentsUploadComponent),
  },
  {
    path: 'quotation',
    data: { ...ROUTE_DATA_HIDDEN, showChrome: true },
    loadComponent: () =>
      import(
        './features/quotation/presentation/quotation-hub/quotation-hub.component'
      ).then((m) => m.QuotationHubComponent),
  },
  {
    path: 'quotation/new',
    data: { ...ROUTE_DATA_HIDDEN, showChrome: true },
    loadComponent: () =>
      import(
        './features/quotation/presentation/quotation-step-two/quotation-step-two.component'
      ).then((m) => m.QuotationStepTwoComponent),
  },
  {
    path: 'quotation/form',
    data: { ...ROUTE_DATA_HIDDEN, showChrome: true },
    loadComponent: () =>
      import(
        './features/quotation/presentation/quotation-request-form/quotation-request-form.component'
      ).then((m) => m.QuotationRequestFormComponent),
  },
  {
    path: 'quotation/preferences',
    data: { ...ROUTE_DATA_HIDDEN, showChrome: true },
    loadComponent: () =>
      import(
        './features/quotation/presentation/quotation-preferences/quotation-preferences.component'
      ).then((m) => m.QuotationPreferencesComponent),
  },
  {
    path: 'quotation/step-2',
    redirectTo: 'quotation/new',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
