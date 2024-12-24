import { supabase } from './supabase';
import type { ChatMessage } from './types';

export async function createParticipant(name: string, messages: ChatMessage[]) {
  const lastActive = new Date(
    Math.max(...messages.map(m => new Date(m.timestamp).getTime()))
  ).toISOString();

  const { data: participant, error } = await supabase
    .from('participants')
    .insert({ name, last_active: lastActive })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create participant: ${error.message}`);
  }

  return participant;
}