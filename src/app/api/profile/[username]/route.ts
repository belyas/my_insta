import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const profilesPath = path.join(process.cwd(), 'data/profiles.json');
const adapter = new JSONFile<{ profiles: any[] }>(profilesPath);
const db = new Low(adapter, { profiles: [] });

export async function GET(
  req: NextRequest,
  context: { params: { username: string } }
) {
  await db.read();
  db.data ||= { profiles: [] };
  const params = await context.params;
  const username = params.username;
  
  const profile = db.data.profiles.find((p: any) => p.username === username);
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  if (!('privacy' in profile)) {
    profile.privacy = 'public';
    await db.write();
  }
  return NextResponse.json(profile);
}

export async function PUT(
  req: NextRequest,
  context: { params: { username: string } }
) {
  await db.read();
  db.data ||= { profiles: [] };
  const params = await context.params;
  const username = params.username;
  const update = await req.json();
  const idx = db.data.profiles.findIndex((p: any) => p.username === username);
  if (idx === -1) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  // Only allow updating allowed fields (bio, avatarUrl, privacy, socialLinks, tags)
  const allowedFields = ['bio', 'avatarUrl', 'privacy', 'socialLinks', 'tags'];
  const updatedProfile = { ...db.data.profiles[idx] };
  for (const key of allowedFields) {
    if (update[key] !== undefined) {
      updatedProfile[key] = update[key];
    }
  }
  db.data.profiles[idx] = updatedProfile;
  await db.write();
  return NextResponse.json(db.data.profiles[idx]);
}