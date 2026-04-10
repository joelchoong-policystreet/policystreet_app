import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

export type BottomNavTab = 'home' | 'policies' | 'claims' | 'profile';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  templateUrl: './app-bottom-nav.component.html',
  styleUrl: './app-bottom-nav.component.scss',
})
export class AppBottomNavComponent {
  constructor(private readonly router: Router) {}

  @Input() activeTab: BottomNavTab = 'home';

  readonly navIconSrc = {
    home: { default: '/assets/home/nav-home.svg', active: '/assets/home/nav-home-active.svg' },
    policies: { default: '/assets/home/nav-policy.svg', active: '/assets/home/nav-policy-active.svg' },
    claims: { default: '/assets/home/nav-claims.svg', active: '/assets/home/nav-claims-active.svg' },
    profile: { default: '/assets/home/nav-person.svg', active: '/assets/home/nav-person-active.svg' },
  } as const;

  goTo(tab: BottomNavTab): void {
    const path = tab === 'home' ? '/home' : `/${tab}`;
    void this.router.navigate([path]);
  }
}

