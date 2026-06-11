import { Validators } from '@angular/forms';

/** Malaysian mobile stored format: leading 0, then 9–10 digits (10–11 chars total). */
export const MALAYSIAN_MOBILE_PATTERN = /^0[0-9]{9,10}$/;

/** Digits after `+60` (no leading 0). */
export const MALAYSIAN_MOBILE_LOCAL_PATTERN = /^[0-9]{9,10}$/;

export const MALAYSIA_COUNTRY_DIAL_CODE = '+60';

/** Strip non-digits and leading zeros for display beside `+60`. */
export function malaysianMobileLocalDigits(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/^0+/, '').slice(0, 10);
}

/** Convert local digits (after +60) to stored `0…` format used by auth/API. */
export function toMalaysianMobileStorage(localDigits: string): string {
  const local = malaysianMobileLocalDigits(localDigits);
  return local ? `0${local}` : '';
}

/** Stored `0…` value → digits shown after `+60`. */
export function fromMalaysianMobileStorage(stored: string): string {
  return malaysianMobileLocalDigits(stored);
}

/** Use with `FormControl` / `FormGroup` for shared auth or checkout flows. */
export const malaysianMobileValidators = [
  Validators.required,
  Validators.pattern(MALAYSIAN_MOBILE_PATTERN),
] as const;
