import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';
import { Avatar, MessageCountBadge } from '@/components/ui';
import { cn } from '@/shared/helpers';
import { PinStatusIndicator } from './pin-protection/pin-status-indicator';
import { usePinProtection } from '@/hooks/use-pin-protection';
import { ChatPreviewMenu } from './chat-preview-menu';
import type { ChatPreview } from '@/types';

interface ChatPreviewItemProps {
  preview: ChatPreview;
  isFavorite: boolean;
  isSelected?: boolean;
  onClick: () => void;
}

export function ChatPreviewItem({ preview, isFavorite, isSelected, onClick }: ChatPreviewItemProps) {
  const { isProtected } = usePinProtection(preview.id);
  
  const lastMessageTime = preview.lastMessage?.timestamp 
    ? formatDistanceToNow(new Date(preview.lastMessage.timestamp), { addSuffix: true })
    : formatDistanceToNow(new Date(preview.lastActive), { addSuffix: true });

  const REMCO_ID = '77777777-7777-7777-7777-777777777777';
  const isRemcoMessage = preview.lastMessage?.sender_id === REMCO_ID;

  return (
    <div 
      className={cn(
        "group relative w-full px-4 py-3 flex items-center gap-3",
        "hover:bg-gray-900/50 transition-colors border-b border-gray-800/50",
        isSelected && "bg-gray-800/50"
      )}
    >
      <button onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative">
          <Avatar
            src={preview.avatarUrl}
            alt={preview.name}
            fallback={preview.name[0]}
            className="flex-shrink-0"
          />
          {isFavorite && (
            <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-yellow-400" />
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex justify-between items-baseline gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate text-gray-100">{preview.name}</h3>
              <MessageCountBadge count={preview.messageCount} />
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {lastMessageTime}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {preview.lastMessage && (
              <p className={cn(
                "text-sm truncate flex-1",
                isRemcoMessage ? "text-gray-400" : "text-gray-500"
              )}>
                {isRemcoMessage && 'You: '}
                {preview.lastMessage.message}
              </p>
            )}
            <PinStatusIndicator 
              isProtected={isProtected} 
              className="text-gray-500 flex-shrink-0"
            />
          </div>
        </div>
      </button>
      
      <ChatPreviewMenu
        chatId={preview.id}
        chatName={preview.name}
        isFavorite={isFavorite}
      />
    </div>
  );
}