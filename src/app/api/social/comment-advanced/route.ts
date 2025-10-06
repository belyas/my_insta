import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const postsPath = path.join(process.cwd(), 'data/posts.json');
const adapter = new JSONFile<{ posts: any[] }>(postsPath);
const db = new Low(adapter, { posts: [] });

export async function POST(req: NextRequest) {
  await db.read();
  db.data ||= { posts: [] };
  const { postId, username, image, text } = await req.json();
  const idx = db.data.posts.findIndex(p => p.id === postId);
  if (idx === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  const comment = {
    username,
    image,
    text: text || '',
    createdAt: new Date().toISOString(),
  };
  db.data.posts[idx].comments = db.data.posts[idx].comments || [];
  db.data.posts[idx].comments.push(comment);
  await db.write();
  return NextResponse.json(db.data.posts[idx]);
}
