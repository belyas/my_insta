export async function getAllUsers({ excludeUsername, shouldFetchProfile }:
  {excludeUsername?: string; shouldFetchProfile?: boolean} = {}) {
  const res = await fetch('/api/users');
  let userData = await res.json();

  if (!res.ok) throw new Error(userData.error || 'Failed to fetch users');

  if (shouldFetchProfile) {
    const profiles = await Promise.all(
      userData.map(async (u: any) => {
        try {
          const profile = await fetchProfile(u.username);
          return { ...u, avatarUrl: profile.avatarUrl };
        } catch {
          return { ...u, avatarUrl: '' };
        }
      })
    );
    userData = profiles;
  }
  
  if (excludeUsername) {
    userData = userData.filter((u: any) => u.username !== excludeUsername);
  }

  return userData;
}
import { getBaseUrl } from '../utils/url';

export async function fetchProfile(username: string) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/profile/${username}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
  return data;
}

export async function updateProfile(profileUpdate: any) {
  const res = await fetch(`/api/profile/${profileUpdate.username}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileUpdate)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update profile');
  return data;
}

export async function fetchUserProfile(username: string) {
  return fetchProfile(username);
}

export async function fetchUserPosts(username: string) {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/posts?username=${username}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function uploadAvatar(username: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('username', username);
  const res = await fetch('/api/upload-avatar', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload avatar');
  return data.url;
}
