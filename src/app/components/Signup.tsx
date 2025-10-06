"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { faker } from '@faker-js/faker';
import { useAuthStore } from '../store/authStore';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Logo from './Logo';


const Signup: React.FC<{ onBack: () => void }> = ({ onBack }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { signup, loading, error } = useAuthStore();
	const [username, setUsername] = useState(() => faker.person.firstName().toLowerCase() + '.' + faker.person.lastName().toLowerCase());
	const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
	const [checking, setChecking] = useState(false);
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!username) {
			setUsernameExists(null);
			return;
		}
		setChecking(true);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			try {
				const res = await fetch(`/api/auth/username-exists?username=${encodeURIComponent(username)}`);
				const data = await res.json();
				setUsernameExists(data.exists);
			} catch {
				setUsernameExists(null);
			} finally {
				setChecking(false);
			}
		}, 400);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (usernameExists) return;
		await signup(email, password, username);
		onBack();
	};

	return (
		<Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Box sx={{ width: 350 }}>
				<Box sx={{ bgcolor: '#fff', border: '1px solid #dbdbdb', borderRadius: 2, p: 4, mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
					<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
						<Logo />
					</Box>
					<Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
						<TextField
							label="Email"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
							disabled={loading}
							autoComplete="email"
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
							autoComplete="new-password"
							sx={{
								bgcolor: '#fafafa',
								'& input, & p': {
									color: "#414141", WebkitTextFillColor: "#414141!important"
								}
							}}
						/>
						<TextField
							label="Username"
							value={username}
							onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.-]/g, ''))}
							disabled={loading}
							sx={{
								bgcolor: '#fafafa',
								'& input, & p': {
									color: "#414141", WebkitTextFillColor: "#414141!important"
								}
							}}
							helperText={
								username.length === 0
									? 'Enter a username (used for profile)'
									: usernameExists === true
										? 'This username is already taken'
										: usernameExists === false
											? 'Username is available'
											: 'Checking username...'
							}
							error={!!username && usernameExists === true}
						/>
						<Button
							type="submit"
							variant="contained"
							disabled={loading || !!usernameExists || !username || !email || !password}
							sx={{
								mt: 1, bgcolor: '#0095f6', 
								fontWeight: 700, textTransform: 'none', 
								fontSize: 16, boxShadow: 'none',
								'&:hover': { bgcolor: '#1877f2' },
								'&:disabled': { bgcolor: '#a0d2fb', color: '#ffffff' }
							}}
							fullWidth
						>
							Create Account
						</Button>
						{error && <Alert severity="error">{error}</Alert>}
					</Box>
					<Divider sx={{ my: 3 }}>OR</Divider>
					<Button
						variant="text"
						fullWidth
						sx={{ color: '#0095f6', fontWeight: 700, textTransform: 'none', fontSize: 15 }}
						onClick={onBack}
						disabled={loading}
					>
						Back to Login
					</Button>
				</Box>
				<Box sx={{ textAlign: 'center', fontSize: 13, color: '#8e8e8e' }}>
					<span>© {new Date().getFullYear()} Instagram</span>
				</Box>
			</Box>
		</Box>
	);
};

export default Signup;