import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const usersPath = path.join(process.cwd(), 'data/users.json');
const adapter = new JSONFile<{ users: any[] }>(usersPath);
const db = new Low(adapter, { users: [] });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }
  await db.read();
  db.data ||= { users: [] };
  const exists = db.data.users.some((u: any) => u.username === username);
  return NextResponse.json({ exists });
}
