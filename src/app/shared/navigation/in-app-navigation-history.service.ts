import { Location } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Tracks the URL we were on before each completed in-app navigation so header "Back"
 * can use browser history when the user arrived from another screen in this session,
 * and fall back to a section parent route when they landed directly (e.g. deep link).
 */
@Injectable({ providedIn: 'root' })
export class InAppNavigationHistoryService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);

  private priorUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        const next = e.urlAfterRedirects;
        this.priorUrl = this.currentUrl;
        this.currentUrl = next;
      });
  }

  /**
   * Pops browser history when this session already visited another route before the
   * current one; otherwise navigates to the section parent (e.g. `/policies`).
   */
  backOrNavigate(sectionFallback: string[]): void {
    const hasPriorInApp =
      this.priorUrl != null && this.priorUrl.length > 0 && this.priorUrl !== this.currentUrl;

    if (hasPriorInApp) {
      this.location.back();
      return;
    }
    void this.router.navigate(sectionFallback);
  }
}
