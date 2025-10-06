import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import bcrypt from 'bcryptjs';

const usersPath = path.join(process.cwd(), 'data/users.json');
const adapter = new JSONFile<{ users: any[] }>(usersPath);
const db = new Low(adapter, { users: [] });

const profilesPath = path.join(process.cwd(), 'data/profiles.json');
const profilesAdapter = new JSONFile<{ profiles: any[] }>(profilesPath);
const profilesDb = new Low(profilesAdapter, { profiles: [] });

export async function POST(req: NextRequest) {
  const body = await req.json();
  await db.read();
  db.data ||= { users: [] };
  const { username, password, email } = body;
  if (db.data.users.find((u: any) => u.username === username
   || u.email === email )) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  db.data.users.push({ username, password: hashedPassword, email });
  await db.write();

  await profilesDb.read();
  profilesDb.data ||= { profiles: [] };
  profilesDb.data.profiles.push({ username, bio: '', avatarUrl: '' });
  await profilesDb.write();

  return NextResponse.json({ success: true });
}
