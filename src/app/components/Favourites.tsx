
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';

const Favourites: React.FC = () => {
  const { user } = useAuthStore();
  const { favourites } = useSocialStore();

  const myFavourites = favourites.filter(f => f.user === user?.username);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Favourites</Typography>
      <Box>
        {myFavourites.length === 0 && <Typography variant="body1">No favourites yet.</Typography>}
        {myFavourites.map((f, idx) => (
          <Typography key={idx} variant="body2">
            {f.itemType} - {f.itemId}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default Favourites;
