import { create } from 'zustand';
import { getAllUsers } from '../services/profileService';

interface UserListState {
  users: any[];
  loading: boolean;
  error: string | null;
  fetchAllUsers: (username: string) => Promise<void>;
}

export const useUserListStore = create<UserListState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchAllUsers: async (username: string) => {
    set({ loading: true, error: null });
    try {
      const users = await getAllUsers({ excludeUsername: username, shouldFetchProfile: true });
      set({ users, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
