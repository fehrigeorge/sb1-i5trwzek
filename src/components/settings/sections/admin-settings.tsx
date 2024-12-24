import { Eye } from 'lucide-react';
import { useAdminPreview } from '@/stores/admin-preview';
import { Switch } from '@/components/ui/switch';

export function AdminSettings() {
  const { previewUserMode, togglePreviewMode } = useAdminPreview();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-200">User View Mode</h3>
          </div>
          <p className="text-sm text-gray-400">
            Preview the application as a regular user would see it
          </p>
        </div>
        <Switch
          checked={previewUserMode}
          onChange={togglePreviewMode}
        />
      </div>

      {previewUserMode && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-400">
            You're currently viewing the application as a regular user. Some admin features are hidden.
          </p>
        </div>
      )}
    </div>
  );
}