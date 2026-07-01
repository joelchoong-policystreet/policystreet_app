import { Component, input } from '@angular/core';
import { WHATSAPP_HREF } from '../../constants/support-urls';

export type WhatsappFabPosition = 'bottom-nav' | 'quotation-form' | 'quotation-prefs';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  templateUrl: './whatsapp-fab.component.html',
  styleUrl: './whatsapp-fab.component.scss',
  host: {
    '[class.whatsapp-fab--bottom-nav]': 'position() === "bottom-nav"',
    '[class.whatsapp-fab--quotation-form]': 'position() === "quotation-form"',
    '[class.whatsapp-fab--quotation-prefs]': 'position() === "quotation-prefs"',
  },
})
export class WhatsappFabComponent {
  readonly href = WHATSAPP_HREF;

  /** Where the FAB sits above fixed chrome (bottom nav vs quotation footer stack). */
  readonly position = input<WhatsappFabPosition>('bottom-nav');
}
