
export async function fetchPostsByHashtag(hashtag: string) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(hashtag)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch posts by hashtag');
  return data;
}

export async function fetchPostsByUsername(username: string) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(username)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch posts by username');
  return data;
}
