import { Component, inject } from '@angular/core';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { APP_BRAND_LOGO_SRC } from '../../../../shared/branding/app-brand-logo';
import { WHATSAPP_HREF } from '../../../../shared/constants/support-urls';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';
import { WhatsappFabComponent } from '../../../../shared/presentation/whatsapp-fab/whatsapp-fab.component';
import { PageChromeComponent } from '../../../../shared/presentation/page-chrome/page-chrome.component';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CachedAssetImgDirective, WhatsappFabComponent, PageChromeComponent],
  templateUrl: './contact-support.component.html',
  styleUrl: './contact-support.component.scss',
})
export class ContactSupportComponent {
  private readonly inAppNav = inject(InAppNavigationHistoryService);

  readonly logoBrandSrc = APP_BRAND_LOGO_SRC;

  readonly whatsappIconSrc = '/assets/contact-support/whatsapp.svg';

  readonly emailIconSrc = '/assets/contact-support/email.svg';

  readonly whatsappHref = WHATSAPP_HREF;

  readonly supportEmail = 'customerservice@policystreet.com';

  readonly mailtoHref = 'mailto:customerservice@policystreet.com';

  goBack(): void {
    this.inAppNav.backOrNavigate(['/home']);
  }
}
