import { create } from 'zustand';
import * as notificationsService from '../services/notificationsService';

interface Notification {
  id?: string;
  username: string;
  type?: 'like' | 'comment' | 'follow' | 'custom';
  from?: string;
  postId?: string;
  text?: string;
  message?: string;
  createdAt: string;
  read?: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: (username: string) => Promise<void>;
  addNotification: (notification: Partial<Notification>) => Promise<void>;
  markAsRead?: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  fetchNotifications: async (username) => {
    set({ loading: true, error: null });
    try {
      const notifications = await notificationsService.fetchNotifications(username);
      set({ notifications, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  addNotification: async (notification) => {
    set({ loading: true, error: null });
    try {
      const newNotification = await notificationsService.addNotification(notification);
      set({ notifications: [newNotification, ...get().notifications], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  markAsRead: (id: string) => {
    set({ notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n) });
  }
}));
