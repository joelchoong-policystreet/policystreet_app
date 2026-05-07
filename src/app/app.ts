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

  shouldShowBottomNav(): boolean {
    return (
      this.currentPath.startsWith('/home') ||
      this.currentPath.startsWith('/policies') ||
      this.currentPath.startsWith('/claims') ||
      this.currentPath.startsWith('/profile') ||
      this.currentPath.startsWith('/documents') ||
      this.currentPath.startsWith('/notifications') ||
      this.currentPath.startsWith('/quotation')
    );
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
