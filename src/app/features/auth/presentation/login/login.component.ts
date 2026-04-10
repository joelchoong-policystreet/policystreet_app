import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AUTH_REPOSITORY } from '../../domain/auth-repository.token';
import { malaysianMobileValidators } from '../../../../shared/validation/malaysian-mobile';
import {
  OTP_DIGIT_COUNT,
  applyOtpCellInput,
  otpDigitsFromClipboard,
} from '../../../../shared/otp/otp-six-digit';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly auth = inject(AUTH_REPOSITORY);

  private resendIntervalId: ReturnType<typeof setInterval> | null = null;

  readonly step = signal<'phone' | 'otp'>('phone');

  readonly mobile = new FormControl('', {
    nonNullable: true,
    validators: [...malaysianMobileValidators],
  });

  private readonly mobileValue = toSignal(this.mobile.valueChanges, {
    initialValue: this.mobile.value,
  });

  readonly canSendOtp = computed(() => {
    this.mobileValue();
    return this.mobile.valid;
  });

  readonly submitting = signal(false);
  readonly loggingIn = signal(false);

  readonly otpCode = signal('');

  private readonly otpInputs = viewChildren<ElementRef<HTMLInputElement>>('otpIn');

  readonly canLogin = computed(() => this.otpCode().length === OTP_DIGIT_COUNT);

  readonly resendSeconds = signal(0);

  readonly canResend = computed(() => this.resendSeconds() === 0);

  readonly otpError = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.clearResendTimer());

    effect(() => {
      this.otpCode();
      this.otpError.set(false);
    });
  }

  onPhoneFormSubmit(event: Event): void {
    event.preventDefault();
    this.sendOtp();
  }

  sendOtp(): void {
    if (!this.mobile.valid) {
      this.mobile.markAsTouched();
      return;
    }
    this.submitting.set(true);
    this.auth.sendOtp(this.mobile.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.step.set('otp');
        this.otpCode.set('');
        this.startResendCountdown();
        queueMicrotask(() => this.focusOtpIndex(0));
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }

  loginWithOtp(): void {
    if (!this.canLogin() || this.loggingIn()) {
      return;
    }
    this.loggingIn.set(true);
    this.auth.verifyOtp(this.mobile.value, this.otpCode()).subscribe({
      next: () => {
        this.loggingIn.set(false);
        void this.router.navigate(['/home']);
      },
      error: () => {
        this.loggingIn.set(false);
        this.otpError.set(true);
      },
    });
  }

  useDifferentNumber(): void {
    this.step.set('phone');
    this.otpCode.set('');
    this.clearResendTimer();
    this.resendSeconds.set(0);
  }

  resendOtp(): void {
    if (!this.canResend() || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    this.auth.resendOtp(this.mobile.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.otpCode.set('');
        this.startResendCountdown();
        queueMicrotask(() => this.focusOtpIndex(0));
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = otpDigitsFromClipboard(text);
    this.otpCode.set(digits);
    const nextFocus = digits.length >= OTP_DIGIT_COUNT ? OTP_DIGIT_COUNT - 1 : digits.length;
    queueMicrotask(() => this.focusOtpIndex(nextFocus));
  }

  onOtpCellInput(index: number, event: Event): void {
    const el = event.target as HTMLInputElement;
    const { code, focusIndex } = applyOtpCellInput(this.otpCode(), index, el.value);
    this.otpCode.set(code);
    if (focusIndex !== undefined) {
      queueMicrotask(() => this.focusOtpIndex(focusIndex));
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    const code = this.otpCode();

    if (event.key === 'Backspace') {
      if (code[index]) {
        return;
      }
      if (index > 0) {
        event.preventDefault();
        const next = code.slice(0, index - 1) + code.slice(index);
        this.otpCode.set(next);
        queueMicrotask(() => this.focusOtpIndex(index - 1));
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusOtpIndex(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < OTP_DIGIT_COUNT - 1) {
      event.preventDefault();
      this.focusOtpIndex(index + 1);
    }
  }

  onOtpRowPointerDown(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('input')) {
      return;
    }
    event.preventDefault();
    const code = this.otpCode();
    const idx = code.length >= OTP_DIGIT_COUNT ? OTP_DIGIT_COUNT - 1 : code.length;
    this.focusOtpIndex(idx);
  }

  otpCharAt(index: number): string {
    return this.otpCode()[index] ?? '';
  }

  private focusOtpIndex(index: number): void {
    const list = this.otpInputs();
    const safe = Math.max(0, Math.min(OTP_DIGIT_COUNT - 1, index));
    const ref = list[safe];
    ref?.nativeElement.focus();
    ref?.nativeElement.select();
  }

  private startResendCountdown(): void {
    this.clearResendTimer();
    this.resendSeconds.set(60);
    this.resendIntervalId = setInterval(() => {
      const s = this.resendSeconds();
      if (s <= 1) {
        this.resendSeconds.set(0);
        this.clearResendTimer();
      } else {
        this.resendSeconds.update((v) => v - 1);
      }
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.resendIntervalId !== null) {
      clearInterval(this.resendIntervalId);
      this.resendIntervalId = null;
    }
  }
}
