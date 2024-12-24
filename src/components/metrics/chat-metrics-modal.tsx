import { BarChart2 } from 'lucide-react';
import { useChatMetrics } from '@/hooks/use-chat-metrics';
import { MetricsGrid } from './metrics-grid';
import { GlassModal } from '../ui/glass-modal';

interface ChatMetricsModalProps {
  chatId: string;
  chatName: string;
  onClose: () => void;
}

export function ChatMetricsModal({ chatId, chatName, onClose }: ChatMetricsModalProps) {
  const { data: metrics, isLoading, error } = useChatMetrics(chatId);

  return (
    <GlassModal
      title="Chat Analytics"
      icon={<div className="p-2 rounded-lg bg-gray-800/50"><BarChart2 className="w-5 h-5 text-blue-400" /></div>}
      onClose={onClose}
      className="max-w-5xl"
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-400">
          Detailed metrics for your conversation with {chatName}
        </p>

        <div className="max-h-[calc(90vh-12rem)] overflow-y-auto space-y-8 pr-2">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Loading metrics...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">
              {error instanceof Error ? error.message : 'Failed to load metrics'}
            </div>
          ) : metrics ? (
            <MetricsGrid metrics={metrics} />
          ) : null}
        </div>
      </div>
    </GlassModal>
  );
}
