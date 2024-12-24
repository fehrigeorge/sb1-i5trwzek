export interface ChatMessage {
  name: string;
  message: string;
  timestamp: string;
}

export interface ImportStats {
  total: number;
  success: number;
  failed: number;
}