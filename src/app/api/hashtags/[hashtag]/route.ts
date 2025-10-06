import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { JSONFile } from 'lowdb/node';
import { Low } from 'lowdb';

const postsPath = path.join(process.cwd(), 'data/posts.json');
const adapter = new JSONFile<{ posts: any[] }>(postsPath);
const db = new Low(adapter, { posts: [] });

export async function GET(req: NextRequest, context: { params: Promise<{ hashtag: string }> }) {
  const { hashtag } = await context.params;
  if (!hashtag) {
    return NextResponse.json({ error: 'Hashtag is required' }, { status: 400 });
  }

  try {
    await db.read();
    db.data ||= { posts: [] };
    const posts = db.data.posts ?? [];
    const filtered = posts.filter((post: any) => {
      if (!post.content) return false;
      const matches = post.content.match(/#(\w+)/g);
      if (!matches) return false;
      return matches.map((h: string) => h.slice(1).toLowerCase()).includes(hashtag.toLowerCase());
    });

    return NextResponse.json(filtered);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}
