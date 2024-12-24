import { cn } from '@/shared/helpers';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function PinInput({
  value,
  onChange,
  error,
  placeholder = '••••••',
  className,
}: PinInputProps) {
  return (
    <div className={className}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
          onChange(value);
        }}
        pattern="\d{6}"
        maxLength={6}
        required
        className={cn(
          "w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg",
          "text-gray-100 text-center text-2xl tracking-widest",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500"
        )}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}