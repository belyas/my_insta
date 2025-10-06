import { create } from 'zustand';

interface FollowersState {
  followers: string[];
  followings: string[];
  fetchFollowers: (username: string) => Promise<void>;
}

export const useFollowersStore = create<FollowersState>((set) => ({
  followers: [],
  followings: [],
  fetchFollowers: async (username: string) => {
    const res = await fetch(`/api/social/${username}/followers/followings`);
    const data = await res.json();
    if (res.ok) {
      set({ followers: data.followers, followings: data.followings });
    } else {
      console.error('Failed to fetch followers and followings:', data.error);
    }
  },
}));