import React, { useEffect } from 'react';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import SocialForm from './SocialForm';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const Social: React.FC = () => {
	const { user } = useAuthStore();
	const { connections, followers, following, fetchConnections, fetchFollowers, fetchFollowing, follow, unfollow, loading, error } = useSocialStore();
	const [target, setTarget] = React.useState('');

	useEffect(() => {
		if (user) {
			fetchConnections(user.username);
			fetchFollowers(user.username);
			fetchFollowing(user.username);
		}
	}, [user, fetchConnections, fetchFollowers, fetchFollowing]);

	const handleFollow = () => {
		if (user && target.trim()) {
			follow(user.username, target.trim());
			setTarget('');
		}
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>Social Connections</Typography>
			<SocialForm />
			<Typography variant="h6" sx={{ mt: 3 }}>Followers</Typography>
			<List>
				{followers.map((f, idx) => (
					<ListItem key={idx}>{f}</ListItem>
				))}
			</List>
			<Typography variant="h6" sx={{ mt: 3 }}>Following</Typography>
			<List>
				{following.map((f, idx) => (
					<ListItem key={idx}>{f}</ListItem>
				))}
			</List>
			<Typography variant="h6" sx={{ mt: 3 }}>Follow a user</Typography>
			<form onSubmit={e => { e.preventDefault(); handleFollow(); }}>
				<input
					type="text"
					placeholder="Username to follow"
					value={target}
					onChange={e => setTarget(e.target.value)}
					disabled={loading}
				/>
				<Button type="submit" variant="contained" disabled={loading || !target.trim()} sx={{ ml: 2 }}>
					Follow
				</Button>
			</form>
			{loading && <CircularProgress sx={{ my: 2 }} />}
			{error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
			<Typography variant="h6" sx={{ mt: 3 }}>All Connections</Typography>
			<List>
				{connections.map((c, idx) => (
					<ListItem key={idx}>{c.follower} follows {c.following}</ListItem>
				))}
			</List>
		</Container>
	);
};

export default Social;