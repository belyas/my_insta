import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const usersPath = path.join(process.cwd(), 'data/users.json');
const adapter = new JSONFile(usersPath);
const db = new Low(adapter, []);

export async function GET(req: NextRequest) {
  await db.read();
  db.data ||= { users: [] };

  return NextResponse.json((db.data as { users: any[] }).users || []);
}
