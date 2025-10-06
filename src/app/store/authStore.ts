import { create } from 'zustand';
import * as authService from '../services/authService';

export interface User {
  username: string;
  email: string;
}


export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  changePassword: (username: string, oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.login(username, password);
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  signup: async (email: string, password: string, username: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signup(email, password, username);
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  logout: async () => {
    try {
      await authService.logout();
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      });
      set({ user: null });
    } catch (err: any) {
      console.error('Logout failed:', err);
    }
  },
  changePassword: async (username: string, oldPassword: string, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.changePassword(username, oldPassword, newPassword);
      set({ loading: false });
      return response;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },
  setUser: (user: User | null) => set({ user }),
}));
