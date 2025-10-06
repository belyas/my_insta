import { create } from 'zustand';
import * as postsService from '../services/postsService';

interface PostComment {
  username: string;
  text?: string;
  image?: string;
  createdAt: string;
}

interface Post {
  id: string;
  username: string;
  content: string;
  createdAt: string;
  likes?: string[];
  comments?: PostComment[];
  mediaUrl?: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  offset: number;
  hasMore: boolean;
  fetchPosts: () => Promise<void>;
  fetchMorePosts: () => Promise<void>;
  addPost: (content: string, username: string) => Promise<void>;
  likePost: (id: string, username: string) => Promise<void>;
  unlikePost: (id: string, username: string) => Promise<void>;
  commentPost: (id: string, username: string, text: string) => Promise<void>;
  addAdvancedCommentToPost: (postId: string, username: string, text?: string, image?: string) => Promise<void>;
  editPost: (id: string, update: Partial<Post>, media?: File) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  resetAndFetch: () => Promise<void>;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  offset: 0,
  hasMore: true,
  resetAndFetch: async () => {
    set({ posts: [], offset: 0, hasMore: true });
    await get().fetchPosts();
  },
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const posts = await postsService.fetchAllPosts(0, 10);
      set({ posts, offset: posts.length, hasMore: posts.length === 10, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchMorePosts: async () => {
    if (!get().hasMore || get().loading) return;
    set({ loading: true, error: null });
    try {
      const more = await postsService.fetchAllPosts(get().offset, 10);
      set(state => ({
        posts: [...state.posts, ...more],
        offset: state.offset + more.length,
        hasMore: more.length === 10,
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  addPost: async (content, username) => {
    set({ loading: true, error: null });
    try {
      const post = await postsService.addPost(content, username);
      set({ posts: [post, ...get().posts], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  likePost: async (id, username) => {
    set({ loading: true, error: null });
    try {
      const post = await postsService.likePost(id, username);
      set({ posts: get().posts.map(p => p.id === id ? post : p), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  unlikePost: async (id, username) => {
    set({ loading: true, error: null });
    try {
      const post = await postsService.unlikePost(id, username);
      set({ posts: get().posts.map(p => p.id === id ? post : p), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  commentPost: async (id, username, text) => {
    set({ loading: true, error: null });
    try {
      const post = await postsService.commentPost(id, username, text);
      set({ posts: get().posts.map(p => p.id === id ? post : p), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  addAdvancedCommentToPost: async (postId, username, text, image) => {
    set({ loading: true, error: null });
    try {
      // Use the advanced comment API
      const updatedPost = await import('../services/socialService').then(m => m.addAdvancedComment({ postId, username, text, image }));
      set({ posts: get().posts.map(p => p.id === postId ? updatedPost : p), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  editPost: async (id, update, media) => {
    set({ loading: true, error: null });
    try {
      const post = await postsService.editPost(id, update, media);
      set({ posts: get().posts.map(p => p.id === id ? post : p), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await postsService.deletePost(id);
      set({ posts: get().posts.filter(p => p.id !== id), loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
