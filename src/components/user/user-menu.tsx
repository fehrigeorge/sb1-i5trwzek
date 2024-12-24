import { useState } from 'react';
import {
  Settings,
  Camera,
  Trash2,
  LogOut,
  Command,
  Palette,
} from 'lucide-react';
import { useUserMenu } from '@/stores/user-menu';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { UserAvatar } from '@/shared/components/user';
import {Modal} from '@/shared/components/modal'
export function UserMenu() {
  const { isOpen, toggle } = useUserMenu();
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);

  if (!isOpen || !user) return null;

  return (
    <>
      <<Modal>
        title="Profile Settings"
        icon={<UserAvatar className="w-8 h-8" />}
        onClose={() => toggle(false)}
        className="max-w-md"
      >
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <UserAvatar className="w-16 h-16" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-200">
                {user.email}
              </h3>
              <label className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
                <Camera className="w-4 h-4" />
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    try {
                      const fileExt = file.name.split('.').pop();
                      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

                      await supabase.storage
                        .from('avatars')
                        .upload(filePath, file);

                      const {
                        data: { publicUrl },
                      } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(filePath);

                      await supabase.auth.updateUser({
                        data: { avatar_url: publicUrl },
                      });

                      window.location.reload();
                    } catch (error) {
                      console.error('Error uploading avatar:', error);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Theme
            </h3>
            {/* <ThemeSelector /> */}
            theme selector here
          </div>

          {/* Appearance Settings */}
          <button
            onClick={() => setShowAppearance(true)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Appearance Settings
          </button>

          {/* Keyboard Shortcuts */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Command className="w-4 h-4" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-400">
                <span>Open user menu</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">⌘K</kbd>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Go home</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">H</kbd>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Close modals</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-gray-800/50">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
            <button
              onClick={async () => {
                if (!isDeleting) {
                  setIsDeleting(true);
                  return;
                }

                try {
                  const { error } = await supabase.rpc('delete_user');
                  if (error) throw error;
                  await signOut();
                } catch (error) {
                  console.error('Error deleting account:', error);
                  setIsDeleting(false);
                }
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Click again to confirm' : 'Delete account'}
            </button>
          </div>
        </div>
      </Modal>

      {showAppearance && (
        <AppearanceSettings onClose={() => setShowAppearance(false)} />
      )}
    </>
  );
}
