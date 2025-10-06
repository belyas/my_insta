export async function fetchMessages(conversationId: string) {
  const res = await fetch(`/api/messaging/${conversationId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch messages');
  return data;
}

export async function sendMessage(conversationId: string, sender: string, text: string) {
  const res = await fetch(`/api/messaging/${conversationId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, text, createdAt: new Date().toISOString() })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}
