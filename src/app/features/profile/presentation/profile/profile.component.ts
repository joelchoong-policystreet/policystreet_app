import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppBottomNavComponent } from '../../../../shared/presentation/app-bottom-nav/app-bottom-nav.component';

type ProfileMenuSection = {
  title: string;
  items: ReadonlyArray<string>;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AppBottomNavComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(private readonly router: Router) {}

  readonly hasUnreadNotifications = signal(true);

  readonly logoWordmarkWhiteSrc = '/assets/home/logo_wordmark-white.png';
  readonly sections: ReadonlyArray<ProfileMenuSection> = [
    {
      title: 'ACCOUNT',
      items: ['Personal Information', 'Driver Details', 'Saved Vehicles', 'Linked Family Members', 'Switch Accounts'],
    },
    {
      title: 'PAYMENTS & BILLINGS',
      items: ['Payment Methods', 'Address Book', 'Billing History'],
    },
    {
      title: 'SECURITY',
      items: ['Change Password', 'Language'],
    },
    {
      title: 'SUPPORT',
      items: ['Help', 'FAQ', 'Report an Incident', 'Claim Documents Upload'],
    },
  ];

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }
}

