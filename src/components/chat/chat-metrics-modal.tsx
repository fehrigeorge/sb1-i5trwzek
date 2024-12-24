import { X, MessageSquare, Clock, Gauge, MessageCircle } from 'lucide-react';
import { useChatMetrics } from '@/hooks/use-chat-metrics';
import { MetricCard } from './metric-card';
import { EngagementChart } from './engagement-chart';
import { ResponseTimes } from './response-times';
import { ActivityPatterns } from './activity-patterns';
import { ResponseDistribution } from './response-distribution';
import { useTheme } from '@/stores/theme';
import { themes } from '@/lib/themes';
import { ModalBackdrop } from '../ui/modal-backdrop';
import { cn } from '@/shared/helpers';

interface ChatMetricsModalProps {
  chatId: string;
  chatName: string;
  onClose: () => void;
}

export function ChatMetricsModal({ chatId, chatName, onClose }: ChatMetricsModalProps) {
  const { data: metrics, isLoading, error } = useChatMetrics(chatId);
  const { mode } = useTheme();
  const theme = themes[mode];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className={cn(
        "w-full max-w-5xl rounded-xl shadow-2xl border",
        "max-h-[90vh] overflow-hidden",
        theme.card,
        theme.border
      )}>
        <div className={cn(
          "sticky top-0 flex items-center justify-between p-6 border-b z-10",
          theme.border,
          theme.card
        )}>
          <div>
            <h2 className={cn("text-2xl font-semibold", theme.foreground)}>
              Chat Analytics
            </h2>
            <p className={cn("text-sm mt-1", theme.muted)}>
              Detailed metrics for your conversation with {chatName}
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg transition-colors",
              "hover:bg-black/20"
            )}
          >
            <X className={cn("w-5 h-5", theme.muted)} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className={cn("text-center py-8", theme.muted)}>Loading metrics...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">
              {error instanceof Error ? error.message : 'Failed to load metrics'}
            </div>
          ) : metrics && (
            <div className="space-y-8">
              {/* Rest of the metrics content remains the same */}
            </div>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}