import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const blocksPath = path.join(process.cwd(), 'data/blocks.json');
const blocksAdapter = new JSONFile<{ blocks: any[] }>(blocksPath);
const blocksDb = new Low(blocksAdapter, { blocks: [] });

export async function POST(req: NextRequest) {
  await blocksDb.read();
  blocksDb.data ||= { blocks: [] };
  const { blocker, blocked } = await req.json();
  const idx = blocksDb.data.blocks.findIndex((b: any) => b.blocker === blocker && b.blocked === blocked);
  if (idx !== -1) {
    blocksDb.data.blocks.splice(idx, 1);
    await blocksDb.write();
  }
  return NextResponse.json({ success: true });
}
