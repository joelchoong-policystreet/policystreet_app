import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CachedAssetImgDirective } from '../../assets/cached-asset-img.directive';

export type BottomNavTab = 'home' | 'policies' | 'claims' | 'profile' | 'none';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './app-bottom-nav.component.html',
  styleUrl: './app-bottom-nav.component.scss',
})
export class AppBottomNavComponent {
  constructor(private readonly router: Router) {}

  @Input() activeTab: BottomNavTab = 'none';

  readonly navIconSrc = {
    home: { default: '/assets/home/nav-home-v2.svg', active: '/assets/home/nav-home-active.svg' },
    policies: { default: '/assets/home/nav-policy-v2.svg', active: '/assets/home/nav-policy-active.svg' },
    claims: { default: '/assets/home/nav-claims-v2.svg', active: '/assets/home/nav-claims-active.svg' },
    profile: { default: '/assets/home/nav-person-v2.svg', active: '/assets/home/nav-person-active.svg' },
  } as const;

  goTo(tab: BottomNavTab): void {
    if (tab === 'none') {
      return;
    }
    const path = tab === 'home' ? '/home' : `/${tab}`;
    void this.router.navigate([path]);
  }

  goToQuote(): void {
    void this.router.navigate(['/quotation']);
  }
}
