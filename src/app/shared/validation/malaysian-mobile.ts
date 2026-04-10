import { Validators } from '@angular/forms';

/** Malaysian mobile: leading 0, then 9–10 digits (10–11 chars total). */
export const MALAYSIAN_MOBILE_PATTERN = /^0[0-9]{9,10}$/;

/** Use with `FormControl` / `FormGroup` for shared auth or checkout flows. */
export const malaysianMobileValidators = [
  Validators.required,
  Validators.pattern(MALAYSIAN_MOBILE_PATTERN),
] as const;
