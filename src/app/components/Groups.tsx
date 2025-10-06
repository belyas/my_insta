import React, { useEffect } from 'react';
import { useGroupsStore } from '../store/groupsStore';
import GroupForm from './GroupForm';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { useAuthStore } from '../store/authStore';

const Groups: React.FC = () => {
	const { groups, fetchGroups, addGroup, joinGroup, leaveGroup, loading, error } = useGroupsStore();
	const { user } = useAuthStore();
	useEffect(() => {
		fetchGroups();
	}, [fetchGroups]);

	const handleJoin = (groupId: string) => {
		if (user) joinGroup(groupId, user.username);
	};
	const handleLeave = (groupId: string) => {
		if (user) leaveGroup(groupId, user.username);
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>Groups</Typography>
			<GroupForm />
			{loading && <CircularProgress sx={{ my: 2 }} />}
			{error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
			<List>
				{groups.map((g, idx) => {
					const isMember = user && g.members.includes(user.username);
					return (
						<ListItem key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
							<Typography variant="body1">{g.name} ({g.members.length} members)</Typography>
							<Typography variant="body2" color="text.secondary">Members: {g.members.join(', ')}</Typography>
							{user && (
								isMember ? (
									<Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => handleLeave(g.id)}>
										Leave Group
									</Button>
								) : (
									<Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => handleJoin(g.id)}>
										Join Group
									</Button>
								)
							)}
						</ListItem>
					);
				})}
			</List>
		</Container>
	);
};

export default Groups;