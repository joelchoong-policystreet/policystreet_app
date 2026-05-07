import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppBottomNavComponent } from '../../../../shared/presentation/app-bottom-nav/app-bottom-nav.component';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [AppBottomNavComponent],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss',
})
export class ClaimsComponent implements OnInit, OnDestroy {
  constructor(private readonly router: Router) {}

  readonly logoBrandSrc = '/assets/home/PS Car Insurance Logo.svg';
  readonly hasUnreadNotifications = signal(true);
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

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }

  goHome(): void {
    void this.router.navigate(['/home']);
  }
}

