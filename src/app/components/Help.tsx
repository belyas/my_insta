import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Help: React.FC = () => (
  <Container maxWidth="sm" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>Help</Typography>
    <Typography variant="body1">This is the Help page. Add help and FAQ content here.</Typography>
  </Container>
);

export default Help;
