import React, { useState } from 'react';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const SocialForm: React.FC = () => {
	const { user } = useAuthStore();
	const { follow, unfollow, loading, error } = useSocialStore();
	const [target, setTarget] = useState('');

	const handleFollow = async (e: React.FormEvent) => {
		e.preventDefault();
		if (user && target) await follow(user.username, target);
		setTarget('');
	};

	const handleUnfollow = async (e: React.FormEvent) => {
		e.preventDefault();
		if (user && target) await unfollow(user.username, target);
		setTarget('');
	};

	return (
		<Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
			<TextField
				label="Username to follow/unfollow"
				value={target}
				onChange={e => setTarget(e.target.value)}
				variant="outlined"
				required
			/>
			<Box sx={{ display: 'flex', gap: 2 }}>
				<Button type="button" variant="contained" color="primary" onClick={handleFollow} disabled={loading}>
					Follow
				</Button>
				<Button type="button" variant="outlined" color="secondary" onClick={handleUnfollow} disabled={loading}>
					Unfollow
				</Button>
			</Box>
			{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
		</Box>
	);
};

export default SocialForm;