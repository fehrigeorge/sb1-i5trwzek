export interface PinProtectionState {
  isProtected: boolean;
  isVerified: boolean;
  remainingAttempts: number;
  error: string | null;
  checkProtection: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  removePin: () => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
}