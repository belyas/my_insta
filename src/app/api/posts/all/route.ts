import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const postsPath = path.join(process.cwd(), 'data/posts.json');
const adapter = new JSONFile<{ posts: any[] }>(postsPath);
const db = new Low(adapter, { posts: [] });

export async function GET(req: NextRequest) {
  await db.read();
  db.data ||= { posts: [] };
  const posts = db.data.posts ?? [];
  const { searchParams } = new URL(req.url);
  const feed = searchParams.get('feed') === 'true';
  let filtered = posts;
  if (feed) {
    let user = null;
    try {
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(/user=([^;]+)/);
        if (match) {
          user = JSON.parse(decodeURIComponent(match[1]));
        }
      }
    } catch {}
    if (!user?.username) {
      return NextResponse.json([], { status: 401 });
    }
    const fs = await import('fs/promises');
    const connectionsPath = path.join(process.cwd(), 'data/connections.json');
    let connections = [];
    try {
      const raw = await fs.readFile(connectionsPath, 'utf-8');
      connections = JSON.parse(raw);
    } catch {}
    const following = connections
      .filter((c: any) => c.follower === user.username)
      .map((c: any) => c.following);
    filtered = posts.filter(
      (p: any) => p.username === user.username || following.includes(p.username)
    );
  }
  filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const paginated = filtered.slice(offset, offset + limit);
  return NextResponse.json(paginated);
}