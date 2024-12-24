import { supabase } from './supabase';

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  try {
    // Validate file
    if (file.size > 1024 * 1024) {
      throw new Error('File size must be less than 1MB');
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      throw new Error('File must be an image (JPEG, PNG, or GIF)');
    }

    // Delete old avatar if exists
    const { data: oldFiles } = await supabase.storage
      .from('avatars')
      .list(`${userId}-`);

    if (oldFiles?.length) {
      await supabase.storage
        .from('avatars')
        .remove(oldFiles.map(f => f.name));
    }

    // Upload new avatar
    const fileExt = file.type.split('/')[1];
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}