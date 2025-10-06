"use client";
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { useNotificationsStore } from '../store/notificationsStore';
import { useAuthStore } from '../store/authStore';
import NotificationForm from './NotificationForm';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';

const Notifications: React.FC = () => {
	const { user } = useAuthStore();
	const { notifications, fetchNotifications, loading, error, markAsRead } = useNotificationsStore();
	const [readIds, setReadIds] = React.useState<Set<string>>(new Set());

	useEffect(() => {
		if (user) fetchNotifications(user.username);
	}, [user, fetchNotifications]);

	const handleMarkAsRead = (id: string) => {
		setReadIds(prev => new Set(prev).add(id));
		if (markAsRead) markAsRead(id);
	};

	const renderNotification = (n: any) => {
		if (n.type === 'like') {
			return <span><strong>{n.from}</strong> liked your post{n.postId ? ` (${n.postId})` : ''}.</span>;
		}
		if (n.type === 'comment') {
			return <span><strong>{n.from}</strong> commented: "{n.text}" on your post{n.postId ? ` (${n.postId})` : ''}.</span>;
		}
		if (n.type === 'follow') {
			return <span><strong>{n.from}</strong> started following you.</span>;
		}
		// fallback for custom or legacy notifications
		return <span>{n.message || JSON.stringify(n)}</span>;
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>Notifications</Typography>
			{/* <NotificationForm /> */}
			{loading && <CircularProgress sx={{ my: 2 }} />}
			{error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
			<List>
				{notifications.map((n, idx) => {
					const id = n.id || String(idx);
					const isRead = readIds.has(id);
					return (
						<ListItem key={id} sx={{ bgcolor: isRead ? 'background.paper' : 'rgba(25, 118, 210, 0.08)' }}>
							<Checkbox checked={isRead} onChange={() => handleMarkAsRead(id)} />
							<Typography variant="body1" fontWeight={isRead ? 'normal' : 'bold'}>{renderNotification(n)}</Typography>
							<Typography variant="caption" sx={{ ml: 1 }}>{format(new Date(n.createdAt), 'yyyy-MM-dd HH:mm')}</Typography>
						</ListItem>
					);
				})}
			</List>
		</Container>
	);
};

export default Notifications;