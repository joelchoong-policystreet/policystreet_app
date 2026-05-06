import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppBottomNavComponent } from '../../../../shared/presentation/app-bottom-nav/app-bottom-nav.component';
import {
  type AppNotification,
  NOTIFICATIONS_MOCK,
  isCritical,
  isImportant,
  isRead,
  isUnread,
  isUnreadAttentionAccent,
  isUnreadNormalAccent,
  notificationMatchesChip,
  type NotificationCategory,
} from '../../domain/notifications.model';

export type NotificationsChipFilter = NotificationCategory | 'all';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [AppBottomNavComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  constructor(private readonly router: Router) {}

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
  readonly isCritical = isCritical;
  readonly isImportant = isImportant;
  readonly isUnreadNormalAccent = isUnreadNormalAccent;
  readonly isUnreadAttentionAccent = isUnreadAttentionAccent;

  setChip(chip: NotificationsChipFilter): void {
    this.activeChip.set(chip);
  }

  goBack(): void {
    void this.router.navigate(['/home']);
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
