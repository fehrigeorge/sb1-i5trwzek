import { useChatMetrics } from '../../hooks/use-chat-metrics';
import { MetricsGrid } from './metrics-grid';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

interface ChatMetricsProps {
  chatId: string;
  className?: string;
}

export function ChatMetrics({ chatId, className }: ChatMetricsProps) {
  const { data: metrics, isLoading, error } = useChatMetrics(chatId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !metrics) {
    return (
      <div className="text-center py-8 text-red-400">
        {error instanceof Error ? error.message : 'Failed to load metrics'}
      </div>
    );
  }

  return (
    <div className={className}>
      <MetricsGrid metrics={metrics} />
    </div>
  );
}