import React, { useState } from 'react';
import { useSearchStore } from '../store/searchStore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const SearchForm: React.FC = () => {
	const [query, setQuery] = useState('');
	const [type, setType] = useState<'user' | 'post' | 'group'>('user');
	const { search, loading, error } = useSearchStore();

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		await search(query);
	};

	return (
		<Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
			<TextField
				label="Search..."
				value={query}
				onChange={e => setQuery(e.target.value)}
				variant="outlined"
				required
			/>
			<Select
				value={type}
				onChange={e => setType(e.target.value as 'user' | 'post' | 'group')}
				variant="outlined"
			>
				<MenuItem value="user">User</MenuItem>
				<MenuItem value="post">Post</MenuItem>
				<MenuItem value="group">Group</MenuItem>
			</Select>
			<Button type="submit" variant="contained" disabled={loading}>
				Search
			</Button>
		</Box>
	);
}

export default SearchForm;