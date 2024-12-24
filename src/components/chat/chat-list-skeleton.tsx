import { Skeleton } from '@/components/ui/skeleton';

export function ChatListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* Search bar skeleton */}
      <div className="relative">
        <div className="w-full h-10 bg-gray-800/50 rounded-lg" />
      </div>

      {/* Chat previews skeleton */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="w-16 h-4 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}