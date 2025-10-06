import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const ChangePasswordForm: React.FC = () => {
  const { user, changePassword, loading } = useAuthStore();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      const response = await changePassword(user.username, oldPassword, newPassword);

      if (response.error) {
        setError(response.error || 'Failed to change password');
        return;
      }

      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2} mt={3}>
      <TextField
        label="Current Password"
        type="password"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
        required
        disabled={loading}
      />
      <TextField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
        disabled={loading}
      />
      <TextField
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        disabled={loading}
      />
      <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 1 }}>
        Change Password
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Password changed successfully!</Alert>}
    </Box>
  );
};

export default ChangePasswordForm;
