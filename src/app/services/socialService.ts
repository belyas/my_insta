export async function uploadMedia({ user, type, url, filters, audio, document, location, emojis, fontSize, hashtags, mentions }: {
  user: string,
  type: string,
  url: string,
  filters?: string,
  audio?: string,
  document?: string,
  location?: string,
  emojis?: string[],
  fontSize?: string,
  hashtags?: string[],
  mentions?: string[]
}) {
  const res = await fetch(`/api/social/media-upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, type, url, filters, audio, document, location, emojis, fontSize, hashtags, mentions })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload media');
  return data;
}
export async function addAdvancedComment({ postId, username, text, image, sticker }: { postId: string, username: string, text?: string, image?: string, sticker?: string }) {
  const res = await fetch(`/api/social/comment-advanced`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, username, text, image, sticker })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add advanced comment');
  return data;
}

export async function sharePost(user: string, postId: string) {
  const res = await fetch(`/api/social/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, postId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to share post');
  return data;
}

export async function tagUser(postId: string, username: string) {
  const res = await fetch(`/api/social/tag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, username })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to tag user');
  return data;
}

export async function untagUser(postId: string, username: string) {
  const res = await fetch(`/api/social/untag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, username })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to untag user');
  return data;
}

export async function bookmarkPost(user: string, postId: string) {
  const res = await fetch(`/api/social/bookmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, postId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to bookmark post');
  return data;
}

export async function unbookmarkPost(user: string, postId: string) {
  const res = await fetch(`/api/social/unbookmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, postId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to unbookmark post');
  return data;
}
export async function addProfileView(viewer: string, viewed: string) {
  const res = await fetch(`/api/social/profile-view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ viewer, viewed })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to record profile view');
  return data;
}

export async function addFavourite(user: string, itemType: string, itemId: string) {
  const res = await fetch(`/api/social/favourite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, itemType, itemId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add favourite');
  return data;
}

export async function removeFavourite(user: string, itemType: string, itemId: string) {
  const res = await fetch(`/api/social/unfavourite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, itemType, itemId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove favourite');
  return data;
}
export async function block(blocker: string, blocked: string) {
  const res = await fetch(`/api/social/block`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocker, blocked })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to block');
  return data;
}

export async function unblock(blocker: string, blocked: string) {
  const res = await fetch(`/api/social/unblock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocker, blocked })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to unblock');
  return data;
}

export async function recommend(recommender: string, recommended: string) {
  const res = await fetch(`/api/social/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recommender, recommended })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to recommend');
  return data;
}
export async function fetchConnections(username: string) {
  const res = await fetch(`/api/social/${username}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch connections');
  return data;
}

export async function follow(follower: string, following: string) {
  const res = await fetch(`/api/social/${follower}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ follower, following })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to follow');
  return data;
}

export async function unfollow(follower: string, following: string) {
  const res = await fetch(`/api/social/${follower}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ follower, following })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to unfollow');
  return data;
}

export async function fetchFollowers(username: string) {
  const res = await fetch(`/api/social/${username}/followers`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch followers');
  return data;
}

export async function fetchFollowing(username: string) {
  const res = await fetch(`/api/social/${username}/following`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch following');
  return data;
}
