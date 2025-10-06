import React from 'react';
import { useSearchStore } from '../store/searchStore';
import SearchForm from './SearchForm';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const Search: React.FC = () => {
	const { results, loading, error } = useSearchStore();

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>Search</Typography>
			<SearchForm />
			{loading && <CircularProgress sx={{ my: 2 }} />}
			{error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
			<List>
				{results.map((r, idx) => (
					<ListItem key={idx}>
						<Typography variant="body1">{r.type}: {JSON.stringify(r.value)}</Typography>
					</ListItem>
				))}
			</List>
		</Container>
	);
};

export default Search;