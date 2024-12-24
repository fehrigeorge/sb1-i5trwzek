import { useAuth } from '@/lib/auth';
import { Avatar } from '../ui/avatar';
import { cn } from '@/shared/helpers';

interface UserAvatarProps {
  className?: string;
}

export function UserAvatar({ className }: UserAvatarProps) {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <Avatar
      src={user.avatarUrl}
      fallback={user.email[0].toUpperCase()}
      className={cn("w-10 h-10", className)}
    />
  );
}