import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const notificationsPath = path.join(process.cwd(), 'data/notifications.json');
const adapter = new JSONFile<{ notifications: any[] }>(notificationsPath);
const db = new Low(adapter, { notifications: [] });

export async function POST(req: NextRequest) {
  await db.read();
  db.data ||= { notifications: [] };
  const notification = await req.json();
  db.data.notifications.push(notification);
  await db.write();
  return NextResponse.json(notification);
}