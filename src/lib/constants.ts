import { env } from './env';

export const ADMIN_EMAILS = [
  env.VITE_ADMIN_EMAIL_1,
  env.VITE_ADMIN_EMAIL_2,
].filter(Boolean) as string[];

export const REMCO_ID = '77777777-7777-7777-7777-777777777777';

export const isAdmin = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email);
};
