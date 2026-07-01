/** WhatsApp deep link — digits only after wa.me/. */
export const WHATSAPP_HREF = 'https://wa.me/60182822320';

export const SUPPORT_EMAIL = 'support@policystreet.com';

export function supportMailtoHref(subject?: string): string {
  if (!subject) {
    return `mailto:${SUPPORT_EMAIL}`;
  }
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
