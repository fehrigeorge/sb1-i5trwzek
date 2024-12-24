import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ResizableSidebar } from './resizable-sidebar';
import { ChatList } from './chat-list';
import { ChatListHeader } from './chat-list-header';
import { LoadingFallback } from '@/shared/components/layout/loading-fallback';
import { cn } from '@/shared/helpers';
import { useAppearance } from '@/stores/appearance';

export function ChatLayout() {
  const { animations } = useAppearance();

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-gray-950">
      <ResizableSidebar>
        <ChatListHeader />
        <Suspense fallback={<LoadingFallback />}>
          <ChatList />
        </Suspense>
      </ResizableSidebar>

      <main
        className={cn(
          'flex-1 overflow-hidden',
          animations && 'animate-in fade-in duration-500'
        )}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}