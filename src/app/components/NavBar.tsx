import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const NavBar: React.FC = () => {
	const { user, logout } = useAuthStore();

	if (!user) return null;

	return (
		<nav className="navbar">
			<Link to="/feed">Feed</Link>
			<Link to="/profile">Profile</Link>
			<Link to="/social">Social</Link>
			<Link to="/messaging">Messaging</Link>
			<Link to="/notifications">Notifications</Link>
			<Link to="/search">Search</Link>
			<Link to="/groups">Groups</Link>
			<button onClick={logout}>Logout</button>
		</nav>
	);
};

export default NavBar;