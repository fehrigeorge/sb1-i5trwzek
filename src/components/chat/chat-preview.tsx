import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '@/components/ui';
import { ChatPreview } from '@/types';
import { cn } from '@/shared/helpers';

interface ChatPreviewProps {
  preview: ChatPreview;
  onClick: () => void;
}

export function ChatPreview({ preview, onClick }: ChatPreviewProps) {
  const lastMessageTime = preview.lastMessage?.timestamp 
    ? formatDistanceToNow(new Date(preview.lastMessage.timestamp), { addSuffix: true })
    : formatDistanceToNow(new Date(preview.lastActive), { addSuffix: true });

  return (
    <button
      onClick={onClick}
      className="w-full p-4 flex items-center gap-4 hover:bg-gray-900 transition-colors"
    >
      <Avatar
        src={preview.avatarUrl}
        alt={preview.name}
        fallback={preview.name[0]}
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium truncate text-gray-100">{preview.name}</h3>
          <span className="text-sm text-gray-400 shrink-0 ml-2">
            {lastMessageTime}
          </span>
        </div>
        {preview.lastMessage && (
          <p className={cn(
            "text-sm truncate",
            preview.lastMessage.sender_id === '77777777-7777-7777-7777-777777777777' 
              ? "text-gray-400" 
              : "text-gray-500"
          )}>
            {preview.lastMessage.sender_id === '77777777-7777-7777-7777-777777777777' && 'You: '}
            {preview.lastMessage.message}
          </p>
        )}
      </div>
    </button>
  );
}