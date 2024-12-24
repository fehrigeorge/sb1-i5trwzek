import { format } from 'date-fns';
import { cn } from '@/shared/helpers';
import { Avatar } from '@/components/ui/avatar';

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isRemco: boolean;
  showAvatar?: boolean;
}

export function MessageBubble({ message, timestamp, isRemco, showAvatar = true }: MessageBubbleProps) {
  return (
    <div className={cn(
      "flex items-end gap-2 px-4 py-1",
      isRemco ? "flex-row-reverse" : "flex-row"
    )}>
      {showAvatar && (
        <Avatar 
          fallback={isRemco ? "R" : "?"}
          className="w-8 h-8 flex-shrink-0"
        />
      )}
      
      <div className={cn(
        "max-w-[70%] flex flex-col",
        isRemco ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-2xl",
          isRemco ? 
            "bg-blue-500 text-white rounded-br-none" : 
            "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2">
          {format(new Date(timestamp), 'HH:mm')}
        </span>
      </div>
    </div>
  );
}