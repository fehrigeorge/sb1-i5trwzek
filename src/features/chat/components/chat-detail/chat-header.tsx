import { Avatar } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/helpers';
import type { Participant } from '../../types';

interface ChatHeaderProps {
  participant: Participant;
  className?: string;
}

export function ChatHeader({ participant, className }: ChatHeaderProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 border-b border-gray-800",
      className
    )}>
      <Avatar
        src={participant.avatarUrl}
        fallback={participant.name[0]}
        className="w-10 h-10"
      />
      <div>
        <h2 className="font-medium text-gray-100">{participant.name}</h2>
        <p className="text-sm text-gray-400">
          Last active {formatRelativeDate(participant.lastActive)}
        </p>
      </div>
    </div>
  );
}