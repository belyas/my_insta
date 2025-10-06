"use client";
import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useConversationsStore } from '../store/conversationsStore';
import { useSocialStore } from '../store/socialStore';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { createConversation } from '../services/conversationsService';

const Conversations: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
	const { user } = useAuthStore();
	const { conversations, fetchConversations, loading, error } = useConversationsStore();
	const { followers, following, fetchFollowers, fetchFollowing } = useSocialStore();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			fetchConversations(user.username);
			fetchFollowers(user.username);
			fetchFollowing(user.username);
		}
	}, [user, fetchConversations, fetchFollowers, fetchFollowing]);

	const handleSelectConversation = (id: string) => {
		onSelect(id);
	};

	const handleCreateConversation = async (member: string) => {
		if (!user) {
			console.error('User is not defined');
			return;
		}
		try {
			const newConversation = await createConversation([user.username, member]);
			console.log('New conversation created:', newConversation);
			await fetchConversations(user.username);
			onSelect(newConversation.id);
		} catch (error) {
			console.error('Failed to create conversation:', error);
		}
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Typography variant="h5" gutterBottom>Conversations</Typography>
			{loading && <CircularProgress sx={{ my: 2 }} />}
			{error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
			<List>
				{conversations.map(conv => (
					<ListItem key={conv.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>
							{conv.isGroup ? <strong>{conv.name}</strong> : conv.members.filter((m: string) => m !== user?.username).join(', ')}
						</span>
						<Button size="small" variant="outlined" onClick={() => handleSelectConversation(conv.id)}>
							Open
						</Button>
					</ListItem>
				))}
			</List>
			<Typography variant="h6" sx={{ mt: 3 }}>Start New Conversation</Typography>
			<List>
				{[...followers, ...following].map((person, idx) => (
					<ListItem key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>{person}</span>
						<Button size="small" variant="contained" onClick={() => handleCreateConversation(person)}>
							Start
						</Button>
					</ListItem>
				))}
			</List>
		</Container>
	);
};

export default Conversations;