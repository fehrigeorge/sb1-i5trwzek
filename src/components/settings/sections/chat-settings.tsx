import { MessageSquare } from 'lucide-react';
import { useChatSettings } from '@/stores/chat-settings';
import { Switch } from '@/components/ui/switch';

export function ChatSettings() {
  const { useInfiniteScroll, autoLoadOnInSight, updateSettings } = useChatSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-200">Infinite Scroll</h3>
          </div>
          <p className="text-sm text-gray-400">
            Enable infinite scrolling for messages
          </p>
        </div>
        <Switch
          checked={useInfiniteScroll}
          onChange={(checked) => updateSettings({ useInfiniteScroll: checked })}
        />
      </div>

      {useInfiniteScroll && (
        <div className="flex items-center justify-between pl-6 border-l border-gray-800">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-200">
              Auto-load on scroll
            </h3>
            <p className="text-sm text-gray-400">
              Automatically load more messages when scrolling
            </p>
          </div>
          <Switch
            checked={autoLoadOnInSight}
            onChange={(checked) => updateSettings({ autoLoadOnInSight: checked })}
          />
        </div>
      )}
    </div>
  );
}
