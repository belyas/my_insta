"use client";
import Link from 'next/link';
import { useState } from 'react';
import SearchDrawer from './SearchDrawer';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import MovieIcon from '@mui/icons-material/Movie';
import SendIcon from '@mui/icons-material/Send';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname } from 'next/navigation';
import { CSSProperties, use } from 'react';
import { useAuthStore } from '../store/authStore';
import Logo from './Logo';

const navLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  fontWeight: 500,
  fontSize: 18,
  color: '#fff',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: 8,
  width: '90%',
  marginLeft: 12,
  transition: 'background 0.2s',
} as CSSProperties;

export default function SidebarNav() {
  const pathname = usePathname();
  const isFeed = pathname === "/";
  const authUser = useAuthStore(state => state.user);

  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <aside style={{ width: 240, borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '24px 0 24px 0', position: 'fixed', height: '100vh', zIndex: 10, color: "#ffffff" }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 16, fontWeight: 700, fontSize: 24, color: '#fff', textDecoration: 'none', marginBottom: 20, marginRight: 60 }}>
            <Logo />
          </Link>
          <Link href="/" style={{ ...navLinkStyle }}><HomeIcon /> Home</Link>
          <button
            type="button"
            style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon /> Search
          </button>
          <Link href="/explore" style={{ ...navLinkStyle }}><ExploreIcon /> Explore</Link>
          <Link href="/reels" style={{ ...navLinkStyle }}><MovieIcon /> Reels</Link>
          <Link href="/messages" style={{ ...navLinkStyle }}><SendIcon /> Messages</Link>
          <Link href="/notifications" style={{ ...navLinkStyle }}><NotificationsIcon /> Notifications</Link>
          {isFeed && (<a
            href="#"
            style={{ ...navLinkStyle }}
            onClick={e => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-post-dialog'));
            }}
          >
            <AddBoxIcon /> Create
          </a>)}
          {authUser?.username && (<Link href={`/user/${authUser.username}`} style={{ ...navLinkStyle }}><AccountCircleIcon /> Profile</Link>)}
          <button
            type="button"
            style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => {
              useAuthStore.getState().logout();
              window.location.href = '/login';
            }}
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
