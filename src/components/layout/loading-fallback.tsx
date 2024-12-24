import { MessageCircle } from 'lucide-react';

export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <MessageCircle className="w-12 h-12 text-blue-500 animate-bounce" />
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  );
}