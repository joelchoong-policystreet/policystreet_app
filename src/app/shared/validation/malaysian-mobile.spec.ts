import { FormControl } from '@angular/forms';

import {
  MALAYSIAN_MOBILE_PATTERN,
  fromMalaysianMobileStorage,
  malaysianMobileLocalDigits,
  malaysianMobileValidators,
  toMalaysianMobileStorage,
} from './malaysian-mobile';

describe('malaysian-mobile', () => {
  it('accepts 10- and 11-digit numbers starting with 0', () => {
    expect(MALAYSIAN_MOBILE_PATTERN.test('0123456789')).toBeTrue();
    expect(MALAYSIAN_MOBILE_PATTERN.test('01234567890')).toBeTrue();
  });

  it('rejects numbers without leading 0 or wrong length', () => {
    expect(MALAYSIAN_MOBILE_PATTERN.test('60123456789')).toBeFalse();
    expect(MALAYSIAN_MOBILE_PATTERN.test('012345678')).toBeFalse();
    expect(MALAYSIAN_MOBILE_PATTERN.test('012345678901')).toBeFalse();
    expect(MALAYSIAN_MOBILE_PATTERN.test('')).toBeFalse();
  });

  it('normalizes local digits and storage format', () => {
    expect(malaysianMobileLocalDigits('0123456789')).toBe('123456789');
    expect(toMalaysianMobileStorage('123456789')).toBe('0123456789');
    expect(fromMalaysianMobileStorage('0123456789')).toBe('123456789');
  });

  it('malaysianMobileValidators require a valid pattern', () => {
    const control = new FormControl('', { validators: [...malaysianMobileValidators] });

    control.setValue('');
    expect(control.valid).toBeFalse();

    control.setValue('0123456789');
    expect(control.valid).toBeTrue();

    control.setValue('1123456789');
    expect(control.valid).toBeFalse();
  });
});
