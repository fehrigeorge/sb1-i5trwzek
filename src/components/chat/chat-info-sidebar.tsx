import { X, Star, Lock, BarChart2 } from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { useToggleFavorite } from '@/hooks/use-favorites';
import { usePinProtection } from '@/hooks/use-pin-protection';
import { cn } from '@/shared/helpers';
import { useAppearance } from '@/stores/appearance';
import { formatFullDate, formatRelativeDate } from '@/lib/utils/date';

interface ChatInfoSidebarProps {
  chatId: string;
  name: string;
  avatarUrl?: string;
  lastActive: string;
  messageCount: number;
  isFavorite: boolean;
  onClose: () => void;
  onShowMetrics: () => void;
  onSetPin: () => void;
}

export function ChatInfoSidebar({
  chatId,
  name,
  avatarUrl,
  lastActive,
  messageCount,
  isFavorite,
  onClose,
  onShowMetrics,
  onSetPin,
}: ChatInfoSidebarProps) {
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { isProtected } = usePinProtection(chatId);
  const { animations } = useAppearance();

  return (
    <div className={cn(
      "absolute top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800",
      "flex flex-col",
      animations && "animate-in slide-in-from-right duration-300"
    )}>
      {/* Header */}
      <div className="h-16 min-h-[4rem] flex items-center justify-between px-4 border-b border-gray-800">
        <h2 className="text-lg font-medium text-gray-100">Chat Info</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Profile */}
        <div className="text-center">
          <Avatar
            src={avatarUrl}
            alt={name}
            fallback={name[0]}
            className="w-32 h-32 mx-auto"
          />
          <h3 className="mt-4 text-xl font-medium text-gray-100">{name}</h3>
          <p className="mt-1 text-sm text-gray-400">
            Last active {formatRelativeDate(lastActive)}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400 uppercase">Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-semibold text-gray-100">{messageCount}</div>
              <div className="text-sm text-gray-400">Total Messages</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-semibold text-gray-100">
                {formatFullDate(lastActive)}
              </div>
              <div className="text-sm text-gray-400">Last Message</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400 uppercase">Actions</h4>
          <div className="space-y-2">
            <button
              onClick={() => toggleFavorite({ participantId: chatId, isFavorite })}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <Star className={cn(
                "w-5 h-5",
                isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
              )} />
              <span className="text-gray-100">
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </span>
            </button>

            <button
              onClick={onSetPin}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-100">
                {isProtected ? 'Change PIN code' : 'Set PIN code'}
              </span>
            </button>

            <button
              onClick={onShowMetrics}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <BarChart2 className="w-5 h-5 text-gray-400" />
              <span className="text-gray-100">View chat metrics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}