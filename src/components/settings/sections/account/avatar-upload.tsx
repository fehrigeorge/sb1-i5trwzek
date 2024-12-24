import { Camera } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { uploadAvatar } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { cn } from '@/shared/helpers';

export function AvatarUpload() {
  const { user } = useAuth();
  const [error, setError] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  if (!user) return null;

  const handleAvatarChange = async (file: File) => {
    try {
      setError(undefined);
      setIsUploading(true);

      const publicUrl = await uploadAvatar(user.id, file);
      
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      window.location.reload();
    } catch (error) {
      console.error('Error updating avatar:', error);
      setError(error instanceof Error ? error.message : 'Failed to update avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-200">Profile Picture</h3>

      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`}
            alt={user.email}
            className="w-16 h-16 rounded-full object-cover"
          />
          <label className={cn(
            "absolute -bottom-2 -right-2 p-1.5 rounded-full cursor-pointer transition-colors",
            isUploading 
              ? "bg-gray-700 cursor-wait" 
              : "bg-gray-800 hover:bg-gray-700"
          )}>
            <Camera className="w-4 h-4 text-gray-400" />
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/gif"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarChange(file);
              }}
            />
          </label>
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-gray-400">
            Upload a new profile picture
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPEG, PNG, GIF (max 1MB)
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}