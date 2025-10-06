import React, { useState } from 'react';
import { useGroupsStore } from '../store/groupsStore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const GroupForm: React.FC = () => {
	const { addGroup, loading, error } = useGroupsStore();
	const [name, setName] = useState('');
	const [members, setMembers] = useState('');

	const handleAddGroup = async (e: React.FormEvent) => {
		e.preventDefault();
		const membersArr = members.split(',').map(m => m.trim()).filter(Boolean);
		await addGroup(name, membersArr);
		setName('');
		setMembers('');
	};

	return (
		<Box component="form" onSubmit={handleAddGroup} sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
			<TextField
				label="Group Name"
				value={name}
				onChange={e => setName(e.target.value)}
				variant="outlined"
				required
			/>
			<TextField
				label="Members (comma separated)"
				value={members}
				onChange={e => setMembers(e.target.value)}
				variant="outlined"
				required
			/>
			<Button type="submit" variant="contained" disabled={loading}>
				Create Group
			</Button>
		</Box>
	);
}

export default GroupForm;