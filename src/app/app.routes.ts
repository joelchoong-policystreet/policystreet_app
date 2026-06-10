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
    path: 'profile/edit',
    loadComponent: () =>
      import(
        './features/profile/presentation/profile-edit-details/profile-edit-details.component'
      ).then((m) => m.ProfileEditDetailsComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/presentation/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  {
    path: 'contact-support',
    loadComponent: () =>
      import(
        './features/contact-support/presentation/contact-support/contact-support.component'
      ).then((m) => m.ContactSupportComponent),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./features/faq/presentation/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'my-vehicles/add',
    loadComponent: () =>
      import(
        './features/my-vehicles/presentation/add-vehicle/add-vehicle.component'
      ).then((m) => m.AddVehicleComponent),
  },
  {
    path: 'my-vehicles',
    loadComponent: () =>
      import(
        './features/my-vehicles/presentation/my-vehicles/my-vehicles.component'
      ).then((m) => m.MyVehiclesComponent),
  },
  {
    path: 'policies',
    loadComponent: () =>
      import('./features/policies/presentation/policies/policies.component').then(
        (m) => m.PoliciesComponent,
      ),
  },
  {
    path: 'policies/:id',
    loadComponent: () =>
      import(
        './features/policies/presentation/policy-details/policy-details.component'
      ).then((m) => m.PolicyDetailsComponent),
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
  {
    path: 'documents',
    loadComponent: () =>
      import('./features/documents/presentation/documents/documents.component').then(
        (m) => m.DocumentsComponent,
      ),
  },
  {
    path: 'documents/upload',
    loadComponent: () =>
      import(
        './features/documents/presentation/documents-upload/documents-upload.component'
      ).then((m) => m.DocumentsUploadComponent),
  },
  {
    path: 'quotation',
    loadComponent: () =>
      import(
        './features/quotation/presentation/quotation-hub/quotation-hub.component'
      ).then((m) => m.QuotationHubComponent),
  },
  {
    path: 'quotation/new',
    loadComponent: () =>
      import(
        './features/quotation/presentation/quotation-step-two/quotation-step-two.component'
      ).then((m) => m.QuotationStepTwoComponent),
  },
  {
    path: 'quotation/form',
    loadComponent: () =>
      import(
        './features/quotation/presentation/quotation-request-form/quotation-request-form.component'
      ).then((m) => m.QuotationRequestFormComponent),
  },
  {
    path: 'quotation/preferences',
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
