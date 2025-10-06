import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const notificationsPath = path.join(process.cwd(), 'data/notifications.json');
const adapter = new JSONFile<{ notifications: any[] }>(notificationsPath);
const db = new Low(adapter, { notifications: [] });

export async function GET(req: NextRequest, context: { params: Promise<{ username: string }> }) {
  await db.read();
  db.data ||= { notifications: [] };

  const { username } = await context.params;

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  const userNotifications = db.data.notifications.filter((n: any) => n.username === username);
  return NextResponse.json(userNotifications);
}

export async function POST(req: NextRequest) {
  await db.read();
  db.data ||= { notifications: [] };
  const notification = await req.json();
  db.data.notifications.push(notification);
  await db.write();
  return NextResponse.json(notification);
}