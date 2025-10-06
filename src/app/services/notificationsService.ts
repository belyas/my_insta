export async function fetchNotifications(username: string) {
  const res = await fetch(`/api/notifications/${username}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
  return data;
}

export async function addNotification(notification: any) {
  const res = await fetch(`/api/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...notification, createdAt: new Date().toISOString() })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add notification');
  return data;
}
