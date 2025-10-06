"use client";
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { useMessagingStore } from '../store/messagingStore';
import { useAuthStore } from '../store/authStore';
import MessageForm from './MessageForm';
import Conversations from './Conversations';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const Messaging: React.FC<{ conversationId: string }> = ({ conversationId }) => {
	const { user } = useAuthStore();
	const { messages, fetchMessages, loading, error } = useMessagingStore();

	useEffect(() => {
		if (conversationId) fetchMessages(conversationId);
	}, [conversationId, fetchMessages]);

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Typography variant="h6" sx={{ mt: 3 }}>Messages</Typography>
			{loading && <CircularProgress sx={{ my: 2 }} />}
			{error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
			<List>
				{messages.map((m, idx) => (
					<ListItem key={idx}>
						<Typography variant="body1"><strong>{m.sender}:</strong> {m.text}</Typography>
						<Typography variant="caption" sx={{ ml: 1 }}>{format(new Date(m.createdAt), 'yyyy-MM-dd HH:mm')}</Typography>
					</ListItem>
				))}
			</List>
		</Container>
	);
};

export default Messaging;