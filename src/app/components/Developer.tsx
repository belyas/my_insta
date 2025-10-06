import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Developer: React.FC = () => (
  <Container maxWidth="sm" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>Developer</Typography>
    <Typography variant="body1">This is the Developer page. Add developer info and credits here.</Typography>
  </Container>
);

export default Developer;
