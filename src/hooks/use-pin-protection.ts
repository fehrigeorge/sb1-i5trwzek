import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface PinProtectionState {
  isProtected: boolean;
  isVerified: boolean;
  remainingAttempts: number;
  error: string | null;
}

export function usePinProtection(participantId: string) {
  const { user } = useAuth();
  const [state, setState] = useState<PinProtectionState>({
    isProtected: false,
    isVerified: false,
    remainingAttempts: 5,
    error: null,
  });

  const checkProtection = async () => {
    const { data } = await supabase
      .from('protected_chats')
      .select('participant_id')
      .eq('participant_id', participantId)
      .single();

    setState(prev => ({
      ...prev,
      isProtected: !!data,
    }));
  };

  const setPin = async (pin: string) => {
    if (!user?.isAdmin) {
      throw new Error('Only admins can set PINs');
    }

    const { error } = await supabase
      .from('protected_chats')
      .upsert({
        participant_id: participantId,
        pin_hash: pin,
      });

    if (error) throw error;
    await checkProtection();
  };

  const removePin = async () => {
    if (!user?.isAdmin) {
      throw new Error('Only admins can remove PINs');
    }

    const { error } = await supabase
      .from('protected_chats')
      .delete()
      .eq('participant_id', participantId);

    if (error) throw error;
    await checkProtection();
  };

  const verifyPin = async (pin: string) => {
    const { data, error } = await supabase
      .rpc('verify_pin', {
        p_participant_id: participantId,
        p_pin: pin,
      });

    if (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        remainingAttempts: prev.remainingAttempts - 1,
      }));
      return false;
    }

    setState(prev => ({
      ...prev,
      isVerified: data,
      error: data ? null : 'Invalid PIN',
      remainingAttempts: data ? 5 : prev.remainingAttempts - 1,
    }));

    return data;
  };

  return {
    ...state,
    checkProtection,
    setPin,
    removePin,
    verifyPin,
  };
}