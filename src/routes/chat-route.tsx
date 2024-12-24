import { useParams } from 'react-router-dom';
import { ChatDetail } from '@/components/chat/chat-detail';

export default function ChatRoute() {
  const { participantId } = useParams<{ participantId: string }>();
  
  if (!participantId) {
    return null;
  }

  return <ChatDetail participantId={participantId} />;
}