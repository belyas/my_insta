
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';

const BlockUnblock: React.FC = () => {
  const { user } = useAuthStore();
  const { blocked, block, unblock, loading, error } = useSocialStore();
  const [target, setTarget] = useState('');
  const [action, setAction] = useState<'block' | 'unblock'>('block');
  const [success, setSuccess] = useState<string | null>(null);

  const handleAction = async () => {
    if (!user || !target.trim()) return;
    setSuccess(null);
    try {
      if (action === 'block') {
        await block(user.username, target.trim());
        setSuccess(`Blocked ${target.trim()}`);
      } else {
        await unblock(user.username, target.trim());
        setSuccess(`Unblocked ${target.trim()}`);
      }
      setTarget('');
    } catch {}
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Block / Unblock</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Username to block/unblock"
          value={target}
          onChange={e => setTarget(e.target.value)}
          disabled={loading}
        />
        <Button
          variant={action === 'block' ? 'contained' : 'outlined'}
          onClick={() => setAction('block')}
          disabled={loading}
        >Block</Button>
        <Button
          variant={action === 'unblock' ? 'contained' : 'outlined'}
          onClick={() => setAction('unblock')}
          disabled={loading}
        >Unblock</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAction}
          disabled={loading || !target.trim()}
        >Go</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Typography variant="h6" sx={{ mt: 3 }}>Blocked Users:</Typography>
      <Box>
        {blocked.filter(b => b.blocker === user?.username).length === 0 && (
          <Typography variant="body2">No users blocked.</Typography>
        )}
        {blocked.filter(b => b.blocker === user?.username).map((b, idx) => (
          <Typography key={idx} variant="body2">{b.blocked}</Typography>
        ))}
      </Box>
    </Container>
  );
};

export default BlockUnblock;
