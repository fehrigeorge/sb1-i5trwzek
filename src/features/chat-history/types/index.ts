export interface ChatMessage {
  id: string;
  participantId: string;
  senderId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatPreview {
  id: string;
  name: string;
  avatarUrl?: string;
  lastActive: string;
  messageCount: number;
  lastMessage?: {
    message: string;
    timestamp: string;
    sender_id: string;
  };
}

export interface MessageGroup {
  timestamp: string;
  messages: ChatMessage[];
}

export interface DateRange {
  from: Date;
  to: Date;
}