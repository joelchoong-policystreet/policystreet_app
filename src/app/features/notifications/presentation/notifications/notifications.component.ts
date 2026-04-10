import { Component, signal } from '@angular/core';
import { AppBottomNavComponent } from '../../../../shared/presentation/app-bottom-nav/app-bottom-nav.component';

type NotificationChip = 'all' | 'billing' | 'campaigns' | 'reminders';

type NotificationItem = {
  title: string;
  body: string;
  unread: boolean;
};

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [AppBottomNavComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  readonly activeChip = signal<NotificationChip>('all');

  readonly notifications: ReadonlyArray<NotificationItem> = [
    { title: 'Payment received successfully', body: "We've received your payment of RM128.00 for #PS146..", unread: true },
    { title: 'Your policy renews next week', body: 'Policy #MC-11823 is due for renewal on 14 Apr 2026...', unread: true },
    { title: 'Renew now and save 10%', body: 'Complete your policy renewal before 12 Apr 2026 to...', unread: false },
    { title: 'Premium payment due in 3 days', body: 'Your next premium payment of RM89.00 is due on 10 Apr...', unread: false },
    { title: 'Your policy expires next week', body: 'Policy #MC-11823 is due on 14 Apr 2026. Rev...', unread: false },
    { title: 'Invite friends and earn rewards', body: "Refer a friend to buy a policy and you'll both receive exclu...", unread: false },
    { title: 'Raya travel protection at special rates', body: 'Planning a trip? Get insured with limited-time travel cove...', unread: false },
    { title: 'Payment received successfully', body: "We've received your payment of RM128.00 for #PS632...", unread: false },
  ];

  setChip(chip: NotificationChip): void {
    this.activeChip.set(chip);
  }
}

