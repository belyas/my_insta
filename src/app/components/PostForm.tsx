import React, { useState, useRef, useEffect } from 'react';
import { usePostsStore } from '../store/postsStore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';

interface Post {
	id: string;
	username: string;
	content: string;
	createdAt: string;
	likes?: string[];
	comments?: any[];
	mediaUrl?: string;
}

interface Props {
	username: string;
	onPostSuccess?: () => void;
	post?: Post;
	mode?: 'create' | 'edit';
	onUpdate?: (content: string, media: File | null) => Promise<void>;
}

import * as postsService from '../services/postsService';

const PostForm: React.FC<Props> = ({ username, onPostSuccess, post, mode = 'create', onUpdate }) => {
	const [content, setContent] = useState(post?.content || '');
	const [media, setMedia] = useState<File | null>(null);
	const mediaInputRef = useRef<HTMLInputElement>(null);
	const { loading, error } = usePostsStore();

	useEffect(() => {
		if (mode === 'edit' && post) {
			setContent(post.content);
			setMedia(null);
			if (mediaInputRef.current) mediaInputRef.current.value = '';
		}
	}, [mode, post]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) return;
		let success = false;
		try {
			if (mode === 'edit' && post && onUpdate) {
				await onUpdate(content, media);
				success = true;
			} else {
				await postsService.addPost(content, username, media);
				success = true;
			}
		} catch (err) {
			// error handled by store or can add local error state
		}
		if (mode === 'create') {
			setContent('');
			setMedia(null);
			if (mediaInputRef.current) mediaInputRef.current.value = '';
		}
		if (success && onPostSuccess) onPostSuccess();
	};

	return (
		<Paper elevation={0} sx={{ p: 4, mb: 3, borderRadius: 3, bgcolor: '#fafafa', border: '1px solid #dbdbdb', maxWidth: 800, width: '100%', mx: 'auto' }}>
			<Box
				component="form"
				onSubmit={handleSubmit}
				display="flex"
				flexDirection="column"
				gap={2}
			>
				<TextField
					label="Write a caption..."
					multiline
					minRows={4}
					value={content}
					onChange={e => setContent(e.target.value)}
					required
					disabled={loading}
					sx={{ bgcolor: '#fff', borderRadius: 2, fontSize: 20 }}
					InputProps={{ style: { fontSize: 20, minHeight: 100 } }}
				/>
				<input
					type="file"
					accept="image/*,video/*"
					ref={mediaInputRef}
					onChange={e => setMedia(e.target.files?.[0] || null)}
					style={{ marginBottom: 12, fontSize: 16 }}
					disabled={loading}
				/>
				<Button
					type="submit"
					variant="contained"
					disabled={loading}
					sx={{ alignSelf: 'flex-end', bgcolor: '#0095f6', textTransform: 'none', fontWeight: 700, fontSize: 18, px: 4, py: 1.5 }}
				>
					{mode === 'edit' ? 'Update' : 'Post'}
				</Button>
				{error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
			</Box>
		</Paper>
	);
};

export default PostForm;