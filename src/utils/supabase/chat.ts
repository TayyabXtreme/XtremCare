import { supabase } from './client';

export interface ChatMessage {
  id: string;
  user_id: string;
  user_message: string;
  ai_response: string;
  topic?: string;
  created_at: string;
  updated_at: string;
}

export interface UserHealthContext {
  full_name?: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  chronic_diseases?: string;
  allergies?: string;
  current_medications?: string;
  past_surgeries?: string;
  family_history?: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  blood_sugar?: number;
  cholesterol?: number;
  oxygen_level?: number;
  primary_goal?: string;
  target_weight?: number;
  activity_level?: string;
  dietary_preferences?: string;
  sleep_hours?: number;
}

/**
 * Get user's health context from database
 */
export async function getUserHealthContext(clerkId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error) throw error;
    return { data: data as UserHealthContext, error: null };
  } catch (error) {
    console.error('Error fetching user health context:', error);
    return { data: null, error };
  }
}

/**
 * Get chat history for a user
 */
export async function getChatHistory(userId: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return { data: data as ChatMessage[], error: null };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return { data: null, error };
  }
}

/**
 * Save a chat message to database
 */
export async function saveChatMessage(
  userId: string,
  userMessage: string,
  aiResponse: string,
  topic?: string
) {
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: userId,
        user_message: userMessage,
        ai_response: aiResponse,
        topic: topic || null,
      })
      .select()
      .single();

    if (error) throw error;
    return { data: data as ChatMessage, error: null };
  } catch (error) {
    console.error('Error saving chat message:', error);
    return { data: null, error };
  }
}

/**
 * Subscribe to real-time chat updates
 */
export function subscribeToChatUpdates(
  userId: string,
  callback: (message: ChatMessage) => void
) {
  const channel = supabase
    .channel(`chat:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'ai_chat_history',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as ChatMessage);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Clear chat history for a user
 */
export async function clearChatHistory(userId: string) {
  try {
    const { error } = await supabase
      .from('ai_chat_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return { success: false, error };
  }
}

/**
 * Get user ID from clerk_id
 */
export async function getUserIdFromClerkId(clerkId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();

    if (error) throw error;
    return { data: data?.id || null, error: null };
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return { data: null, error };
  }
}
