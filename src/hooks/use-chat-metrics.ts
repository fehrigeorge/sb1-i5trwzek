import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { differenceInMinutes, format, parseISO } from 'date-fns';
import { ChatMetrics } from '@/types/metrics';

const REMCO_ID = '77777777-7777-7777-7777-777777777777';

export function useChatMetrics(chatId: string | null) {
  return useQuery({
    queryKey: ['chat-metrics', chatId],
    queryFn: async (): Promise<ChatMetrics> => {
      if (!chatId) throw new Error('Chat ID is required');

      // Fetch messages with optimized query
      const { data: messages, error } = await supabase
        .from('messages')
        .select('sender_id, message, timestamp')
        .eq('participant_id', chatId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      if (!messages?.length) throw new Error('No messages found');

      // Use a more efficient data structure for counts
      const hourMap = new Map<string, number>();
      const weekdayMap = new Map<string, number>();
      const responseTimes: number[] = [];
      
      // Pre-allocate arrays for better performance
      const wordCounts = new Array(messages.length);
      let fastResponses = 0;
      let mediumResponses = 0;
      let slowResponses = 0;
      let sentCount = 0;

      // Single pass through messages for all metrics
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const timestamp = parseISO(msg.timestamp);
        const hour = format(timestamp, 'HH:00');
        const weekday = format(timestamp, 'EEEE');
        
        // Update counts using Map for better performance
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
        weekdayMap.set(weekday, (weekdayMap.get(weekday) || 0) + 1);
        
        // Calculate word count
        wordCounts[i] = msg.message.split(/\s+/).length;
        
        // Track sent messages
        if (msg.sender_id === REMCO_ID) sentCount++;

        // Calculate response time if it's a reply
        if (i > 0 && messages[i - 1].sender_id !== msg.sender_id) {
          const responseTime = differenceInMinutes(
            timestamp,
            parseISO(messages[i - 1].timestamp)
          );
          responseTimes.push(responseTime);

          if (responseTime < 1) fastResponses++;
          else if (responseTime < 5) mediumResponses++;
          else slowResponses++;
        }
      }

      // Calculate hour-based metrics efficiently
      let maxHourCount = 0;
      let minHourCount = Infinity;
      let busiestHour = '';
      let quietestHour = '';
      
      hourMap.forEach((count, hour) => {
        if (count > maxHourCount) {
          maxHourCount = count;
          busiestHour = hour;
        }
        if (count < minHourCount) {
          minHourCount = count;
          quietestHour = hour;
        }
      });

      // Calculate trends efficiently
      const quarterLength = Math.floor(messages.length / 4);
      const firstQuarter = messages.slice(0, quarterLength);
      const lastQuarter = messages.slice(-quarterLength);
      
      const firstQuarterResponseTime = calculateAverageResponseTime(firstQuarter);
      const lastQuarterResponseTime = calculateAverageResponseTime(lastQuarter);
      
      const responseTrend = firstQuarterResponseTime === 0 ? 0 :
        Math.round(((lastQuarterResponseTime - firstQuarterResponseTime) / firstQuarterResponseTime) * 100);

      const engagementTrend = Math.round(
        ((lastQuarter.filter(m => m.sender_id === REMCO_ID).length / quarterLength) -
        (firstQuarter.filter(m => m.sender_id === REMCO_ID).length / quarterLength)) * 100
      );

      // Calculate final metrics
      const totalMessages = messages.length;
      const conversationLength = differenceInMinutes(
        parseISO(messages[messages.length - 1].timestamp),
        parseISO(messages[0].timestamp)
      );

      return {
        totalMessages,
        avgResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
        fastestResponse: Math.min(...responseTimes),
        slowestResponse: Math.max(...responseTimes),
        sentByYou: sentCount,
        received: totalMessages - sentCount,
        messagesByHour: Object.fromEntries(hourMap),
        wordsPerMessage: Math.round(wordCounts.reduce((a, b) => a + b, 0) / totalMessages),
        longestMessage: Math.max(...wordCounts),
        shortestMessage: Math.min(...wordCounts),
        totalWords: wordCounts.reduce((a, b) => a + b, 0),
        responseTrend,
        engagementTrend,
        averageWordsPerResponse: Math.round(wordCounts.reduce((a, b) => a + b, 0) / responseTimes.length),
        busiestsHour: { hour: busiestHour, count: maxHourCount },
        quietestHour: { hour: quietestHour, count: minHourCount },
        responseTimeDistribution: { fast: fastResponses, medium: mediumResponses, slow: slowResponses },
        weekdayDistribution: Object.fromEntries(weekdayMap),
        conversationLength,
        messageFrequency: Math.round((totalMessages / conversationLength) * 60),
      };
    },
    enabled: Boolean(chatId),
  });
}

function calculateAverageResponseTime(messages: any[]): number {
  const times: number[] = [];
  for (let i = 1; i < messages.length; i++) {
    if (messages[i - 1].sender_id !== messages[i].sender_id) {
      times.push(differenceInMinutes(
        parseISO(messages[i].timestamp),
        parseISO(messages[i - 1].timestamp)
      ));
    }
  }
  return times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
}