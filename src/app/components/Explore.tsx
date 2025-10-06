'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUserListStore } from '../store/userListStore';
import { useSocialStore } from '../store/socialStore';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';

const Explore: React.FC = () => {
  const { user } = useAuthStore();
  const { users, loading, fetchAllUsers } = useUserListStore();
  const { following, follow, unfollow, fetchFollowing } = useSocialStore();

  useEffect(() => {
    fetchAllUsers(user?.username || '');
  }, [user?.username]);

  useEffect(() => {
    if (user?.username) fetchFollowing(user.username);
  }, [user, fetchFollowing]);

  const handleFollow = async (username: string) => {
    if (!user) return;
    await follow(user.username, username);
    await fetchFollowing(user.username);
  };
  const handleUnfollow = async (username: string) => {
    if (!user) return;
    await unfollow(user.username, username);
    await fetchFollowing(user.username);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Explore Users</Typography>
      <List>
        {users.map(u => (
          <ListItem key={u.username} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href={`/user/${encodeURIComponent(u.username)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar src={u.avatarUrl} sx={{ mr: 2 }} />
                <Typography variant="subtitle1" fontWeight={600}>{u.username}</Typography>
              </Box>
            </Link>
            {following.includes(u.username) ? (
              <Button variant="contained" color="primary" sx={{ bgcolor: '#1976d2' }} onClick={() => handleUnfollow(u.username)}>
                Unfollow
              </Button>
            ) : (
              <Button variant="contained" color="primary" sx={{ bgcolor: '#1976d2' }} onClick={() => handleFollow(u.username)}>
                Follow
              </Button>
            )}
          </ListItem>
        ))}
      </List>
      {loading && <Typography>Loading...</Typography>}
    </Container>
  );
};

export default Explore;
