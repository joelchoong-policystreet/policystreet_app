import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import type { AuthRepository } from '../domain/auth.repository';

/** Demo OTP: `123456` succeeds; replace with real HTTP when APIs are ready. */
@Injectable()
export class AuthRepositoryStub implements AuthRepository {
  sendOtp(_mobile: string): Observable<void> {
    return timer(800).pipe(map(() => void 0));
  }

  verifyOtp(_mobile: string, otp: string): Observable<void> {
    return timer(800).pipe(
      mergeMap(() =>
        otp === '123456' ? of(undefined) : throwError(() => new Error('Invalid code')),
      ),
    );
  }

  resendOtp(_mobile: string): Observable<void> {
    return timer(600).pipe(map(() => void 0));
  }
}
