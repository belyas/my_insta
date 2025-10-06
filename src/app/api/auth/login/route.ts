import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import bcrypt from 'bcryptjs';

const usersPath = path.join(process.cwd(), 'data/users.json');
const adapter = new JSONFile<{ users: any[] }>(usersPath);
const db = new Low(adapter, { users: [] });

export async function POST(req: NextRequest) {
  const body = await req.json();
  await db.read();
  db.data ||= { users: [] };
  const { username, password } = body;
  const user = db.data.users.find((u: any) => u.username === username || u.email === username);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const res = NextResponse.json({ success: true, user: { username: user.username, email: user.email } });
  res.cookies.set('user', JSON.stringify({ username: user.username, email: user.email }), { path: '/', httpOnly: false });
  return res;
}
