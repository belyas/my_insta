"use client";
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import CommentImageInput from './CommentImageInput';
import { sharePost, tagUser, untagUser, bookmarkPost, unbookmarkPost, fetchFollowing, unfollow } from '../services/socialService';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LinkIcon from '@mui/icons-material/Link';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ShareIcon from '@mui/icons-material/Share';
import { usePostsStore } from '../store/postsStore';
import { useAuthStore } from '../store/authStore';
import PostForm from './PostForm';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import { renderHashtags } from './utils';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useProfileStore } from '../store/profileStore';
import Logo from './Logo';
import { useUserListStore } from '../store/userListStore';
import { useSocialStore } from '../store/socialStore';

const Feed: React.FC = () => {
	const { posts, fetchPosts, fetchMorePosts, loading, error, 
		likePost, unlikePost, commentPost, 
		addAdvancedCommentToPost, hasMore, resetAndFetch } = usePostsStore();
	const { user } = useAuthStore();
	const { profiles, fetchProfile } = useProfileStore();
	const { users, fetchAllUsers } = useUserListStore();
	const { following, fetchFollowing: fetchUserFollowing, follow, unfollow } = useSocialStore();
	const [followingState, setFollowingState] = React.useState<string[]>([]);
	const [commentInputs, setCommentInputs] = React.useState<{ [key: string]: string }>({});
	const [commentImages, setCommentImages] = React.useState<{ [key: string]: string | null }>({});
	const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
	const [editContent, setEditContent] = React.useState('');
	const [deletePostId, setDeletePostId] = React.useState<string | null>(null);
	const [shareFeedback, setShareFeedback] = React.useState<{ [key: string]: string }>({});
	const [tagInputs, setTagInputs] = React.useState<{ [key: string]: string }>({});
	const [taggedUsers, setTaggedUsers] = React.useState<{ [key: string]: string[] }>({});
	const [tagFeedback, setTagFeedback] = React.useState<{ [key: string]: string }>({});
	const [bookmarkState, setBookmarkState] = React.useState<{ [key: string]: boolean }>({});
	const [bookmarkFeedback, setBookmarkFeedback] = React.useState<{ [key: string]: string }>({});
	const [copyFeedback, setCopyFeedback] = React.useState<{ [key: string]: string }>({});
	const [postDialogOpen, setPostDialogOpen] = React.useState(false);

	const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
	const [menuPostId, setMenuPostId] = React.useState<string | null>(null);

	useEffect(() => {
		if (user?.username) {
			fetchFollowing(user.username)
				.then(f => setFollowingState(Array.isArray(f) ? f : []))
				.catch(() => setFollowingState([]));
		} else {
			setFollowingState([]);
		}
	}, [user]);

	const handlePostSuccess = async () => {
		setPostDialogOpen(false);
		await resetAndFetch();
	};

	useEffect(() => {
		const handler = () => setPostDialogOpen(true);
		window.addEventListener('open-post-dialog', handler);

		return () => window.removeEventListener('open-post-dialog', handler);
	}, []);

	const handleBookmark = async (postId: string) => {
		if (!user) return;
		try {
			await bookmarkPost(user.username, postId);
			setBookmarkState(bm => ({ ...bm, [postId]: true }));
			setBookmarkFeedback(fb => ({ ...fb, [postId]: 'Bookmarked!' }));
			setTimeout(() => setBookmarkFeedback(fb => ({ ...fb, [postId]: '' })), 1500);
		} catch (e) {
			setBookmarkFeedback(fb => ({ ...fb, [postId]: 'Error' }));
		}
	};

	const handleUnbookmark = async (postId: string) => {
		if (!user) return;
		try {
			await unbookmarkPost(user.username, postId);
			setBookmarkState(bm => ({ ...bm, [postId]: false }));
			setBookmarkFeedback(fb => ({ ...fb, [postId]: 'Removed' }));
			setTimeout(() => setBookmarkFeedback(fb => ({ ...fb, [postId]: '' })), 1500);
		} catch (e) {
			setBookmarkFeedback(fb => ({ ...fb, [postId]: 'Error' }));
		}
	};

	const handleCopyLink = (postId: string) => {
		const url = `${window.location.origin}/posts/${postId}`;
		navigator.clipboard.writeText(url);
		setCopyFeedback(fb => ({ ...fb, [postId]: 'Copied!' }));
		setTimeout(() => setCopyFeedback(fb => ({ ...fb, [postId]: '' })), 1500);
	};

	// Simulate fetching tagged users per post (in real app, fetch from backend)
	useEffect(() => {
		// For demo, initialize taggedUsers as empty for each post
		setTaggedUsers(posts.reduce((acc, post) => ({ ...acc, [post.id]: [] }), {}));
	}, [posts.length]);

	const handleTagInputChange = (postId: string, value: string) => {
		setTagInputs(inputs => ({ ...inputs, [postId]: value }));
	};

	const handleTagUser = async (postId: string) => {
		const username = tagInputs[postId]?.trim();
		if (!username) return;
		try {
			await tagUser(postId, username);
			setTaggedUsers(users => ({ ...users, [postId]: [...(users[postId] || []), username] }));
			setTagFeedback(fb => ({ ...fb, [postId]: `Tagged ${username}` }));
			setTagInputs(inputs => ({ ...inputs, [postId]: '' }));
			setTimeout(() => setTagFeedback(fb => ({ ...fb, [postId]: '' })), 1500);
		} catch (e) {
			setTagFeedback(fb => ({ ...fb, [postId]: 'Error tagging' }));
		}
	};

	const handleUntagUser = async (postId: string, username: string) => {
		try {
			await untagUser(postId, username);
			setTaggedUsers(users => ({ ...users, [postId]: (users[postId] || []).filter(u => u !== username) }));
		} catch (e) {
			// Optionally show error
		}
	};
	const handleShare = async (postId: string) => {
		if (!user) return;
		try {
			await sharePost(user.username, postId);
			setShareFeedback(fb => ({ ...fb, [postId]: 'Shared!' }));
			setTimeout(() => setShareFeedback(fb => ({ ...fb, [postId]: '' })), 1500);
		} catch (e) {
			setShareFeedback(fb => ({ ...fb, [postId]: 'Error sharing' }));
		}
	};

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	useEffect(() => {
		const handleScroll = () => {
			if (loading || !hasMore) return;
			const scrollY = window.scrollY || window.pageYOffset;
			const windowHeight = window.innerHeight;
			const docHeight = document.documentElement.scrollHeight;
			if (docHeight - (scrollY + windowHeight) < 300) {
				fetchMorePosts();
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [fetchMorePosts, loading, hasMore]);

	const handleLike = async (postId: string) => {
		if (user) await likePost(postId, user.username);
	};
	const handleUnlike = async (postId: string) => {
		if (user) await unlikePost(postId, user.username);
	};

	const handleCommentChange = (postId: string, value: string) => {
		setCommentInputs(inputs => ({ ...inputs, [postId]: value }));
	};

	const handleCommentImage = (postId: string, imageDataUrl: string) => {
		setCommentImages(images => ({ ...images, [postId]: imageDataUrl }));
	};

	const handleComment = async (postId: string) => {
		if (user && (commentInputs[postId]?.trim() || commentImages[postId])) {
			// Use advanced comment if image is present
			if (commentImages[postId]) {
				await addAdvancedCommentToPost(postId, user.username, commentInputs[postId], commentImages[postId]);
				setCommentImages(images => ({ ...images, [postId]: null }));
			} else {
				await commentPost(postId, user.username, commentInputs[postId]);
			}
			setCommentInputs(inputs => ({ ...inputs, [postId]: '' }));
		}
	};

	const handleEdit = (postId: string, content: string) => {
		setEditingPostId(postId);
		setEditContent(content);
	};
	const handleEditSave = async (postId: string) => {
		if (editContent.trim()) {
			await usePostsStore.getState().editPost(postId, { content: editContent });
			setEditingPostId(null);
			setEditContent('');
		}
	};
	const handleDelete = async (postId: string) => {
		await usePostsStore.getState().deletePost(postId);
		setDeletePostId(null);
	};

	const handleFollow = async (username: string) => {
    if (!user) return;
    await follow(user.username, username);

		try {
    const respo = await fetchFollowing(user.username);
		setFollowingState(Array.isArray(respo) ? respo : []);
  } catch (error) {
    console.error('Error fetching following:', error);
  }
  };
  const handleUnfollow = async (username: string) => {
    if (!user) return;
    await unfollow(user.username, username);

		try {
		const respo = await fetchFollowing(user.username);
		setFollowingState(Array.isArray(respo) ? respo : []);
	} catch (error) {
		console.error('Error fetching following:', error);
	}
  };

	useEffect(() => {
		const missing = Array.from(new Set(posts.map(p => p.username))).filter(u => u && !profiles[u]);
		missing.forEach(u => fetchProfile(u));
	}, [posts, profiles, fetchProfile]);

	useEffect(() => {
		fetchAllUsers(user?.username || '');
		fetchUserFollowing(user?.username || '');
	}, []);

	return (
		<Container maxWidth={false} sx={{ mt: 4, mb: 4, width: 500, maxWidth: '100%' }}>
			<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
				<Logo />
			</Box>

			<Dialog open={postDialogOpen} onClose={() => setPostDialogOpen(false)}>
				<DialogTitle>Create Post</DialogTitle>
				<DialogContent>
				{user ? <PostForm username={user.username} onPostSuccess={handlePostSuccess} /> : <div>Please log in to create a post.</div>}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setPostDialogOpen(false)}>Close</Button>
				</DialogActions>
			</Dialog>

			{loading && <CircularProgress sx={{ my: 2 }} />}
			{error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

			<Box sx={{ display: 'flex', gap: 2 }}>
				<List sx={{ p: 0, flex: 1 }}>
					{posts?.length > 0 ? 
						posts
						.map(post => (
							<ListItem key={post.id} alignItems="flex-start" sx={{ p: 0, mb: 4, justifyContent: 'center' }}>
								<Paper elevation={3} sx={{ width: user ? 800 : 400, borderRadius: 3, overflow: 'hidden', bgcolor: '#fff' }}>
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
										{user && post.username === user.username ? (
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
													<MenuItem
														onClick={() => {
															setDeletePostId(post.id);
															setMenuAnchorEl(null);
															setMenuPostId(null);
														}}
													>
														Delete
													</MenuItem>
													<MenuItem
														onClick={() => {
															setMenuAnchorEl(null);
															setMenuPostId(null);
														}}
													>
														Cancel
													</MenuItem>
												</Menu>
											</Box>
										) : user && post.username !== user.username ? (
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
													<MenuItem
														onClick={async () => {
															if (user && post.username) {
																await unfollow(user.username, post.username);
																setFollowingState(f => f.filter(u => u !== post.username));
																// Hide all posts by the unfollowed user
																usePostsStore.setState(state => ({
																	posts: state.posts.filter(p => p.username !== post.username)
																}));
																setMenuAnchorEl(null);
																setMenuPostId(null);
															}
														}}
													>
														Unfollow
													</MenuItem>
													<MenuItem
														onClick={() => {
															setMenuAnchorEl(null);
															setMenuPostId(null);
															alert('Report functionality coming soon!');
														}}
													>
														Report
													</MenuItem>
												</Menu>
											</Box>
										) : null}
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
									<Typography variant="body1" sx={{ fontWeight: 400, color: '#262626', mb: 1 }}>{renderHashtags(post.content)}</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>

										{user && post.username === user.username && (
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

									{taggedUsers[post.id]?.length > 0 && (
										<Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
											{taggedUsers[post.id].map(username => (
												<Box key={username} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f0f0f0', px: 1, py: 0.5, borderRadius: 2 }}>
													<Typography variant="body2" sx={{ fontWeight: 500, color: '#1976d2', mr: 0.5 }}>@{username}</Typography>
													{user && post.username === user.username && (
														<Button size="small" onClick={() => handleUntagUser(post.id, username)} sx={{ minWidth: 24, color: '#ed4956' }}><PersonRemoveIcon fontSize="small" /></Button>
													)}
												</Box>
											))}
										</Box>
									)}
															{user && post.likes?.includes(user.username) ? (
																<Button size="small" sx={{ minWidth: 32, color: '#ed4956' }} onClick={() => handleUnlike(post.id)}><FavoriteIcon /></Button>
															) : (
																<Button size="small" sx={{ minWidth: 32, color: '#262626' }} onClick={() => handleLike(post.id)} disabled={!user}><FavoriteBorderIcon /></Button>
															)}
																				<Button size="small" sx={{ minWidth: 32, color: '#262626' }} onClick={() => handleShare(post.id)} disabled={!user}><ShareIcon /></Button>
																				<Button size="small" sx={{ minWidth: 32, color: '#262626' }} onClick={() => handleCopyLink(post.id)}><LinkIcon /></Button>
																				{copyFeedback[post.id] && (
																					<Typography variant="caption" color="primary">{copyFeedback[post.id]}</Typography>
																				)}
																				{bookmarkState[post.id] ? (
																					<Button size="small" sx={{ minWidth: 32, color: '#1976d2' }} onClick={() => handleUnbookmark(post.id)}><BookmarkIcon /></Button>
																				) : (
																					<Button size="small" sx={{ minWidth: 32, color: '#262626' }} onClick={() => handleBookmark(post.id)}><BookmarkBorderIcon /></Button>
																				)}
																				{bookmarkFeedback[post.id] && (
																					<Typography variant="caption" color="primary">{bookmarkFeedback[post.id]}</Typography>
																				)}
									<Typography variant="body2" color="#262626" sx={{ fontWeight: 500 }}>{post.likes?.length || 0} likes</Typography>
									<Button size="small" sx={{ minWidth: 32, color: '#262626' }}><ModeCommentOutlinedIcon /></Button>
									{user && post.username === user.username && (
										<Button size="small" sx={{ minWidth: 32, color: '#262626' }} onClick={() => handleEdit(post.id, post.content)}>Edit</Button>
									)}
								</Box>
							</Box>
							<Dialog open={editingPostId === post.id} onClose={() => setEditingPostId(null)}>
								<DialogTitle>Edit Post</DialogTitle>
								<DialogContent>
									{user ? (
										<PostForm
											username={user.username}
											post={post}
											mode="edit"
											onUpdate={async (content, media) => {
												await usePostsStore.getState().editPost(post.id, { content }, media ?? undefined);
												setEditingPostId(null);
												setEditContent('');
											}}
										/>
									) : (
										<div>Please log in to edit a post.</div>
									)}
								</DialogContent>
								<DialogActions>
									<Button onClick={() => setEditingPostId(null)}>Cancel</Button>
								</DialogActions>
							</Dialog>
							<Dialog open={deletePostId === post.id} onClose={() => setDeletePostId(null)}>
								<DialogTitle>Delete Post</DialogTitle>
								<DialogContent>
									<Typography>Are you sure you want to delete this post?</Typography>
								</DialogContent>
								<DialogActions>
									<Button onClick={() => setDeletePostId(null)}>Cancel</Button>
									<Button onClick={() => handleDelete(post.id)} color="error" variant="contained">Delete</Button>
								</DialogActions>
							</Dialog>
							<Box sx={{ px: 2, pb: 2, pt: 0 }}>
								<Typography variant="subtitle2" sx={{ color: '#8e8e8e', fontWeight: 500, mb: 0.5 }}>Comments</Typography>
											<List dense sx={{ p: 0 }}>
												{post.comments?.map((c, idx) => (
													<ListItem key={idx} sx={{ pl: 0, py: 0.5, alignItems: 'flex-start' }}>
														<Box sx={{ display: 'flex', flexDirection: 'column' }}>
															<Typography variant="body2" sx={{ fontWeight: 500, color: '#262626' }}>
																<span style={{ fontWeight: 700 }}>{c.username}</span>
																{c.text && <> {c.text}</>}
																						<span style={{ color: '#8e8e8e', fontSize: 12 }}> ({format(new Date(c.createdAt), 'yyyy-MM-dd HH:mm')})</span>
															</Typography>
															{c.image && (
																<Box sx={{ mt: 0.5 }}>
																	<img src={c.image} alt="comment-img" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
																</Box>
															)}
														</Box>
													</ListItem>
												))}
											</List>
								{user && (
												<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
													<Box sx={{ display: 'flex', gap: 1 }}>
														<TextField
															size="small"
															placeholder="Add a comment..."
															value={commentInputs[post.id] || ''}
															onChange={e => handleCommentChange(post.id, e.target.value)}
															sx={{ flex: 1, bgcolor: '#fafafa', borderRadius: 2 }}
														/>
														<CommentImageInput onImageSelect={img => handleCommentImage(post.id, img)} />
														<Button
															size="small"
															variant="contained"
															sx={{ bgcolor: '#0095f6', textTransform: 'none', fontWeight: 700 }}
															onClick={() => handleComment(post.id)}
															disabled={!(commentInputs[post.id]?.trim() || commentImages[post.id])}
														>
															Post
														</Button>
													</Box>
													{commentImages[post.id] && (
														<Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
															<img src={commentImages[post.id] || ''} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
															<Button size="small" onClick={() => handleCommentImage(post.id, '')}>Remove</Button>
														</Box>
													)}
												</Box>
								)}
							</Box>
						</Paper>
					</ListItem>
				)) : (
					<Typography variant="body1" sx={{ textAlign: 'center', mt: 4, color: '#8e8e8e' }}>
						{user ? 'No posts from users you follow. Start following others to see their posts!' : 'No posts available. Please log in to see posts from users you follow.'}
					</Typography>
				)}
				</List>

				{user && (<Box sx={{ width: 300, borderRadius: 2 }}>
					<Typography variant="h6" gutterBottom>Suggested for You</Typography>
					<List>
						{users.slice(0, 5).map(user => (
							<ListItem key={user.username} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pl: 0 }}>
								<Link href={`/user/${user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Avatar src={user.avatarUrl} sx={{ mr: 2 }} />
										<Typography variant="subtitle1" fontWeight={600}>{user.username}</Typography>
									</Box>
								</Link>
								{followingState.includes(user.username) ? (
									<Button variant="outlined" size="small" onClick={() => handleUnfollow(user.username)}>Unfollow</Button>
								) : (
									<Button variant="contained" size="small" onClick={() => handleFollow(user.username)}>Follow</Button>
								)}
							</ListItem>
						))}
					</List>
				</Box>)}
			</Box>
		</Container>
	);
};

export default Feed;