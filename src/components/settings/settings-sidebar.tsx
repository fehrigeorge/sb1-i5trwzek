import { Settings, Palette, LogOut, Eye } from 'lucide-react';
import { useSettings } from '@/stores/settings';
import { useAuth } from '@/lib/auth';
import { UserAvatar } from '../ui/user-avatar';
import { cn } from '@/shared/helpers';
import { useAdminPreview } from '@/stores/admin-preview';

export function SettingsSidebar() {
  const { activeSection, setSection } = useSettings();
  const { user, signOut } = useAuth();
  const { previewUserMode } = useAdminPreview();

  if (!user) return null;

  const isAdmin = user.isAdmin && !previewUserMode;

  return (
    <div className="w-64 border-r border-gray-800/50">
      {/* User Info */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <UserAvatar className="w-10 h-10" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-200 truncate">{user.email}</h3>
            {isAdmin && (
              <span className="text-xs text-yellow-500">Admin</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        <button
          onClick={() => setSection('general')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm mb-1",
            activeSection === 'general'
              ? "bg-gray-800/50 text-gray-100"
              : "text-gray-400 hover:bg-gray-800/30"
          )}
        >
          <Settings className="w-4 h-4" />
          General
        </button>

        <button
          onClick={() => setSection('appearance')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm mb-1",
            activeSection === 'appearance'
              ? "bg-gray-800/50 text-gray-100"
              : "text-gray-400 hover:bg-gray-800/30"
          )}
        >
          <Palette className="w-4 h-4" />
          Appearance
        </button>

        {user.isAdmin && (
          <button
            onClick={() => setSection('admin')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm mb-1",
              activeSection === 'admin'
                ? "bg-gray-800/50 text-gray-100"
                : "text-gray-400 hover:bg-gray-800/30"
            )}
          >
            <Eye className="w-4 h-4" />
            Admin
          </button>
        )}
      </nav>

      {/* Sign Out */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-800/50">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800/30"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}