import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const About: React.FC = () => (
  <Container maxWidth="sm" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>About</Typography>
    <Typography variant="body1">This is the About page. Add information about the app here.</Typography>
  </Container>
);

export default About;
