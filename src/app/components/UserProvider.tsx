"use client";

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function UserProvider({ user, children }: { user?: any, children: React.ReactNode }) {
  const { setUser, user: storeUser } = useAuthStore();
  useEffect(() => {
    if (user) setUser(user);
    if (!user && !storeUser) {
      try {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('user='));
        if (cookie) {
          const value = decodeURIComponent(cookie.split('=')[1]);
          const parsed = JSON.parse(value);
          if (parsed && parsed.username) setUser(parsed);
        }
      } catch {}
    }
  }, [user, setUser, storeUser]);
  return <>{children}</>;
}
