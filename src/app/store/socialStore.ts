import { create } from 'zustand';
import * as socialService from '../services/socialService';
import { useNotificationsStore } from './notificationsStore';

interface SocialConnection {
  follower: string;
  following: string;
}

interface SocialState {
  connections: SocialConnection[];
  followers: string[];
  following: string[];
  blocked: { blocker: string; blocked: string }[];
  favourites: { user: string; itemType: string; itemId: string }[];
  profileViews: { viewer: string; viewed: string; date: string }[];
  loading: boolean;
  error: string | null;
  fetchConnections: (username: string) => Promise<void>;
  fetchFollowers: (username: string) => Promise<void>;
  fetchFollowing: (username: string) => Promise<void>;
  follow: (follower: string, following: string) => Promise<void>;
  unfollow: (follower: string, following: string) => Promise<void>;
  block: (blocker: string, blocked: string) => Promise<void>;
  unblock: (blocker: string, blocked: string) => Promise<void>;
  recommend: (recommender: string, recommended: string) => Promise<void>;
  addProfileView: (viewer: string, viewed: string) => Promise<void>;
  addFavourite: (user: string, itemType: string, itemId: string) => Promise<void>;
  removeFavourite: (user: string, itemType: string, itemId: string) => Promise<void>;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  connections: [],
  followers: [],
  following: [],
  blocked: [],
  favourites: [],
  profileViews: [],
  loading: false,
  error: null,
  block: async (blocker, blocked) => {
    set({ loading: true, error: null });
    try {
      await socialService.block(blocker, blocked);
      set({ blocked: [...get().blocked, { blocker, blocked }], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  unblock: async (blocker, blocked) => {
    set({ loading: true, error: null });
    try {
      await socialService.unblock(blocker, blocked);
      set({ blocked: get().blocked.filter(b => !(b.blocker === blocker && b.blocked === blocked)), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  recommend: async (recommender, recommended) => {
    set({ loading: true, error: null });
    try {
      await socialService.recommend(recommender, recommended);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  addProfileView: async (viewer, viewed) => {
    set({ loading: true, error: null });
    try {
      await socialService.addProfileView(viewer, viewed);
      set({ profileViews: [...get().profileViews, { viewer, viewed, date: new Date().toISOString() }], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  addFavourite: async (user, itemType, itemId) => {
    set({ loading: true, error: null });
    try {
      await socialService.addFavourite(user, itemType, itemId);
      set({ favourites: [...get().favourites, { user, itemType, itemId }], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  removeFavourite: async (user, itemType, itemId) => {
    set({ loading: true, error: null });
    try {
      await socialService.removeFavourite(user, itemType, itemId);
      set({ favourites: get().favourites.filter(f => !(f.user === user && f.itemType === itemType && f.itemId === itemId)), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchConnections: async (username) => {
    set({ loading: true, error: null });
    try {
      const connections = await socialService.fetchConnections(username);
      set({ connections, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchFollowers: async (username) => {
    set({ loading: true, error: null });
    try {
      const followers = await socialService.fetchFollowers(username);
      set({ followers, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchFollowing: async (username) => {
    set({ loading: true, error: null });
    try {
      console.log('[fetchFollowing] username:', username);
      const following = await socialService.fetchFollowing(username);
      console.log('[fetchFollowing] API result:', following);
      set({ following, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  follow: async (follower, following) => {
    set({ loading: true, error: null });
    try {
      const connection = await socialService.follow(follower, following);
      set({ connections: [connection, ...get().connections], loading: false });
      await get().fetchFollowing(follower);
      useNotificationsStore.getState().addNotification({
        username: following,
        type: 'follow',
        from: follower
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  unfollow: async (follower, following) => {
    set({ loading: true, error: null });
    try {
      await socialService.unfollow(follower, following);
      set({ connections: get().connections.filter(c => !(c.follower === follower && c.following === following)), loading: false });
      await get().fetchFollowing(follower);
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }
}));
