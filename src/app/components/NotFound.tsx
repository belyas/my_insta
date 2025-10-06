import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const NotFound: React.FC = () => (
  <Container maxWidth="sm" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>404 - Not Found</Typography>
    <Typography variant="body1">Sorry, the page you are looking for does not exist.</Typography>
  </Container>
);

export default NotFound;
