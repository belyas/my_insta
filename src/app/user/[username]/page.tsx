"use client";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { fetchUserPosts, uploadAvatar } from '../../services/profileService';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAuthStore } from '../../store/authStore';
import { usePostsStore } from '../../store/postsStore';
import { useProfileStore } from '../../store/profileStore';
import { useSocialStore } from '../../store/socialStore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import { renderHashtags } from '@/app/components/utils';
import ChangePasswordForm from '@/app/components/ChangePasswordForm';

export default function UserProfilePage() {
  const authUser = useAuthStore(state => state.user);
  const router = useRouter();
  // Get username from URL params (for viewing others' profiles)
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const match = path.match(/\/user\/([^/]+)/);
  const username = match ? decodeURIComponent(match[1]) : authUser?.username;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [postAuthorAvatar, setPostAuthorAvatar] = useState<string | null>(null);
  const { likePost, unlikePost, commentPost } = usePostsStore();
  const { profiles, fetchProfile, setProfile } = useProfileStore();
  const profile = profiles[username ?? ''];
  const { following, followers, follow, unfollow, fetchFollowing, blocked, block, unblock } = useSocialStore();

  const isBlocked = authUser && blocked.some(b => b.blocker === username && b.blocked === authUser.username);
  const hasBlocked = authUser && blocked.some(b => b.blocker === authUser.username && b.blocked === username);

  useLayoutEffect(() => {
    if (!authUser) {
      router.replace('/login');
    }
  }, [authUser, router]);
  if (!username) return null;

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    (async () => {
      const p = await fetchProfile(username);
      setBioInput(p?.bio || '');
      setAvatarPreview(p?.avatarUrl || null);
      setPosts(await fetchUserPosts(username));
      setLoading(false);
    })();
  }, [username, fetchProfile]);

  useEffect(() => {
    if (avatarFile && isOwner) {
      (async () => {
        try {
          const url = await uploadAvatar(username, avatarFile);
          setAvatarPreview(url);
          setProfile({ ...profile, avatarUrl: url });
        } catch (e) {
          // Optionally handle error
        }
        setAvatarFile(null);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarFile]);

  useEffect(() => {
    if (selectedPost && selectedPost.username) {
      const cached = profiles[selectedPost.username];
      if (cached) {
        setPostAuthorAvatar(cached.avatarUrl || null);
      } else {
        fetchProfile(selectedPost.username).then(p => setPostAuthorAvatar(p?.avatarUrl || null));
      }
    }
  }, [selectedPost, profiles, fetchProfile]);

  // const followers = profile?.followers ?? [];
  // const following = profile?.following ?? [];
  const isOwner = authUser && authUser.username === username;
  const isFollowing = authUser && following.includes(username) && !isOwner;
  const [privacy, setPrivacy] = useState<'public' | 'private'>(profile?.privacy === 'private' ? 'private' : 'public');

  useEffect(() => {
    setPrivacy(profile?.privacy === 'private' ? 'private' : 'public');
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let avatarUrl = profile?.avatarUrl || null;
    // Avatar is already uploaded and preview updated
    const updated = await import('../../services/profileService').then(m => m.updateProfile({ username, bio: bioInput, avatarUrl, privacy }));
    setProfile(updated);
    setEditMode(false);
    setAvatarFile(null);
  };

  const handlePrivacyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrivacy = e.target.checked ? 'private' : 'public';
    setPrivacy(newPrivacy);
    await import('../../services/profileService').then(m => m.updateProfile({ username, bio: bioInput, avatarUrl: profile?.avatarUrl, privacy: newPrivacy }));
    setProfile({ ...profile, privacy: newPrivacy });
  };

  const isLiked = selectedPost && authUser && selectedPost.likes?.includes(authUser.username);
  const handleLike = async () => {
    if (!selectedPost || !authUser) return;
    if (isLiked) {
      await unlikePost(selectedPost.id, authUser.username);
      setSelectedPost((prev: any) => ({ ...prev, likes: prev.likes.filter((u: string) => u !== authUser.username) }));
    } else {
      await likePost(selectedPost.id, authUser.username);
      setSelectedPost((prev: any) => ({ ...prev, likes: [...(prev.likes || []), authUser.username] }));
    }
  };
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !authUser || !comment.trim()) return;
    await commentPost(selectedPost.id, authUser.username, comment);
    setSelectedPost((prev: any) => ({
      ...prev,
      comments: [...(prev.comments || []), { username: authUser.username, text: comment, createdAt: new Date().toISOString() }]
    }));
    setComment('');
  };

  if (!username) return <Box sx={{textAlign:'center',marginTop:64}}>Not logged in.</Box>;
  if (loading) return <Box sx={{textAlign:'center',marginTop:64}}>Loading...</Box>;
  if (!profile) return <Box sx={{textAlign:'center',marginTop:64}}>User not found.</Box>;
  if (isBlocked) {
    return (
      <Box sx={{textAlign:'center',marginTop:64}}>
        <Typography variant="body1" color="text.secondary">
          This profile isn't available.
        </Typography>
      </Box>
    );
  }
  if (hasBlocked) {
    return (
      <Box sx={{textAlign:'center',marginTop:64}}>
        <Typography variant="body1" color="text.secondary">
          You have blocked this user. Unblock to view their profile.
        </Typography>
        <Button variant="contained" onClick={async () => { await unblock(authUser.username, username); }}>Unblock</Button>
      </Box>
    );
  }

  const isPrivate = profile?.privacy === 'private';
  const isAllowed = isOwner || (authUser && following.includes(username));

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
        <Box sx={{ flex: '0 0 180px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Avatar src={avatarPreview || profile?.avatarUrl || undefined} sx={{ width: 150, height: 150, bgcolor: '#e0e0e0', fontSize: 64, border: '2px solid #dbdbdb' }}>{username[0]?.toUpperCase()}</Avatar>
          {isOwner && (
            <IconButton component="label" sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: '#fff', boxShadow: 1 }}>
              <PhotoCamera />
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </IconButton>
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, ml: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Typography variant="h4" fontWeight={400} sx={{ fontSize: 32, mr: 2, wordBreak: 'break-all', }}>{username}</Typography>
            {isOwner && !editMode && (
              <Button variant="outlined" size="small" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3, py: 0.5 }} onClick={() => setEditMode(true)}>Edit Profile</Button>
            )}
            {!isOwner && authUser && (
              <>
                {isFollowing ? (
                  <Button variant="contained" size="small" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3, py: 0.5 }}
                    onClick={async () => { await unfollow(authUser.username, username); await fetchFollowing(authUser.username); }}
                  >Unfollow</Button>
                ) : (
                  <Button variant="contained" size="small" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3, py: 0.5 }}
                    onClick={async () => { await follow(authUser.username, username); await fetchFollowing(authUser.username); }}
                  >Follow</Button>
                )}
                {hasBlocked ? (
                  <Button variant="outlined" color="success" size="small" onClick={async () => { await unblock(authUser.username, username); }}>
                    Unblock
                  </Button>
                ) : (
                  <Button variant="outlined" color="error" size="small" onClick={async () => { await block(authUser.username, username); }}>
                    Block
                  </Button>
                )}
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 5, mb: 2, color: '#b0b0b0ff' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, }}><span style={{ fontWeight: 700 }}>{posts.length}</span> posts</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, }}><span style={{ fontWeight: 700 }}>{followers.length}</span> followers</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, }}><span style={{ fontWeight: 700 }}>{following.length}</span> following</Typography>
          </Box>
          {isOwner && editMode ? (
            <>
            <Box component="form" onSubmit={handleProfileSave} sx={{ mb: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={<Switch checked={privacy === 'private'} onChange={handlePrivacyChange} />}
                label={privacy === 'private' ? 'Private Account' : 'Public Account'}
                sx={{ alignSelf: 'flex-start', mb: 1 }}
              />
              <textarea
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
                rows={3}
                style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8, fontSize: 16 }}
                placeholder="Your bio..."
                />
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button type="submit" variant="contained" size="small">Save</Button>
                <Button variant="outlined" size="small" onClick={() => { setEditMode(false); setBioInput(profile?.bio || ''); setAvatarPreview(profile?.avatarUrl || null); setAvatarFile(null); }}>Cancel</Button>
              </Box>
            </Box>
            <ChangePasswordForm />
            </>
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: '#b0b0b0ff' }}>{profile.bio}</Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ borderTop: '1px solid #dbdbdb', mb: 4 }} />

      {/* Private profile logic */}
      {isPrivate && !isAllowed ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            This account is private. Follow to see their posts.
          </Typography>
        </Box>
      ) : (
        <Box>
          {posts && posts.length > 0 ? (
            <Grid container spacing={0.5} columns={12}>
              {posts.map((post: any) => (
                <Grid size={4} key={post.id}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1/1',
                      bgcolor: '#fafafa',
                      overflow: 'hidden',
                      border: '1px solid #fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      filter: 'grayscale(1)',
                      transition: 'filter 0.2s',
                      '&:hover': {
                        filter: 'grayscale(0)',
                      },
                    }}
                    onClick={() => { setSelectedPost(post); setOpen(true); }}
                  >
                    {post.mediaUrl && post.mediaUrl !== '' ? (
                      <img src={post.mediaUrl} alt="media" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#eee' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <Typography variant="body2" sx={{ p: 2, textAlign: 'center', color: '#111' }}>{post.content}</Typography>
                    )}
                    {/* Centered heart and like count */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        zIndex: 2,
                      }}
                    >
                      <FavoriteIcon sx={{ color: '#fff', fontSize: 28, mr: 1 }} />
                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700 }}>{post.likes?.length || 0}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body2" color="text.secondary">No posts yet.</Typography>
            </Box>
          )}
        </Box>
      )}

      {selectedPost && (
        <Box
          sx={{
            display: open ? 'flex' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.8)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setOpen(false)}
        >
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 2,
              maxWidth: 800,
              width: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              overflow: 'hidden',
              boxShadow: 24
            }}
            onClick={e => e.stopPropagation()}
          >
            <Box sx={{ flex: 1, minWidth: 320, maxWidth: 500, bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedPost.mediaUrl ? (
                <img src={selectedPost.mediaUrl} alt="media" style={{ width: '100%', maxHeight: 500, objectFit: 'contain', background: '#000' }} />
              ) : (
                <Typography variant="body1" sx={{ color: '#fff', p: 3 }}>{renderHashtags(selectedPost.content)}</Typography>
              )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 320, p: 3, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={postAuthorAvatar || undefined} sx={{ width: 40, height: 40, mr: 2, bgcolor: '#e0e0e0' }}>{selectedPost.username[0]?.toUpperCase()}</Avatar>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#111' }}>{selectedPost.username}</Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#111', mb: 2 }}>{renderHashtags(selectedPost.content)}</Typography>
              <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                  selectedPost.comments.map((c: any, idx: number) => (
                    <Box key={idx} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#111', display: 'inline' }}>{c.username}</Typography>
                      <Typography variant="body2" sx={{ color: '#111', ml: 1, display: 'inline' }}>{c.text}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#888' }}>No comments yet.</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Button onClick={handleLike} variant={isLiked ? 'contained' : 'outlined'} color="primary" size="small">
                  {isLiked ? 'Unlike' : 'Like'}
                </Button>
                <Typography variant="body2" sx={{ color: '#111' }}>{selectedPost.likes?.length || 0} likes</Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>{selectedPost.createdAt ? new Date(selectedPost.createdAt).toLocaleString() : ''}</Typography>
              </Box>
              {authUser && (
                <Box component="form" onSubmit={handleComment} sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <input
                    type="text"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                  <Button type="submit" variant="contained" size="small" disabled={!comment.trim()}>
                    Post
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}
