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
  const { username, oldPassword, newPassword } = body;
  const user = db.data.users.find((u: any) => u.username === username);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Old password is incorrect' }, { status: 401 });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await db.write();
  return NextResponse.json({ success: true });
}
