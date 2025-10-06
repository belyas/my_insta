import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const connectionsPath = path.join(process.cwd(), 'data/connections.json');
const adapter = new JSONFile(connectionsPath);
const db = new Low(adapter, []);

export async function GET(req: NextRequest, { params }: { params: { userName: string } }) {
  await db.read();
  db.data ||= [];
  const userName = params.userName;

  const followers = (db.data as any[])
    .filter((c: any) => c.following === userName)
    .map((c: any) => c.follower);
  return NextResponse.json(followers);
}
