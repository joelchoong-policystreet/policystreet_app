import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { APP_BRAND_LOGO_SRC } from '../../../../shared/branding/app-brand-logo';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss',
})
export class ClaimsComponent implements OnInit, OnDestroy {
  constructor(private readonly inAppNav: InAppNavigationHistoryService) {}

  readonly logoBrandSrc = APP_BRAND_LOGO_SRC;
  readonly mainIllustrationSrc = '/assets/claims/coming-soon.svg';
  readonly rotatingIcons = [
    '/assets/claims/coming-soon-1.svg',
    '/assets/claims/coming-soon-2.svg',
    '/assets/claims/coming-soon-3.svg',
  ] as const;
  readonly activeIconIndex = signal(0);

  private illustrationTimer: ReturnType<typeof setInterval> | null = null;

  get activeIconSrc(): string {
    return this.rotatingIcons[this.activeIconIndex()] ?? this.rotatingIcons[0];
  }

  get secondaryIconSrc(): string {
    return this.rotatingIcons[(this.activeIconIndex() + 1) % this.rotatingIcons.length] ?? this.rotatingIcons[0];
  }

  ngOnInit(): void {
    this.illustrationTimer = setInterval(() => {
      this.activeIconIndex.update((current) => (current + 1) % this.rotatingIcons.length);
    }, 2200);
  }

  ngOnDestroy(): void {
    if (this.illustrationTimer) {
      clearInterval(this.illustrationTimer);
      this.illustrationTimer = null;
    }
  }

  goBack(): void {
    this.inAppNav.backOrNavigate(['/home']);
  }
}

