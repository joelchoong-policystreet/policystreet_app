/** Shared 6-digit OTP helpers (paste, per-cell input). Presentation layers orchestrate focus. */

export const OTP_DIGIT_COUNT = 6;

export function otpDigitsFromClipboard(text: string): string {
  return text.replace(/\D/g, '').slice(0, OTP_DIGIT_COUNT);
}

export interface OtpCellInputResult {
  code: string;
  /** Focus this box after update (0–5). Omit to leave focus handling to the caller. */
  focusIndex?: number;
}

/**
 * Applies one editing step to the OTP string for a single cell (paste-in-cell, typing, delete).
 */
export function applyOtpCellInput(
  code: string,
  index: number,
  rawInput: string,
): OtpCellInputResult {
  const incoming = rawInput.replace(/\D/g, '');

  if (incoming.length === 0) {
    return {
      code: code.slice(0, index) + code.slice(index + 1),
    };
  }

  if (incoming.length > 1) {
    const merged = (code.slice(0, index) + incoming).replace(/\D/g, '').slice(0, OTP_DIGIT_COUNT);
    return {
      code: merged,
      focusIndex: Math.min(index + incoming.length, OTP_DIGIT_COUNT - 1),
    };
  }

  const next = (code.slice(0, index) + incoming + code.slice(index + 1))
    .replace(/\D/g, '')
    .slice(0, OTP_DIGIT_COUNT);

  if (incoming && index < OTP_DIGIT_COUNT - 1) {
    return { code: next, focusIndex: index + 1 };
  }

  return { code: next };
}
