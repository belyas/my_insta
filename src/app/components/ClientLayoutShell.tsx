"use client";
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import dynamic from 'next/dynamic';

const SidebarNav = dynamic(() => import('./SidebarNav'), { ssr: true });

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user);
  const isLoggedIn = !!user;
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {isLoggedIn && <SidebarNav />}
      <main style={{
        marginLeft: pathname === '/' || isLoggedIn ? 240 : 0, 
        flex: pathname === '/' ? 0 : 1,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: pathname === '/' ? 600 : 900, padding: '32px 0' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
