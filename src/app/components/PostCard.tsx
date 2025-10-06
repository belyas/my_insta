import React, { useState } from "react";
import { Box, Avatar, Typography, Paper, Menu, MenuItem, TextField } from "@mui/material";
import Link from "next/link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { format } from "date-fns";
import { renderHashtags } from "./utils";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export interface PostCardProps {
  post: any;
  user?: any;
  profiles?: any;
  menuAnchorEl?: HTMLElement | null;
  menuPostId?: string | null;
  setMenuAnchorEl?: (el: HTMLElement | null) => void;
  setMenuPostId?: (id: string | null) => void;
  onDelete?: () => void;
  onUnfollow?: () => void;
  tagInputs?: { [key: string]: string };
  handleTagInputChange?: (postId: string, value: string) => void;
  handleTagUser?: (postId: string) => void;
  tagFeedback?: { [key: string]: string };
}

const ShareDialog: React.FC<{ open: boolean; onClose: () => void; postLink: string }> = ({ open, onClose, postLink }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Share Post</DialogTitle>
    <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', p: 2 }}>
      <Button
        startIcon={<FacebookIcon />}
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`, '_blank')}
        sx={{ mb: 2 }}
      >
        Share on Facebook
      </Button>
      <Button
        startIcon={<TwitterIcon />}
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postLink)}`, '_blank')}
      >
        Share on X
      </Button>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

const PostCard: React.FC<PostCardProps> = ({
  post,
  user,
  profiles = {},
  menuAnchorEl,
  menuPostId,
  setMenuAnchorEl,
  setMenuPostId,
  onDelete,
  onUnfollow,
  tagInputs = {},
  handleTagInputChange,
  handleTagUser,
  tagFeedback = {},
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const postLink = `${window.location.origin}/posts/${post.id}`;

  return (
    <Paper elevation={3} sx={{ width: user ? 800 : 600, borderRadius: 3, overflow: 'hidden', bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
        <Avatar
          src={profiles[post.username]?.avatarUrl || undefined}
          sx={{ width: 36, height: 36, mr: 2, bgcolor: '#e0e0e0', cursor: 'pointer' }}
          component={Link}
          href={`/user/${post.username}`}
        >
          {post.username[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Link href={`/user/${post.username}`} style={{ textDecoration: 'none' }}>
            <Typography variant="subtitle2" fontWeight={700} color="#262626" sx={{ lineHeight: 1, cursor: 'pointer', wordBreak: 'break-all' }}>{post.username}</Typography>
          </Link>
          <Typography variant="caption" color="#8e8e8e">{format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm')}</Typography>
        </Box>
        {user && post.username === user.username && setMenuAnchorEl && setMenuPostId && (
          <Box sx={{ ml: 'auto' }}>
            <Button
              onClick={e => {
                setMenuAnchorEl(e.currentTarget);
                setMenuPostId(post.id);
              }}
              size="small"
              sx={{ minWidth: 32, color: '#8e8e8e' }}
            >
              <MoreHorizIcon />
            </Button>
            <Menu
              anchorEl={menuAnchorEl}
              open={menuPostId === post.id && Boolean(menuAnchorEl)}
              onClose={() => { setMenuAnchorEl(null); setMenuPostId(null); }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={onDelete}>Delete</MenuItem>
              <MenuItem onClick={() => { setMenuAnchorEl(null); setMenuPostId(null); }}>Cancel</MenuItem>
            </Menu>
          </Box>
        )}
        {user && post.username !== user.username && setMenuAnchorEl && setMenuPostId && (
          <Box sx={{ ml: 'auto' }}>
            <Button
              onClick={e => {
                setMenuAnchorEl(e.currentTarget);
                setMenuPostId(post.id);
              }}
              size="small"
              sx={{ minWidth: 32, color: '#8e8e8e' }}
            >
              <MoreHorizIcon />
            </Button>
            <Menu
              anchorEl={menuAnchorEl}
              open={menuPostId === post.id && Boolean(menuAnchorEl)}
              onClose={() => { setMenuAnchorEl(null); setMenuPostId(null); }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={onUnfollow}>Unfollow</MenuItem>
              <MenuItem
                onClick={() => {
                  setShareDialogOpen(true);
                  setMenuAnchorEl(null);
                  setMenuPostId(null);
                }}
              >
                Share
              </MenuItem>
              <MenuItem onClick={() => { setMenuAnchorEl(null); setMenuPostId(null); }}>Report</MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
      {post.mediaUrl && (
        <Box sx={{ width: '100%', bgcolor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video controls style={{ width: '100%', maxHeight: 400, background: '#000' }}>
              <source src={post.mediaUrl} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={post.mediaUrl} alt="media" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', background: '#000' }} />
          )}
        </Box>
      )}
      <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
        <Typography variant="body1" sx={{ fontWeight: 400, color: '#262626', mb: 1 }}>{renderHashtags(post?.content || '')}</Typography>
        {user && post.username === user.username && handleTagInputChange && handleTagUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <TextField
              size="small"
              placeholder="Tag user..."
              value={tagInputs[post.id] || ''}
              onChange={e => handleTagInputChange(post.id, e.target.value)}
              sx={{ width: 120, bgcolor: '#fafafa', borderRadius: 2 }}
            />
            <Button size="small" variant="outlined" onClick={() => handleTagUser(post.id)} startIcon={<PersonAddAltIcon />} disabled={!tagInputs[post.id]?.trim()}>
              Tag
            </Button>
            {tagFeedback[post.id] && (
              <Typography variant="caption" color="primary">{tagFeedback[post.id]}</Typography>
            )}
          </Box>
        )}
      </Box>
      <ShareDialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} postLink={postLink} />
    </Paper>
  );
};

export default PostCard;
