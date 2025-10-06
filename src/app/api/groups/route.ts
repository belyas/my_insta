import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const groupsPath = path.join(process.cwd(), 'data/groups.json');
const adapter = new JSONFile<{ groups: any[] }>(groupsPath);
const db = new Low(adapter, { groups: [] });

export async function GET() {
  await db.read();
  db.data ||= { groups: [] };
  return NextResponse.json(db.data.groups);
}

export async function POST(req: NextRequest) {
  await db.read();
  db.data ||= { groups: [] };
  const group = await req.json();
  db.data.groups.push(group);
  await db.write();
  return NextResponse.json(group);
}

export async function PUT(req: NextRequest) {
  await db.read();
  db.data ||= { groups: [] };
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Group id required' }, { status: 400 });
  const update = await req.json();
  const idx = db.data.groups.findIndex((g: any) => g.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Group not found' }, { status: 404 });
  }
  db.data.groups[idx] = { ...db.data.groups[idx], ...update };
  await db.write();
  return NextResponse.json(db.data.groups[idx]);
}

export async function DELETE(req: NextRequest) {
  await db.read();
  db.data ||= { groups: [] };
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Group id required' }, { status: 400 });
  const idx = db.data.groups.findIndex((g: any) => g.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Group not found' }, { status: 404 });
  }
  const deleted = db.data.groups.splice(idx, 1);
  await db.write();
  return NextResponse.json(deleted[0]);
}