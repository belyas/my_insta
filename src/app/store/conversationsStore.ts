import { create } from 'zustand';
import * as conversationsService from '../services/conversationsService';

interface Conversation {
  id: string;
  name: string | null;
  members: string[];
  isGroup: boolean;
}

interface ConversationsState {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  fetchConversations: (username: string) => Promise<void>;
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  conversations: [],
  loading: false,
  error: null,
  fetchConversations: async (username) => {
    set({ loading: true, error: null });
    try {
      const data = await conversationsService.fetchConversations(username);
      set({ conversations: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }
}));
