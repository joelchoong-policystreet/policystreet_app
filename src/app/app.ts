import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AppBottomNavComponent, type BottomNavTab } from './shared/presentation/app-bottom-nav/app-bottom-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppBottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private navSub?: Subscription;
  currentPath = '';

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.navSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentPath = event.urlAfterRedirects;
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        });
      });
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  /**
   * Bottom nav only on main tab surfaces. Hidden on nested flows: policy details,
   * quotation (all steps), documents upload, etc.
   */
  shouldShowBottomNav(): boolean {
    const p = this.pathnameWithoutQuery(this.currentPath);

    if (p === '/home' || p.startsWith('/home/')) {
      return true;
    }
    if (p === '/policies') {
      return true;
    }
    if (p.startsWith('/policies/')) {
      return false;
    }
    if (p === '/claims' || p.startsWith('/claims/')) {
      return true;
    }
    if (p === '/profile' || p.startsWith('/profile/')) {
      return true;
    }
    if (p === '/documents') {
      return true;
    }
    if (p.startsWith('/documents/')) {
      return false;
    }
    if (p === '/notifications' || p.startsWith('/notifications/')) {
      return true;
    }
    if (p.startsWith('/quotation')) {
      return false;
    }
    return false;
  }

  private pathnameWithoutQuery(url: string): string {
    const q = url.indexOf('?');
    const path = q === -1 ? url : url.slice(0, q);
    const h = path.indexOf('#');
    return h === -1 ? path : path.slice(0, h);
  }

  activeBottomTab(): BottomNavTab {
    if (this.currentPath.startsWith('/policies')) {
      return 'policies';
    }
    if (this.currentPath.startsWith('/claims')) {
      return 'claims';
    }
    if (this.currentPath.startsWith('/profile')) {
      return 'profile';
    }
    if (this.currentPath.startsWith('/documents')) {
      return 'none';
    }
    if (this.currentPath.startsWith('/quotation')) {
      return 'none';
    }
    if (this.currentPath.startsWith('/home') || this.currentPath.startsWith('/notifications')) {
      return 'home';
    }
    return 'none';
  }
}
