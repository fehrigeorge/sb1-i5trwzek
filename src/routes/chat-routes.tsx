import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChatLayout } from '@/components/chat/chat-layout';
import { LoadingFallback } from '@/shared/components/layout/loading-fallback';
import { useAuth } from '@/lib/auth';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { UserMenu } from '@/shared/components/user/user-menu';
import { ChatRoute, WelcomeScreen, AuthForm, RegisterForm } from './lazy-routes';

export default function ChatRoutes() {
  const { user, isLoading } = useAuth();
  useKeyboardShortcuts();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<ChatLayout />}>
          <Route index element={
            <Suspense fallback={<LoadingFallback />}>
              <WelcomeScreen />
            </Suspense>
          } />
          <Route path="chats/:participantId" element={
            <Suspense fallback={<LoadingFallback />}>
              <ChatRoute />
            </Suspense>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <UserMenu />
    </>
  );
}