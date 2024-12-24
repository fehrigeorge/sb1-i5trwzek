import { cn } from '@/shared/helpers';

interface AvatarProps {
  src?: string | null;
  fallback?: string;
  className?: string;
}

export function Avatar({ src, fallback, className }: AvatarProps) {
  return (
    <div className={cn(
      "relative inline-block rounded-full overflow-hidden bg-gray-800",
      className
    )}>
      {src ? (
        <img 
          src={src} 
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      ) : fallback ? (
        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
          {fallback}
        </div>
      ) : null}
    </div>
  );
}