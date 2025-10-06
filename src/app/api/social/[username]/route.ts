import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const connectionsPath = path.join(process.cwd(), 'data/connections.json');
const adapter = new JSONFile(connectionsPath);
const db = new Low(adapter, []);

export async function POST(req: NextRequest, { params }: { params: { userName: string } }) {
  await db.read();
  db.data ||= [];
  const { follower, following } = await req.json();
  if (!follower || !following) {
    return NextResponse.json({ error: 'Missing follower or following' }, { status: 400 });
  }
  // Prevent duplicate
  if ((db.data as any[]).some((c: any) => c.follower === follower && c.following === following)) {
    return NextResponse.json({ error: 'Already following' }, { status: 409 });
  }
  (db.data as any[]).push({ follower, following });
  await db.write();
  return NextResponse.json({ follower, following });
}

export async function DELETE(req: NextRequest, { params }: { params: { userName: string } }) {
  await db.read();
  db.data ||= [];
  const { follower, following } = await req.json();
  if (!follower || !following) {
    return NextResponse.json({ error: 'Missing follower or following' }, { status: 400 });
  }
  const before = (db.data as any[]).length;
  db.data = (db.data as any[]).filter((c: any) => !(c.follower === follower && c.following === following));
  await db.write();
  if ((db.data as any[]).length === before) {
    return NextResponse.json({ error: 'Not following' }, { status: 404 });
  }
  return NextResponse.json({ follower, following, unfollowed: true });
}
