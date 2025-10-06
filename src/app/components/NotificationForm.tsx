import React, { useState } from 'react';
import { useNotificationsStore } from '../store/notificationsStore';
import { useAuthStore } from '../store/authStore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const NotificationForm: React.FC = () => {
	const { user } = useAuthStore();
	const { addNotification, loading, error } = useNotificationsStore();
	const [message, setMessage] = useState('');

	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault();
		if (user && message.trim()) {
			await addNotification({ username: user.username, message});
			setMessage('');
		}
	};

	return (
		<Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
			<TextField
				label="Notification message"
				value={message}
				onChange={e => setMessage(e.target.value)}
				variant="outlined"
				required
			/>
			<Button type="submit" variant="contained" disabled={loading}>
				Add Notification
			</Button>
			{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
		</Box>
	);
};

export default NotificationForm;