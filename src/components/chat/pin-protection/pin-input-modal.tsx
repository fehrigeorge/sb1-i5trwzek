import { useState } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/shared/helpers';
import { GlassModal } from '@/components/ui/glass-modal';
import { OTPInput } from '@/components/ui/otp-input/otp-input';

interface PinInputModalProps {
  title: string;
  onSubmit: (pin: string) => Promise<void>;
  onCancel: () => void;
  error?: string;
  remainingAttempts?: number;
  confirmPin?: boolean;
}

export function PinInputModal({
  title,
  onSubmit,
  onCancel,
  error,
  remainingAttempts,
  confirmPin = false,
}: PinInputModalProps) {
  const [pin, setPin] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (confirmPin && pin !== confirmPinValue) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(pin);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassModal
      title={title}
      icon={<div className="p-2 rounded-lg bg-gray-800/50"><Lock className="w-5 h-5 text-blue-400" /></div>}
      onClose={onCancel}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Enter PIN Code
            </label>
            <OTPInput
              value={pin}
              onChange={setPin}
              error={Boolean(error)}
              disabled={isSubmitting}
              className="justify-center"
            />
          </div>

          {confirmPin && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Confirm PIN Code
              </label>
              <OTPInput
                value={confirmPinValue}
                onChange={setConfirmPinValue}
                error={confirmPinValue.length > 0 && pin !== confirmPinValue}
                disabled={isSubmitting}
                className="justify-center"
              />
              {confirmPinValue.length > 0 && pin !== confirmPinValue && (
                <p className="text-sm text-red-400 text-center mt-2">
                  PINs do not match
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-400 text-center">
              {error}
              {remainingAttempts !== undefined && (
                <span className="block mt-1">
                  {remainingAttempts} attempts remaining
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm rounded-lg text-gray-400 hover:bg-gray-800/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting || 
              pin.length !== 6 || 
              (confirmPin && (confirmPinValue.length !== 6 || pin !== confirmPinValue))
            }
            className={cn(
              "flex-1 px-4 py-2 text-sm rounded-lg transition-colors",
              "bg-blue-600 text-white hover:bg-blue-700",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Processing..." : "Submit"}
          </button>
        </div>
      </form>
    </GlassModal>
  );
}
