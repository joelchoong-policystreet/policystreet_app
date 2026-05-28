import { Component, inject } from '@angular/core';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { APP_BRAND_LOGO_SRC } from '../../../../shared/branding/app-brand-logo';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './contact-support.component.html',
  styleUrl: './contact-support.component.scss',
})
export class ContactSupportComponent {
  private readonly inAppNav = inject(InAppNavigationHistoryService);

  readonly logoBrandSrc = APP_BRAND_LOGO_SRC;

  /** WhatsApp (WA messages only); digits only after wa.me/. */
  readonly whatsappHref = 'https://wa.me/60182822320';

  readonly supportEmail = 'customerservice@policystreet.com';

  readonly mailtoHref = 'mailto:customerservice@policystreet.com';

  goBack(): void {
    this.inAppNav.backOrNavigate(['/home']);
  }
}
