import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { format, isValid } from 'date-fns';
import { supabase } from '@/lib/supabase';

export function AccountInfo() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>();

  if (!user) return null;

  // Format date safely with fallback
  const formatCreatedAt = (dateString?: string) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'PPP') : 'Invalid date';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username }
      });
      if (error) throw error;
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update username');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-200">Account Information</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Username</label>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-1 flex gap-2">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-300">{username || 'Not set'}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-400">Email</label>
          <div className="mt-1 text-gray-300">{user.email}</div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Role</label>
          <div className="mt-1 text-gray-300">
            {user.isAdmin ? 'Administrator' : 'User'}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Account Created</label>
          <div className="mt-1 text-gray-300">
            {formatCreatedAt(user.createdAt)}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
}