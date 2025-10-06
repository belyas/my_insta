
import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const postsPath = path.join(process.cwd(), 'data/posts.json');
const adapter = new JSONFile<{ posts: any[] }>(postsPath);
const db = new Low(adapter, { posts: [] });
const uploadsDir = path.join(process.cwd(), 'public/uploads/posts');

export async function PUT(req: NextRequest, { params }: { params: { postId: string } }) {
  await db.read();
  db.data ||= { posts: [] };
  const { postId } = params;
  const idx = db.data.posts.findIndex(p => p.id === postId);
  if (idx === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  let update: any = {};
  let mediaUrl: string | undefined = undefined;
  if (req.headers.get('content-type')?.startsWith('multipart/form-data')) {
    const formData = await req.formData();
    update.content = formData.get('content')?.toString() || db.data.posts[idx].content;
    const file = formData.get('media');
    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const oldMediaUrl = db.data.posts[idx].mediaUrl;
      if (oldMediaUrl && oldMediaUrl.startsWith('/uploads/posts/')) {
        try {
          const fs = await import('fs/promises');
          const oldPath = path.join(uploadsDir, path.basename(oldMediaUrl));
          await fs.unlink(oldPath);
        } catch (e) {
          // Ignore if file doesn't exist
        }
      }
      const ext = file.name ? path.extname(file.name) : '';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const fs = await import('fs/promises');
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer);
      mediaUrl = `/uploads/posts/${filename}`;
      update.mediaUrl = mediaUrl;
    }
  } else {
    update = await req.json();
  }
  db.data.posts[idx] = { ...db.data.posts[idx], ...update };
  await db.write();
  return NextResponse.json(db.data.posts[idx]);
}

export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  await db.read();
  db.data ||= { posts: [] };
  const { postId } = params;
  const idx = db.data.posts.findIndex(p => p.id === postId);
  if (idx === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  const deleted = db.data.posts.splice(idx, 1)[0];
  await db.write();
  return NextResponse.json(deleted);
}
