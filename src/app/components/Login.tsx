"use client";

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import Signup from './Signup';
import { useAuthStore } from '../store/authStore';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Logo from './Logo';



const Login: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showSignup, setShowSignup] = useState(false);
	const { login, loading, error, user } = useAuthStore();
	const router = useRouter();

	useLayoutEffect(() => {
		if (user) {
			router.push('/');
		}
	}, [user, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await login(username, password);
		router.push('/');
	};

	if (showSignup) {
		return <Signup onBack={() => setShowSignup(false)} />;
	}

	return (
		<Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Box sx={{ width: 350 }}>
				<Box sx={{ bgcolor: '#fff', border: '1px solid #dbdbdb', borderRadius: 2, p: 4, mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
					<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
						<Logo />
					</Box>
					<Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
						<TextField
							label="Username"
							value={username}
							onChange={e => setUsername(e.target.value)}
							required
							disabled={loading}
							autoComplete="username"
							sx={{
								bgcolor: '#fafafa',
								'& input, & p': {
									color: "#414141", WebkitTextFillColor: "#414141!important"
								}
							}}
						/>
						<TextField
							label="Password"
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
							disabled={loading}
							autoComplete="current-password"
							sx={{
								bgcolor: '#fafafa',
								'& input, & p': {
									color: "#414141", WebkitTextFillColor: "#414141!important"
								}
							}}
						/>
						<Button
							type="submit"
							variant="contained"
							disabled={loading}
							sx={{ mt: 1, bgcolor: '#0095f6', fontWeight: 700, textTransform: 'none', fontSize: 16, boxShadow: 'none', '&:hover': { bgcolor: '#1877f2' } }}
							fullWidth
						>
							Log In
						</Button>
						{error && <Alert severity="error">{error}</Alert>}
					</Box>
					<Divider sx={{ my: 3 }}>OR</Divider>
					<Button
						variant="text"
						fullWidth
						sx={{ color: '#0095f6', fontWeight: 700, textTransform: 'none', fontSize: 15 }}
						onClick={() => setShowSignup(true)}
						disabled={loading}
					>
						Create new account
					</Button>
				</Box>
				<Box sx={{ textAlign: 'center', fontSize: 13, color: '#8e8e8e' }}>
					<span>© {new Date().getFullYear()} Instagram</span>
				</Box>
			</Box>
		</Box>
	);
};

export default Login;