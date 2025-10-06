"use client";
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getUserFromCookie } from '../services/cookieUtils';

export default function UserHydrator() {
  const { user, setUser } = useAuthStore();
  useEffect(() => {
    if (!user) {
      const cookieUser = getUserFromCookie();
      console.log('Hydrating user from cookie:', cookieUser);
      if (cookieUser && cookieUser.username) {
        setUser(cookieUser);
      }
    }
  }, [user, setUser]);
  return null;
}
