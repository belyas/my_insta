import { create } from 'zustand';
import { fetchUserProfile } from '../services/profileService';

interface Profile {
  username: string;
  avatarUrl?: string;
  bio?: string;
  [key: string]: any;
}

interface ProfileStoreState {
  profiles: Record<string, Profile>;
  fetchProfile: (username: string) => Promise<Profile | undefined>;
  setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileStoreState>((set, get) => ({
  profiles: {},
  fetchProfile: async (username: string) => {
    const cached = get().profiles[username];
    if (cached) return cached;
    try {
      const profile = await fetchUserProfile(username);
      set(state => ({ profiles: { ...state.profiles, [username]: profile } }));
      return profile;
    } catch {
      return undefined;
    }
  },
  setProfile: (profile: Profile) => set(state => ({ profiles: { ...state.profiles, [profile.username]: profile } })),
}));
