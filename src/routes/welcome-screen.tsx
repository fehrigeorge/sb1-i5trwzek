import { MessageCircle } from 'lucide-react';

export default function WelcomeScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 bg-gradient-to-b from-gray-900/50 to-gray-950">
      <MessageCircle className="w-12 h-12 text-gray-600" />
      <p className="text-lg">Select a chat to start viewing messages</p>
    </div>
  );
}
