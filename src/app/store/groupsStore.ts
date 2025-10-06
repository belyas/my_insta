import { create } from 'zustand';
import * as groupsService from '../services/groupsService';

interface Group {
  id: string;
  name: string;
  members: string[];
}

interface GroupsState {
  groups: Group[];
  loading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  addGroup: (name: string, members: string[]) => Promise<void>;
  joinGroup: (groupId: string, username: string) => Promise<void>;
  leaveGroup: (groupId: string, username: string) => Promise<void>;
}

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: [],
  loading: false,
  error: null,
  fetchGroups: async () => {
    set({ loading: true, error: null });
    try {
      const groups = await groupsService.fetchGroups();
      set({ groups, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  addGroup: async (name, members) => {
    set({ loading: true, error: null });
    try {
      const group = await groupsService.addGroup(name, members);
      set({ groups: [group, ...get().groups], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  joinGroup: async (groupId, username) => {
    set({ loading: true, error: null });
    try {
      const group = await groupsService.joinGroup(groupId, username);
      set({ groups: get().groups.map(g => g.id === groupId ? group : g), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  leaveGroup: async (groupId, username) => {
    set({ loading: true, error: null });
    try {
      const group = await groupsService.leaveGroup(groupId, username);
      set({ groups: get().groups.map(g => g.id === groupId ? group : g), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }
}));
