import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const postsPath = path.join(process.cwd(), 'data/posts.json');
const adapter = new JSONFile<{ posts: any[] }>(postsPath);
const db = new Low(adapter, { posts: [] });

export async function POST(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  await db.read();
  db.data ||= { posts: [] };
  const { postId } = await params;
  const { username } = await req.json();
  const post = db.data.posts.find((p: any) => p.id === postId);
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  if (!post.likes) post.likes = [];
  post.likes = post.likes.filter((u: string) => u !== username);
  await db.write();
  return NextResponse.json(post);
}
