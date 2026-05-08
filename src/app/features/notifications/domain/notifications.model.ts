export type NotificationCategory = 'billing' | 'campaigns' | 'reminders';

export type NotificationImportance = 'normal' | 'important' | 'critical';

export type AppNotification = {
  id: string;
  title: string;
  /** Supports line breaks (\n); rendered with `white-space: pre-line`. */
  body: string;
  read: boolean;
  importance: NotificationImportance;
  category: NotificationCategory;
};

export function isUnread(n: AppNotification): boolean {
  return !n.read;
}

export function isRead(n: AppNotification): boolean {
  return n.read;
}

export function isCritical(n: AppNotification): boolean {
  return n.importance === 'critical';
}

export function isImportant(n: AppNotification): boolean {
  return n.importance === 'important';
}

/** All unread/new items use the same pale blue accent state. */
export function isUnreadNormalAccent(n: AppNotification): boolean {
  return isUnread(n);
}

/** Unread items that need attention — pale red band in Figma. */
export function isUnreadAttentionAccent(n: AppNotification): boolean {
  return isUnread(n) && (isCritical(n) || isImportant(n));
}

export function notificationMatchesChip(n: AppNotification, chip: NotificationCategory | 'all'): boolean {
  if (chip === 'all') {
    return true;
  }
  return n.category === chip;
}

/** Mock inbox aligned with Consumer Car Insurance – Notifications frame. */
export const NOTIFICATIONS_MOCK: ReadonlyArray<AppNotification> = [
  {
    id: 'n1',
    title: 'Payment received successfully',
    body: "We've received your payment of RM128.00\nfor #PS146123",
    read: false,
    importance: 'normal',
    category: 'billing',
  },
  {
    id: 'n2',
    title: 'Your policy renews next week',
    body: 'Policy #MC-11823 is due for renewal on\n14 Apr 2026',
    read: false,
    importance: 'critical',
    category: 'reminders',
  },
  {
    id: 'n3',
    title: 'Renew now and save 10%',
    body: 'Complete your policy renewal before\n12 Apr 2026',
    read: true,
    importance: 'normal',
    category: 'campaigns',
  },
  {
    id: 'n4',
    title: 'Premium payment due in 3 days',
    body: 'Your next premium payment of RM89.00\nis due on 10 Apr 2026',
    read: true,
    importance: 'normal',
    category: 'billing',
  },
  {
    id: 'n5',
    title: 'Your policy expires next week',
    body: 'Policy #MC-11823 is due for renewal on\n14 Apr 2026.',
    read: true,
    importance: 'important',
    category: 'reminders',
  },
  {
    id: 'n6',
    title: 'Invite friends and earn rewards',
    body: "Refer a friend to buy a policy and you'll both\nreceive exclusive rewards.",
    read: true,
    importance: 'normal',
    category: 'campaigns',
  },
  {
    id: 'n7',
    title: 'Raya travel protection at special rates',
    body: 'Planning a trip? Get insured with limited-time\ntravel coverage',
    read: true,
    importance: 'normal',
    category: 'campaigns',
  },
  {
    id: 'n8',
    title: 'Payment received successfully',
    body: "We've received your payment of RM128.00\nfor #PS632123",
    read: true,
    importance: 'normal',
    category: 'billing',
  },
];
