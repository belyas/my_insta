"use client";
import React, { useState } from 'react';
import { useMessagingStore } from '../store/messagingStore';
import { useAuthStore } from '../store/authStore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const MessageForm: React.FC<{ conversationId: string }> = ({ conversationId }) => {
	const { user } = useAuthStore();
	const { sendMessage, loading, error } = useMessagingStore();
	const [text, setText] = useState('');

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		if (user && conversationId && text.trim()) {
			await sendMessage(conversationId, user.username, text);
			setText('');
		}
	};

	return (
		<Box component="form" onSubmit={handleSend} sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
			<TextField
				label="Type a message"
				value={text}
				onChange={e => setText(e.target.value)}
				variant="outlined"
				required
			/>
			<Button type="submit" variant="contained" disabled={loading}>
				Send
			</Button>
		</Box>
	);
};

export default MessageForm;