import { Component } from '@angular/core';


type ProfileMenuSection = {
  title: string;
  items: ReadonlyArray<string>;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly logoBrandSrc = '/assets/home/PS Car Insurance Logo.svg';
  readonly avatarSrc = '/assets/profile/profile-avatar.svg';
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

}
