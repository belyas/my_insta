
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import * as profileService from '../services/profileService';

export default function PrivacySettings() {
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Replace with actual user context
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    profileService.fetchProfile(username)
      .then(data => {
        setPrivacy(data.privacy || 'public');
      })
      .catch(() => setError('Failed to load privacy setting'))
      .finally(() => setLoading(false));
  }, [username]);

  const handleToggle = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const newPrivacy = privacy === 'public' ? 'private' : 'public';
      await profileService.updateProfile({ username, privacy: newPrivacy });
      setPrivacy(newPrivacy);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Privacy Settings</Typography>
      <FormControlLabel
        control={<Switch checked={privacy === 'private'} onChange={handleToggle} disabled={loading} />}
        label={privacy === 'private' ? 'Private Account' : 'Public Account'}
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>Privacy updated!</Alert>}
    </Container>
  );
}
