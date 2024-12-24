import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format a date into a standard date string
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Never';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'PP') : 'Invalid date';
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date into a relative time string (e.g. "2 hours ago")
 */
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

/**
 * Format a date into a time string (e.g. "2:30 PM")
 */
export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'h:mm a') : '';
  } catch (error) {
    console.warn('Error formatting time:', error);
    return '';
  }
}