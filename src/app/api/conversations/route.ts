import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const conversationsPath = path.join(process.cwd(), 'data/conversations.json');
const adapter = new JSONFile<{ conversations: any[] }>(conversationsPath);
const db = new Low(adapter, { conversations: [] });

export async function POST(req: NextRequest) {
  await db.read();
  db.data ||= { conversations: [] };
  const { members, isGroup, name } = await req.json();
  const id = Date.now().toString();
  const conversation = { id, members, isGroup: !!isGroup, name: name || null, messages: [] };
  db.data.conversations.push(conversation);
  await db.write();
  return NextResponse.json(conversation);
}

export async function GET(req: NextRequest) {
  await db.read();
  db.data ||= { conversations: [] };
  const url = new URL(req.url);
  const username = url.searchParams.get('username');
  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }
  const conversations = db.data.conversations.filter((c: any) => c.members.includes(username));
  return NextResponse.json(conversations);
}