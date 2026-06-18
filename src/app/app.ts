import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AppBottomNavComponent, type BottomNavTab } from './shared/presentation/app-bottom-nav/app-bottom-nav.component';
import { AppSideNavComponent } from './shared/presentation/app-side-nav/app-side-nav.component';
import { CachedAssetImgDirective } from './shared/assets/cached-asset-img.directive';
import { ShellHeaderStore } from './shared/presentation/shell-header/shell-header.store';
import { readAppRouteData } from './shared/routing/read-app-route-data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppBottomNavComponent, AppSideNavComponent, CachedAssetImgDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private navSub?: Subscription;
  private readonly shellHeader = inject(ShellHeaderStore);
  readonly header = this.shellHeader.header;
  currentPath = '';
  private showBottomNavFlag = false;
  private showChromeFlag = false;
  private activeTab: BottomNavTab = 'none';

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.syncRouteShell(this.router.url);
    this.navSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.syncRouteShell(event.urlAfterRedirects);
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

  private syncRouteShell(url: string): void {
    this.currentPath = url;
    const routeData = readAppRouteData(this.router);
    this.showBottomNavFlag = routeData.showBottomNav === true;
    this.showChromeFlag = routeData.showChrome ?? routeData.showBottomNav === true;
    this.activeTab = routeData.bottomNavTab ?? 'none';
  }

  shouldShowBottomNav(): boolean {
    return this.showBottomNavFlag;
  }

  /**
   * Desktop sidebar + top bar follow the bottom-nav routes by default, plus any route
   * that opts in via `showChrome` (e.g. detail pages that hide the mobile bottom nav).
   */
  shouldShowChrome(): boolean {
    return this.showChromeFlag;
  }

  activeBottomTab(): BottomNavTab {
    return this.activeTab;
  }

  goProfile(): void {
    void this.router.navigate(['/profile']);
  }
}
