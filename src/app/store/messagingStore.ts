import { create } from 'zustand';
import * as messagingService from '../services/messagingService';

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
}

interface MessagingState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, sender: string, text: string) => Promise<void>;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  fetchMessages: async (conversationId) => {
    set({ loading: true, error: null });
    try {
      const messages = await messagingService.fetchMessages(conversationId);
      set({ messages, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  sendMessage: async (conversationId, sender, text) => {
    set({ loading: true, error: null });
    try {
      const message = await messagingService.sendMessage(conversationId, sender, text);
      set({ messages: [...get().messages, message], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }
}));
