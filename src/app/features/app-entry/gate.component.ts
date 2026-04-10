import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ONBOARDING_STORAGE } from '../onboarding/domain/onboarding-storage.token';

/**
 * Default route: sends first-time users to onboarding, returning users to login.
 */
@Component({
  selector: 'app-gate',
  standalone: true,
  template: '',
})
export class GateComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly onboardingStorage = inject(ONBOARDING_STORAGE);

  ngOnInit(): void {
    const target = this.onboardingStorage.isComplete() ? '/login' : '/onboarding';
    void this.router.navigate([target], { replaceUrl: true });
  }
}
