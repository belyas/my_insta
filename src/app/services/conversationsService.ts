export async function fetchConversations(username: string) {
	const res = await fetch(`/api/conversations?username=${username}`);
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || 'Failed to fetch conversations');
	return data;
}

export async function createConversation(members: string[]): Promise<{ id: string }> {
  const res = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ members }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create conversation');
  return data;
}