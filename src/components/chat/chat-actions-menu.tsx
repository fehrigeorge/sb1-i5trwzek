import { MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface ChatActionsMenuProps {
  participantId: string;
  participantName: string;
}

export function ChatActionsMenu({ participantId, participantName }: ChatActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      // Delete messages first (will cascade to other related data)
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('participant_id', participantId);

      if (error) throw error;

      // Delete participant
      const { error: participantError } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantId);

      if (participantError) throw participantError;

      // Navigate back to chat list
      navigate('/');
    } catch (error) {
      console.error('Error deleting chat:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setIsDeleting(false);
            }}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 rounded-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg z-50">
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-red-500 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Click to confirm delete' : 'Delete chat'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}