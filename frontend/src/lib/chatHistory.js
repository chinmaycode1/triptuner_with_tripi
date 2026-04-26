import { supabase } from './supabase';

/**
 * Chat History Management for Supabase
 * Handles saving and loading chat conversations and messages
 */

// ============================================
// CONVERSATION MANAGEMENT
// ============================================

/**
 * Create a new conversation
 * @param {string} userId - User ID from auth
 * @param {string} title - Optional conversation title
 * @returns {Promise<{data, error}>}
 */
export async function createConversation(userId, title = null) {
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert([{ user_id: userId, title }])
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error creating conversation:', error);
    return { data: null, error };
  }
}

/**
 * Get all conversations for a user
 * @param {string} userId - User ID from auth
 * @param {boolean} includeArchived - Include archived conversations
 * @returns {Promise<{data, error}>}
 */
export async function getUserConversations(userId, includeArchived = false) {
  try {
    let query = supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return { data: null, error };
  }
}

/**
 * Get a single conversation by ID
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<{data, error}>}
 */
export async function getConversation(conversationId) {
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return { data: null, error };
  }
}

/**
 * Update conversation
 * @param {string} conversationId - Conversation ID
 * @param {object} updates - Fields to update
 * @returns {Promise<{data, error}>}
 */
export async function updateConversation(conversationId, updates) {
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error updating conversation:', error);
    return { data: null, error };
  }
}

/**
 * Delete conversation (and all its messages via CASCADE)
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<{data, error}>}
 */
export async function deleteConversation(conversationId) {
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', conversationId);
    
    return { data, error };
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return { data: null, error };
  }
}

/**
 * Archive/Unarchive conversation
 * @param {string} conversationId - Conversation ID
 * @param {boolean} archived - Archive status
 * @returns {Promise<{data, error}>}
 */
export async function archiveConversation(conversationId, archived = true) {
  return updateConversation(conversationId, { is_archived: archived });
}

// ============================================
// MESSAGE MANAGEMENT
// ============================================

/**
 * Save a message to a conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID from auth
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 * @returns {Promise<{data, error}>}
 */
export async function saveMessage(conversationId, userId, role, content) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        conversation_id: conversationId,
        user_id: userId,
        role,
        content
      }])
      .select()
      .single();
    
    // Update conversation's updated_at timestamp
    if (!error) {
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Error saving message:', error);
    return { data: null, error };
  }
}

/**
 * Get all messages for a conversation
 * @param {string} conversationId - Conversation ID
 * @param {number} limit - Maximum number of messages to fetch
 * @returns {Promise<{data, error}>}
 */
export async function getConversationMessages(conversationId, limit = 100) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { data: null, error };
  }
}

/**
 * Delete a message
 * @param {string} messageId - Message ID
 * @returns {Promise<{data, error}>}
 */
export async function deleteMessage(messageId) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId);
    
    return { data, error };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { data: null, error };
  }
}

// ============================================
// SAVED TRIPS MANAGEMENT
// ============================================

/**
 * Save a trip from conversation
 * @param {object} tripData - Trip data
 * @returns {Promise<{data, error}>}
 */
export async function saveTrip(tripData) {
  try {
    const { data, error } = await supabase
      .from('saved_trips')
      .insert([tripData])
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error saving trip:', error);
    return { data: null, error };
  }
}

/**
 * Get all saved trips for a user
 * @param {string} userId - User ID from auth
 * @returns {Promise<{data, error}>}
 */
export async function getUserSavedTrips(userId) {
  try {
    const { data, error } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching saved trips:', error);
    return { data: null, error };
  }
}

/**
 * Update a saved trip
 * @param {string} tripId - Trip ID
 * @param {object} updates - Fields to update
 * @returns {Promise<{data, error}>}
 */
export async function updateSavedTrip(tripId, updates) {
  try {
    const { data, error } = await supabase
      .from('saved_trips')
      .update(updates)
      .eq('id', tripId)
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error updating saved trip:', error);
    return { data: null, error };
  }
}

/**
 * Delete a saved trip
 * @param {string} tripId - Trip ID
 * @returns {Promise<{data, error}>}
 */
export async function deleteSavedTrip(tripId) {
  try {
    const { data, error } = await supabase
      .from('saved_trips')
      .delete()
      .eq('id', tripId);
    
    return { data, error };
  } catch (error) {
    console.error('Error deleting saved trip:', error);
    return { data: null, error };
  }
}

/**
 * Toggle favorite status of a trip
 * @param {string} tripId - Trip ID
 * @param {boolean} isFavorite - Favorite status
 * @returns {Promise<{data, error}>}
 */
export async function toggleTripFavorite(tripId, isFavorite) {
  return updateSavedTrip(tripId, { is_favorite: isFavorite });
}

// ============================================
// USER PREFERENCES
// ============================================

/**
 * Get user preferences
 * @param {string} userId - User ID from auth
 * @returns {Promise<{data, error}>}
 */
export async function getUserPreferences(userId) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return { data: null, error };
  }
}

/**
 * Update user preferences
 * @param {string} userId - User ID from auth
 * @param {object} preferences - Preferences to update
 * @returns {Promise<{data, error}>}
 */
export async function updateUserPreferences(userId, preferences) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert([{ user_id: userId, ...preferences }])
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return { data: null, error };
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get conversation summary with message count
 * @param {string} userId - User ID from auth
 * @returns {Promise<{data, error}>}
 */
export async function getConversationSummaries(userId) {
  try {
    const { data, error } = await supabase
      .from('conversation_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false });
    
    return { data, error };
  } catch (error) {
    console.error('Error fetching conversation summaries:', error);
    return { data: null, error };
  }
}

/**
 * Search conversations by title or content
 * @param {string} userId - User ID from auth
 * @param {string} searchQuery - Search query
 * @returns {Promise<{data, error}>}
 */
export async function searchConversations(userId, searchQuery) {
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .ilike('title', `%${searchQuery}%`)
      .order('updated_at', { ascending: false });
    
    return { data, error };
  } catch (error) {
    console.error('Error searching conversations:', error);
    return { data: null, error };
  }
}
