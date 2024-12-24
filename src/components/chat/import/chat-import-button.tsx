```tsx
import { Upload } from 'lucide-react';

export function ChatImportButton() {
  return (
    <button 
      onClick={() => window.dispatchEvent(new CustomEvent('open-import-modal'))}
      className="w-full px-4 py-2 mt-2 flex items-center justify-center gap-2 text-sm text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
    >
      <Upload className="w-4 h-4" />
      Import Chat History
    </button>
  );
}
```