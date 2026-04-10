import { Observable } from 'rxjs';

/**
 * Port for authentication over SMS OTP. Data layer provides HTTP (or stub) implementations.
 */
export interface AuthRepository {
  sendOtp(mobile: string): Observable<void>;
  verifyOtp(mobile: string, otp: string): Observable<void>;
  resendOtp(mobile: string): Observable<void>;
}
