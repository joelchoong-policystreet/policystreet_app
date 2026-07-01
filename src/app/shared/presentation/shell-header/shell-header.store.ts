import { Injectable, signal } from '@angular/core';

/** Optional trailing action rendered in the desktop header bar (e.g. "Renew Now"). */
export interface ShellHeaderAction {
  label: string;
  disabled?: boolean;
  handler: () => void;
}

/**
 * Page-supplied header content for the desktop shell top bar. Routed pages publish
 * this so their title / back button / primary action share the same bar as the
 * profile avatar instead of stacking a second header below it.
 */
export interface ShellHeaderConfig {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  action?: ShellHeaderAction;
}

@Injectable({ providedIn: 'root' })
export class ShellHeaderStore {
  readonly header = signal<ShellHeaderConfig | null>(null);

  set(config: ShellHeaderConfig): void {
    this.header.set(config);
  }

  clear(): void {
    this.header.set(null);
  }
}
