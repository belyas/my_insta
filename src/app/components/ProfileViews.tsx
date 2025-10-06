
import React from 'react';
import { format } from 'date-fns';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';

const ProfileViews: React.FC = () => {
  const { user } = useAuthStore();
  const { profileViews } = useSocialStore();

  const myViews = profileViews.filter(v => v.viewed === user?.username);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Profile Views</Typography>
      <Box>
        {myViews.length === 0 && <Typography variant="body1">No one has viewed your profile yet.</Typography>}
        {myViews.map((v, idx) => (
          <Typography key={idx} variant="body2">
            {v.viewer} viewed your profile on {format(new Date(v.date), 'yyyy-MM-dd HH:mm')}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default ProfileViews;
