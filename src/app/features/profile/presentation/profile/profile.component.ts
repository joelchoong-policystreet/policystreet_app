import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { APP_BRAND_LOGO_SRC } from '../../../../shared/branding/app-brand-logo';
import { WhatsappFabComponent } from '../../../../shared/presentation/whatsapp-fab/whatsapp-fab.component';
import { AUTH_SESSION_STORAGE } from '../../../auth/domain/auth-session.storage.token';
import { SAMPLE_USER } from '../../../home/domain/sample-user';

type ProfileMenuRow = {
  id: string;
  label: string;
  iconSrc: string;
  trailing?: 'chevron' | 'value';
  value?: string;
};

type ProfileMenuSection = {
  title: string;
  items: ReadonlyArray<ProfileMenuRow>;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CachedAssetImgDirective, WhatsappFabComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly router = inject(Router);
  private readonly authSession = inject(AUTH_SESSION_STORAGE);

  readonly logoBrandSrc = APP_BRAND_LOGO_SRC;
  readonly avatarSrc = '/assets/profile/profile-avatar.svg';
  readonly user = SAMPLE_USER;

  readonly menuSections: ReadonlyArray<ProfileMenuSection> = [
    {
      title: 'SETTINGS',
      items: [
        {
          id: 'language',
          label: 'Language',
          iconSrc: '/assets/profile/menu-language.svg',
          trailing: 'value',
          value: 'English',
        },
      ],
    },
    {
      title: 'HELP & SUPPORT',
      items: [
        {
          id: 'contact-support',
          label: 'Contact Support',
          iconSrc: '/assets/profile/menu-contact-support.svg',
          trailing: 'chevron',
        },
        {
          id: 'faq',
          label: 'FAQ',
          iconSrc: '/assets/profile/menu-faq.svg',
          trailing: 'chevron',
        },
      ],
    },
  ];

  onEditDetails(): void {
    void this.router.navigate(['/profile/edit']);
  }

  onMenuItemClick(itemId: string): void {
    if (itemId === 'contact-support') {
      void this.router.navigate(['/contact-support']);
      return;
    }
    if (itemId === 'faq') {
      void this.router.navigate(['/faq']);
      return;
    }
    if (itemId === 'language') {
      return;
    }
  }

  onLogout(): void {
    this.authSession.clearSession();
    void this.router.navigate(['/login']);
  }
}
