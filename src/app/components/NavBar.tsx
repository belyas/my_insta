import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../store/authStore';

const NavBar: React.FC = () => {
	const { user, logout } = useAuthStore();

	if (!user) return null;

	return (
		<nav className="navbar">
			<Link href="/feed">Feed</Link>
			<Link href="/profile">Profile</Link>
			<Link href="/social">Social</Link>
			<Link href="/messaging">Messaging</Link>
			<Link href="/notifications">Notifications</Link>
			<Link href="/search">Search</Link>
			<Link href="/groups">Groups</Link>
			<button onClick={logout}>Logout</button>
		</nav>
	);
};

export default NavBar;