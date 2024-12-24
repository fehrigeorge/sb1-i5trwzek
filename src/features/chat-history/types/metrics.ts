export interface ChatMetrics {
  totalMessages: number;
  avgResponseTime: number;
  fastestResponse: number;
  slowestResponse: number;
  sentByYou: number;
  received: number;
  messagesByHour: Record<string, number>;
  wordsPerMessage: number;
  longestMessage: number;
  shortestMessage: number;
  totalWords: number;
  responseTrend: number;
  engagementTrend: number;
  averageWordsPerResponse: number;
  busiestsHour: { hour: string; count: number };
  quietestHour: { hour: string; count: number };
  responseTimeDistribution: {
    fast: number;
    medium: number;
    slow: number;
  };
  weekdayDistribution: Record<string, number>;
  conversationLength: number;
  messageFrequency: number;
}