import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const postsPath = path.join(process.cwd(), 'data/posts.json');
const adapter = new JSONFile<{ posts: any[] }>(postsPath);
const db = new Low(adapter, { posts: [] });

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  await db.read();
  db.data ||= { posts: [] };
  const { postId } = params;
  const post = db.data.posts.find(p => p.id === postId);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const { username } = await req.json();
  post.shares = post.shares || [];
  if (post.shares.includes(username)) {
    return NextResponse.json({ error: 'Post already shared by this user' }, { status: 400 });
  }

  post.shares.push(username);
  await db.write();
  return NextResponse.json({ message: 'Post shared successfully', post });
}

export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  await db.read();
  db.data ||= { posts: [] };
  const { postId } = params;
  const post = db.data.posts.find(p => p.id === postId);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const { username } = await req.json();
  post.shares = post.shares || [];
  const shareIndex = post.shares.indexOf(username);

  if (shareIndex === -1) {
    return NextResponse.json({ error: 'Share not found for this user' }, { status: 400 });
  }

  post.shares.splice(shareIndex, 1);
  await db.write();
  return NextResponse.json({ message: 'Share removed successfully', post });
}