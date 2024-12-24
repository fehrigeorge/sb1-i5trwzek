import { Star, BarChart2, Lock, Unlock } from 'lucide-react';
import { useToggleFavorite } from '@/hooks/use-favorites';
import { usePinProtection } from '@/hooks/use-pin-protection';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { PinInputModal } from './pin-protection/pin-input-modal';
import { ChatMetricsModal } from '../metrics/chat-metrics-modal';

interface ChatMenuProps {
  chatId: string;
  chatName: string;
  isFavorite: boolean;
  onClose: () => void;
}

export function ChatMenu({ chatId, chatName, isFavorite, onClose }: ChatMenuProps) {
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { user } = useAuth();
  const { isProtected, setPin, removePin } = usePinProtection(chatId);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [pinError, setPinError] = useState<string>();

  const handleSetPin = async (pin: string) => {
    try {
      await setPin(pin);
      setShowPinModal(false);
      onClose();
    } catch (error) {
      setPinError(error instanceof Error ? error.message : 'Failed to set PIN');
    }
  };

  const handleRemovePin = async () => {
    try {
      await removePin();
      onClose();
    } catch (error) {
      console.error('Failed to remove PIN:', error);
    }
  };

  return (
    <>
      <div className="absolute right-12 top-2 z-50 w-48 rounded-lg bg-gray-900 border border-gray-800 shadow-lg py-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite({ participantId: chatId, isFavorite });
            onClose();
          }}
          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-800 flex items-center gap-2"
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMetricsModal(true);
            onClose();
          }}
          className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 flex items-center gap-2"
        >
          <BarChart2 className="w-4 h-4" />
          View chat metrics
        </button>

        {user?.isAdmin && (
          <>
            <div className="h-px bg-gray-800 my-1" />
            
            {isProtected ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPinModal(true);
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Edit PIN code
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePin();
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-gray-800 flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  Remove PIN code
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPinModal(true);
                }}
                className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Set PIN code
              </button>
            )}
          </>
        )}
      </div>

      {showPinModal && (
        <PinInputModal
          title={isProtected ? "Edit PIN Code" : "Set PIN Code"}
          onSubmit={handleSetPin}
          onCancel={() => setShowPinModal(false)}
          error={pinError}
          confirmPin
        />
      )}

      {showMetricsModal && (
        <ChatMetricsModal
          chatId={chatId}
          chatName={chatName}
          onClose={() => setShowMetricsModal(false)}
        />
      )}
    </>
  );
}