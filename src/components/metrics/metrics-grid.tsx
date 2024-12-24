import { MetricCard } from './metric-card';
import { EngagementChart } from './engagement-chart';
import { ResponseTimes } from './response-times';
import { ActivityPatterns } from './activity-patterns';
import { ResponseDistribution } from './response-distribution';
import type { ChatMetrics } from '@/types/metrics';

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
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics.avgResponseTime}m`}
          trend={-metrics.responseTrend}
        />
        <MetricCard
          title="Messages per Hour"
          value={metrics.messageFrequency}
        />
        <MetricCard
          title="Words per Message"
          value={metrics.wordsPerMessage}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart
          sentCount={metrics.sentByYou}
          receivedCount={metrics.received}
          totalMessages={metrics.totalMessages}
        />
        <ResponseTimes
          avgResponseTime={metrics.avgResponseTime}
          fastestResponse={metrics.fastestResponse}
          slowestResponse={metrics.slowestResponse}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityPatterns
          busiestsHour={metrics.busiestsHour}
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
