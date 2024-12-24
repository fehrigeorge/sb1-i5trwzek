import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/shared/helpers';

interface MessageInputProps {
  participantId: string;
  className?: string;
}

export function MessageInput({ participantId, className }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // Send message logic here
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("p-4 border-t border-gray-800", className)}
    >
      <div className="flex items-end gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-h-[2.5rem] px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2.5 text-gray-400 bg-gray-900 border border-gray-800 rounded-lg hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}