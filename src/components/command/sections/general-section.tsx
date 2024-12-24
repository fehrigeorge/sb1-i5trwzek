import { Camera } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { UserAvatar } from '@/components/ui/user-avatar';
import { supabase } from '@/lib/supabase';

export function GeneralSection() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
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

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-200">Account Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Email</span>
            <span className="text-gray-200">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Role</span>
            <span className="text-gray-200">{user.isAdmin ? 'Admin' : 'User'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}