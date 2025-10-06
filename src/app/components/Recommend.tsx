
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';

const Recommend: React.FC = () => {
  const { user } = useAuthStore();
  const { recommend, loading, error } = useSocialStore();
  const [target, setTarget] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  const handleRecommend = async () => {
    if (!user || !target.trim()) return;
    setSuccess(null);
    try {
      await recommend(user.username, target.trim());
      setSuccess(`Recommended ${target.trim()}`);
      setTarget('');
    } catch {}
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Recommend</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Username to recommend"
          value={target}
          onChange={e => setTarget(e.target.value)}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleRecommend}
          disabled={loading || !target.trim()}
        >Recommend</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
    </Container>
  );
};

export default Recommend;
