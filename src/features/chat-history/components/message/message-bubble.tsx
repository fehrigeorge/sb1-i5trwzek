import { cn } from '@/shared/helpers';
import { Avatar } from '@/shared/components/ui/avatar';
import { formatMessageTime } from '../../utils/date-formatting';
import type { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar?: boolean;
}

export function MessageBubble({ message, isOwn, showAvatar = true }: MessageBubbleProps) {
  return (
    <div className={cn(
      "flex items-end gap-2",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {showAvatar && (
        <Avatar 
          fallback={isOwn ? "R" : "?"}
          className="w-8 h-8 flex-shrink-0"
        />
      )}
      
      <div className={cn(
        "max-w-[70%] flex flex-col",
        isOwn ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-2xl",
          isOwn ? 
            "bg-blue-500 text-white rounded-br-none" : 
            "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message}
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2">
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}