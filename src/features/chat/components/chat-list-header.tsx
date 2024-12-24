import { Command } from 'lucide-react';
import { useSettings } from '@/stores/settings';
import { UserAvatar } from '@/shared/components/ui/user-avatar';

export function ChatListHeader() {
  const { open } = useSettings();

  return (
    <div className="h-16 min-h-[4rem] flex items-center justify-between px-4 bg-gray-900 border-b border-gray-800">
      <UserAvatar className="w-10 h-10" />
      <button
        onClick={open}
        className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
      >
        <Command className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}