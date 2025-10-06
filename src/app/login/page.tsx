import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import React from 'react';

const Feed = dynamic(() => import('@/app/components/Feed'), { ssr: true });
const Login = dynamic(() => import('@/app/components/Login'), { ssr: true });

export default async function LoginPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');
  const isLoggedIn = !!userCookie;
  
  return isLoggedIn ? <Feed /> : <Login />;
}
