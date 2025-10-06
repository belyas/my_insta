import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const messagesPath = path.join(process.cwd(), 'data/messages.json');
const adapter = new JSONFile<{ messages: any[] }>(messagesPath);
const db = new Low(adapter, { messages: [] });

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  await db.read();
  db.data ||= { messages: [] };
  const { conversationId } = await context.params;
  const convoMessages = db.data.messages.filter((m: any) => m.conversationId === conversationId);
  return NextResponse.json(convoMessages);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  await db.read();
  db.data ||= { messages: [] };
  const { conversationId } = await context.params; // Resolve the Promise to access `conversationId`
  const message = await req.json();
  db.data.messages.push({ ...message, conversationId });
  await db.write();
  return NextResponse.json(message);
}