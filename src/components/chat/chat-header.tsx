import { cn } from '@/shared/helpers';
import { Avatar } from '@/components/ui/avatar';
import { ChatActionsMenu } from './chat-actions-menu';

interface ChatHeaderProps {
  participantId: string;
  participantName: string;
  avatarUrl?: string;
}

export function ChatHeader({ participantId, participantName, avatarUrl }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800">
      <div className="flex items-center gap-3">
        <Avatar
          src={avatarUrl}
          fallback={participantName[0]}
          className="w-8 h-8"
        />
        <h2 className="text-lg font-semibold">{participantName}</h2>
      </div>
      
      <ChatActionsMenu 
        participantId={participantId}
        participantName={participantName}
      />
    </div>
  );
}