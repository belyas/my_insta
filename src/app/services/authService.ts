export async function login(username: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data.user;
}

export async function signup(email: string, password: string, username: string) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username })
  });
  const data = await res.json();
  
  if (!res.ok) throw new Error(data.error || 'Signup failed');

  return { username: data.user.username, email: data.user.email };
}

export async function changePassword(username: string, oldPassword: string, newPassword: string) {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, oldPassword, newPassword })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Password change failed');
  return data;
}

export async function logout() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Logout failed');
  }
}
