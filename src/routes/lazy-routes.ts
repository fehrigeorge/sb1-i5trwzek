import { lazy } from 'react';

export const ChatRoute = lazy(() => import('./chat-route'));
export const WelcomeScreen = lazy(() => import('./welcome-screen'));
export const AuthForm = lazy(() => import('../components/auth/auth-form'));
export const RegisterForm = lazy(() => import('../components/auth/register-form'));