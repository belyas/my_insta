import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const NoSuchUserOrGroup: React.FC = () => (
  <Container maxWidth="sm" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>No Such User/Group</Typography>
    <Typography variant="body1">The user or group you are looking for does not exist.</Typography>
  </Container>
);

export default NoSuchUserOrGroup;
