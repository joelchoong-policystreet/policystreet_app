import { Component, computed, signal } from '@angular/core';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';
import {
  type AppNotification,
  NOTIFICATIONS_MOCK,
  isRead,
  isUnread,
  isUnreadNormalAccent,
  notificationMatchesChip,
  type NotificationCategory,
} from '../../domain/notifications.model';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';

export type NotificationsChipFilter = NotificationCategory | 'all';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  constructor(private readonly inAppNav: InAppNavigationHistoryService) {}

  readonly logoBrandSrc = '/assets/home/PS Car Insurance Logo.svg';

  readonly activeChip = signal<NotificationsChipFilter>('all');

  /** Live list for mock interactions (e.g. mark as read). */
  readonly notificationsState = signal<AppNotification[]>([...NOTIFICATIONS_MOCK]);

  readonly filteredNotifications = computed(() => {
    const chip = this.activeChip();
    return this.notificationsState().filter((n) => notificationMatchesChip(n, chip));
  });

  readonly isUnread = isUnread;
  readonly isRead = isRead;
  readonly isUnreadNormalAccent = isUnreadNormalAccent;

  setChip(chip: NotificationsChipFilter): void {
    this.activeChip.set(chip);
  }

  goBack(): void {
    this.inAppNav.backOrNavigate(['/home']);
  }

  /** Tap row to clear unread dot / band (mock behaviour). */
  markAsRead(n: AppNotification): void {
    if (n.read) {
      return;
    }
    this.notificationsState.update((items) =>
      items.map((item) => (item.id === n.id ? { ...item, read: true } : item)),
    );
  }
}
