import { useRef, useEffect } from 'react';
import { useMessages } from '@/hooks/use-messages';
import { useParticipant } from '@/hooks/use-participant';
import { format, isSameDay, isWithinInterval } from 'date-fns';
import { MessageGroup } from './message/message-group';
import { DateSeparator } from './message/date-separator';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { ChatHeader } from './chat-header';
import { ChatToolbar } from './toolbar/chat-toolbar';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useChatFilters } from '@/hooks/use-chat-filters';
import { useFavorites } from '@/hooks/use-favorites';

// ... rest of the file remains the same
