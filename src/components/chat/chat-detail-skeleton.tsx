import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Clock } from 'lucide-react';
import { cn } from '@/shared/helpers';

export function ChatDetailSkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-8 overflow-hidden">
        {/* Time separator */}
        <div className="text-center">
          <Skeleton className="h-5 w-32 mx-auto" />
        </div>

        {/* Message groups */}
        <div className="space-y-6">
          {/* Received messages */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 max-w-[80%]">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-16 rounded-2xl" />
                <div className="flex items-center gap-2 ml-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Sent messages */}
          <div className="space-y-2 ml-auto">
            <div className="flex items-start gap-3 max-w-[80%] flex-row-reverse">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-12 rounded-2xl bg-blue-600/30" />
                <div className="flex items-center gap-2 justify-end mr-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typing indicator */}
        <div className="flex items-center gap-2 text-gray-500">
          <MessageCircle className="w-4 h-4 animate-bounce" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-10 rounded-lg" />
          </div>
          <Skeleton className="w-10 h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}