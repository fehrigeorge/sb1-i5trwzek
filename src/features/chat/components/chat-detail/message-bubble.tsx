```typescript
import { memo } from 'react';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { Avatar } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/helpers';
import type { Message } from '../../types/message';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  className?: string;
}

export const MessageBubble = memo(function MessageBubble({ 
  message, 
  isOwn,
  showAvatar = true,
  className 
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isOwn ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {showAvatar && (
        <Avatar
          src={message.avatarUrl}
          fallback={isOwn ? "You" : "Them"}
          className="w-8 h-8 flex-shrink-0"
        />
      )}

      <div className={cn(
        "group relative max-w-[70%] space-y-1",
        isOwn ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-2xl break-words",
          isOwn ? 
            "bg-blue-600 text-white rounded-br-none" : 
            "bg-gray-800 text-gray-100 rounded-bl-none"
        )}>
          {message.content}
          {message.attachments?.map((attachment) => (
            <div key={attachment.id} className="mt-2">
              {/* Render attachment based on type */}
            </div>
          ))}
        </div>

        <div className={cn(
          "flex items-center gap-1 text-xs text-gray-400",
          isOwn ? "justify-end" : "justify-start"
        )}>
          <time dateTime={message.timestamp}>
            {format(new Date(message.timestamp), 'h:mm a')}
          </time>
          {isOwn && message.isRead && (
            <Check className="w-3 h-3 text-blue-400" />
          )}
        </div>
      </div>
    </div>
  );
});
```