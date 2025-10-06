import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const uploadsDir = path.join(process.cwd(), 'public/uploads/avatars');
const profilesPath = path.join(process.cwd(), 'data/profiles.json');
const adapter = new JSONFile<{ profiles: any[] }>(profilesPath);
const db = new Low(adapter, { profiles: [] });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  const username = formData.get('username');
  if (!file || typeof file !== 'object' || !('arrayBuffer' in file) || !username) {
    return NextResponse.json({ error: 'Invalid file or username' }, { status: 400 });
  }
  const ext = file.name ? path.extname(file.name) : '.jpg';
  const filename = `avatar-${username}-${Date.now()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const fs = await import('fs/promises');
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, buffer);
  // Optionally update profile avatarUrl
  await db.read();
  db.data ||= { profiles: [] };
  const idx = db.data.profiles.findIndex((p: any) => p.username === username);
  if (idx !== -1) {
    db.data.profiles[idx].avatarUrl = `/uploads/avatars/${filename}`;
    await db.write();
  }
  return NextResponse.json({ url: `/uploads/avatars/${filename}` });
}
