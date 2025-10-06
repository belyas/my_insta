import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const conversationsPath = path.join(process.cwd(), 'data/conversations.json');
const adapter = new JSONFile<{ conversations: any[] }>(conversationsPath);
const db = new Low(adapter, { conversations: [] });

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.read();
  db.data ||= { conversations: [] };
  const { id } = params;
  const { sender, text, media } = await req.json();
  const conversation = db.data.conversations.find((c: any) => c.id === id);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  const message = { sender, text, media: media || null, timestamp: Date.now() };
  conversation.messages.push(message);
  await db.write();
  return NextResponse.json(message);
}