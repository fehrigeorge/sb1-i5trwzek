import { useState } from 'react';
import { Settings, Camera, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { UserAvatar } from './user-avatar';
import { supabase } from '@/lib/supabase';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!user) return null;

  return (
    <div className="p-4 space-y-6">
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <UserAvatar className="w-16 h-16" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-200">{user.email}</h3>
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

                  const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                  await supabase.auth.updateUser({
                    data: { avatar_url: publicUrl }
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

      {/* Actions */}
      <div className="space-y-2">
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
  );
}