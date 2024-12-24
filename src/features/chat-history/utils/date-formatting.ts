import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export function formatMessageTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'h:mm a') : '';
  } catch (error) {
    console.warn('Error formatting time:', error);
    return '';
  }
}

export function formatFullDate(date: string | Date | null | undefined): string {
  if (!date) return 'Never';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'EEEE, MMMM d, yyyy') : 'Invalid date';
  } catch (error) {
    console.warn('Error formatting full date:', error);
    return 'Invalid date';
  }
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return 'Never';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) 
      ? formatDistanceToNow(parsedDate, { addSuffix: true })
      : 'Invalid date';
  } catch (error) {
    console.warn('Error formatting relative date:', error);
    return 'Invalid date';
  }
}