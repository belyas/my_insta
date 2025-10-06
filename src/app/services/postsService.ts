export async function fetchAllPosts(offset = 0, limit = 10, feed = true) {
  const res = await fetch(`/api/posts/all?offset=${offset}&limit=${limit}&feed=${feed}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch all posts');
  return data;
}
export async function editPost(id: string, update: any, media?: File | null) {
  if (media) {
    const formData = new FormData();
    if (update.content) formData.append('content', update.content);
    formData.append('media', media);
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to edit post');
    return data;
  } else {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to edit post');
    return data;
  }
}

export async function deletePost(id: string) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete post');
  return data;
}
export async function fetchPosts(offset = 0, limit = 10) {
  const res = await fetch(`/api/posts?offset=${offset}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch posts');
  return data;
}

export async function addPost(content: string, username: string, media?: File | null) {
  if (media) {
    const formData = new FormData();
    formData.append('id', Date.now().toString());
    formData.append('username', username);
    formData.append('content', content);
    formData.append('createdAt', new Date().toISOString());
    formData.append('media', media);
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add post');
    return data;
  } else {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Date.now().toString(), username, content, createdAt: new Date().toISOString() })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add post');
    return data;
  }
}

export async function likePost(id: string, username: string) {
  const res = await fetch(`/api/posts/${id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to like post');
  return data;
}

export async function commentPost(id: string, username: string, text: string) {
  const res = await fetch(`/api/posts/${id}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, text })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to comment on post');
  return data;
}

export async function unlikePost(id: string, username: string) {
  const res = await fetch(`/api/posts/${id}/unlike`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to unlike post');
  return data;
}

export async function sharePost(postId: string, username: string) {
  const res = await fetch(`/api/posts/${postId}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to share post');
  return data;
}

export async function removeShare(postId: string, username: string) {
  const res = await fetch(`/api/posts/${postId}/share`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove share from post');
  return data;
}
