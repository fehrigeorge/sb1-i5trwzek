import { lazy } from 'react';

export const ChatRoute = lazy(() => 
  import('./chat-route').then(mod => ({ default: mod.default }))
);

export const WelcomeScreen = lazy(() => 
  import('./welcome-screen').then(mod => ({ default: mod.default }))
);

export const AuthForm = lazy(() => 
  import('../components/auth/auth-form').then(mod => ({ default: mod.default }))
);
