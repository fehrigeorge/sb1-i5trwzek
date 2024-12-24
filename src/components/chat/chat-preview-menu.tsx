import { useState } from 'react';
import { MoreVertical, Star, BarChart2, Lock } from 'lucide-react';
import { cn } from '@/shared/helpers';
import { ChatMetricsModal } from '../metrics/chat-metrics-modal';
import { PinInputModal } from './pin-protection/pin-input-modal';
import { useToggleFavorite } from '@/hooks/use-favorites';
import { usePinProtection } from '@/hooks/use-pin-protection';

interface ChatPreviewMenuProps {
  chatId: string;
  chatName: string;
  isFavorite: boolean;
}

export function ChatPreviewMenu({ chatId, chatName, isFavorite }: ChatPreviewMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { setPin } = usePinProtection(chatId);

  return (
    <>
      <div className="relative z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={cn(
            "p-2 rounded-full transition-colors",
            "hover:bg-gray-800 group-hover:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            isOpen ? "bg-gray-800" : "opacity-0"
          )}
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />

            {/* Menu */}
            <div className={cn(
              "absolute right-0 top-full mt-1 z-50",
              "w-48 rounded-lg overflow-hidden",
              "bg-gray-900 border border-gray-800",
              "shadow-lg animate-in slide-in-from-top-2 duration-200"
            )}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite({ participantId: chatId, isFavorite });
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-800 flex items-center gap-2"
              >
                <Star className={cn(
                  "w-4 h-4",
                  isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                )} />
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMetrics(true);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-800 flex items-center gap-2"
              >
                <BarChart2 className="w-4 h-4 text-gray-400" />
                View chat metrics
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPinModal(true);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-800 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-gray-400" />
                Set PIN code
              </button>
            </div>
          </>
        )}
      </div>

      {showMetrics && (
        <ChatMetricsModal
          chatId={chatId}
          chatName={chatName}
          onClose={() => setShowMetrics(false)}
        />
      )}

      {showPinModal && (
        <PinInputModal
          title="Set PIN Code"
          onSubmit={async (pin) => {
            await setPin(pin);
            setShowPinModal(false);
          }}
          onCancel={() => setShowPinModal(false)}
          confirmPin
        />
      )}
    </>
  );
}