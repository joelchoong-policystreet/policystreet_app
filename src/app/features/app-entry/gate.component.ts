import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_SESSION_STORAGE } from '../auth/domain/auth-session.storage.token';
import { ONBOARDING_STORAGE } from '../onboarding/domain/onboarding-storage.token';

/**
 * Default route: onboarding for first-time users; home when remembered auth session
 * is valid; otherwise login.
 */
@Component({
  selector: 'app-gate',
  standalone: true,
  template: '',
})
export class GateComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly onboardingStorage = inject(ONBOARDING_STORAGE);
  private readonly authSession = inject(AUTH_SESSION_STORAGE);

  ngOnInit(): void {
    if (!this.onboardingStorage.isComplete()) {
      void this.router.navigate(['/onboarding'], { replaceUrl: true });
      return;
    }

    const target = this.authSession.isAuthenticated() ? '/home' : '/login';
    void this.router.navigate([target], { replaceUrl: true });
  }
}
