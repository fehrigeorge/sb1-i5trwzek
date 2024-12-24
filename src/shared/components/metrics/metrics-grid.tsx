```tsx
import { MessageCircle, Clock, Zap, MessageSquare } from 'lucide-react';
import { MetricCard } from './metric-card';
import { EngagementChart } from './engagement-chart';
import { ResponseTimes } from './response-times';
import { ActivityPatterns } from './activity-patterns';
import { ResponseDistribution } from './response-distribution';
import type { ChatMetrics } from '../types';

interface MetricsGridProps {
  metrics: ChatMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Messages"
          value={metrics.totalMessages}
          trend={metrics.engagementTrend}
          icon={<MessageCircle className="w-4 h-4 text-blue-400" />}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics.avgResponseTime}m`}
          trend={-metrics.responseTrend}
          icon={<Clock className="w-4 h-4 text-green-400" />}
        />
        <MetricCard
          title="Messages per Hour"
          value={metrics.messageFrequency}
          icon={<Zap className="w-4 h-4 text-yellow-400" />}
        />
        <MetricCard
          title="Words per Message"
          value={metrics.wordsPerMessage}
          icon={<MessageSquare className="w-4 h-4 text-purple-400" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart
          sent={metrics.sentByYou}
          received={metrics.received}
        />
        <ResponseTimes
          average={metrics.avgResponseTime}
          fastest={metrics.fastestResponse}
          slowest={metrics.slowestResponse}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityPatterns
          busiestHour={metrics.busiestHour}
          quietestHour={metrics.quietestHour}
          messageFrequency={metrics.messageFrequency}
          conversationLength={metrics.conversationLength}
        />
        <ResponseDistribution
          distribution={metrics.responseTimeDistribution}
        />
      </div>
    </div>
  );
}
```