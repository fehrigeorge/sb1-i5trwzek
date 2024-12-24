```tsx
import { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/helpers';
import { importChat } from '@/lib/import';
import { ProgressBar } from './progress-bar';

export function ChatImportModal({ onClose }: { onClose: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>();
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file?.type !== 'application/json') {
      setError('Please upload a JSON file');
      return;
    }
    setFile(file);
    setError(undefined);
  };

  const handleImport = async () => {
    if (!file) return;
    
    try {
      setIsImporting(true);
      setError(undefined);
      
      await importChat(file, {
        onProgress: (progress) => setProgress(progress),
        onStatus: (status) => setStatus(status)
      });

      // Close modal after successful import
      setTimeout(onClose, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import chat');
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <h2 className="text-lg font-semibold">Import Chat History</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {!file ? (
            // Upload area
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-8",
                "flex flex-col items-center justify-center gap-4",
                isDragging ? "border-blue-500 bg-blue-500/5" : "border-gray-300 dark:border-gray-700"
              )}
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag and drop your JSON file here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Only JSON files are supported
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(file);
                    setError(undefined);
                  }
                }}
              />
            </div>
          ) : (
            // File selected view
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {isImporting && (
                <div className="space-y-2">
                  <ProgressBar progress={progress} />
                  <p className="text-sm text-gray-500 text-center">{status}</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || isImporting}
              className={cn(
                "px-4 py-2 text-sm text-white rounded-lg",
                "bg-blue-500 hover:bg-blue-600",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isImporting ? 'Importing...' : 'Import Chat'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```