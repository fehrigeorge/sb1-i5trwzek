import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export function DangerZone() {
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>();

  const handleDeleteAccount = async () => {
    try {
      if (!isDeleting) {
        setIsDeleting(true);
        return;
      }

      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-red-400">Danger Zone</h3>

      <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
        <h4 className="text-sm font-medium text-red-400">Delete Account</h4>
        <p className="mt-1 text-sm text-gray-400">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}

        <button
          onClick={handleDeleteAccount}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Click again to confirm' : 'Delete account'}
        </button>
      </div>
    </div>
  );
}