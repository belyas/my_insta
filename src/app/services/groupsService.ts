export async function fetchGroups() {
  const res = await fetch('/api/groups');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch groups');
  return data;
}

export async function addGroup(name: string, members: string[]) {
  const res = await fetch('/api/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: Date.now().toString(), name, members })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add group');
  return data;
}

export async function joinGroup(groupId: string, username: string) {
  const res = await fetch(`/api/groups/${groupId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to join group');
  return data;
}

export async function leaveGroup(groupId: string, username: string) {
  const res = await fetch(`/api/groups/${groupId}/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to leave group');
  return data;
}
