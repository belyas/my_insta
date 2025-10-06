import { create } from 'zustand';
import * as searchService from '../services/searchService';

interface SearchResult {
  id: string;
  value: any;
}

interface SearchState {
  results: any[];
  loading: boolean;
  error: string | null;
  search: (q: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  loading: false,
  error: null,
  search: async (q) => {
    set({ loading: true, error: null });
    try {
      let results = [];
      if (q.startsWith('#')) {
        results = await searchService.fetchPostsByHashtag(q);
      } else {
        results = await searchService.fetchPostsByUsername(q);
      }
      set({ results, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }
}));
