import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const postsPath = path.join(process.cwd(), 'data/posts.json');
const adapter = new JSONFile<{ posts: any[] }>(postsPath);
const db = new Low(adapter, { posts: [] });
const uploadsDir = path.join(process.cwd(), 'public/uploads/posts');

export async function GET(req: NextRequest) {
  await db.read();
  db.data ||= { posts: [] };
  const posts = db.data.posts ?? [];
  const { searchParams } = new URL(req.url);
  const usernameParam = searchParams.get('username');
  if (!usernameParam) {
    return NextResponse.json({ error: 'username param required' }, { status: 400 });
  }
  const filtered = posts.filter((p: any) => p.username === usernameParam);
  filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const paginated = filtered.slice(offset, offset + limit);
  return NextResponse.json(paginated);
}

export async function POST(req: NextRequest) {
  if (req.headers.get('content-type')?.startsWith('multipart/form-data')) {
    await db.read();
    db.data ||= { posts: [] };
    const formData = await req.formData();
    const id = formData.get('id')?.toString() || Date.now().toString();
    const username = formData.get('username')?.toString() || '';
    const content = formData.get('content')?.toString() || '';
    const createdAt = formData.get('createdAt')?.toString() || new Date().toISOString();
    let mediaUrl = null;
    const file = formData.get('media');
    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const ext = file.name ? path.extname(file.name) : '';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const fs = await import('fs/promises');
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer);
      mediaUrl = `/uploads/posts/${filename}`;
    }
    const post = { id, username, content, createdAt, mediaUrl, likes: [], comments: [] };
    db.data.posts.push(post);
    await db.write();
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    await db.read();
    db.data ||= { posts: [] };
    const postData = await req.json();
    const { id, username, content, createdAt, mediaUrl } = postData;
    const post = { id, username, content, createdAt, mediaUrl, likes: [], comments: [] };
    db.data.posts.push(post);
    await db.write();
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
