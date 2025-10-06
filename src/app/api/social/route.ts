import { NextRequest, NextResponse } from 'next/server';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const followsPath = path.join(process.cwd(), 'data/follows.json');
const adapter = new JSONFile<{ follows: any[] }>(followsPath);
const db = new Low(adapter, { follows: [] });

// Helper to parse JSON body
async function parseBody(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  await db.read();
  db.data ||= { follows: [] };
  const body = await parseBody(req);

  if (pathname.endsWith('/follow')) {
    const { follower, following } = body;
    db.data.follows.push({ follower, following });
    await db.write();
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/unfollow')) {
    const { follower, following } = body;
    const idx = db.data.follows.findIndex((f: any) => f.follower === follower && f.following === following);
    if (idx === -1) {
      return NextResponse.json({ error: 'Follow not found' }, { status: 404 });
    }
    db.data.follows.splice(idx, 1);
    await db.write();
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/block')) {
    const blocksPath = path.join(process.cwd(), 'data/blocks.json');
    const blocksAdapter = new JSONFile<{ blocks: any[] }>(blocksPath);
    const blocksDb = new Low(blocksAdapter, { blocks: [] });
    await blocksDb.read();
    blocksDb.data ||= { blocks: [] };
    const { blocker, blocked } = body;
    if (!blocksDb.data.blocks.find((b: any) => b.blocker === blocker && b.blocked === blocked)) {
      blocksDb.data.blocks.push({ blocker, blocked });
      await blocksDb.write();
    }
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/unblock')) {
    const blocksPath = path.join(process.cwd(), 'data/blocks.json');
    const blocksAdapter = new JSONFile<{ blocks: any[] }>(blocksPath);
    const blocksDb = new Low(blocksAdapter, { blocks: [] });
    await blocksDb.read();
    blocksDb.data ||= { blocks: [] };
    const { blocker, blocked } = body;
    const idx = blocksDb.data.blocks.findIndex((b: any) => b.blocker === blocker && b.blocked === blocked);
    if (idx !== -1) {
      blocksDb.data.blocks.splice(idx, 1);
      await blocksDb.write();
    }
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/recommend')) {
    return NextResponse.json({ success: true, message: 'Recommendation sent (stub)' });
  } else if (pathname.endsWith('/profile-view')) {
    const viewsPath = path.join(process.cwd(), 'data/profile_views.json');
    const viewsAdapter = new JSONFile<{ views: any[] }>(viewsPath);
    const viewsDb = new Low(viewsAdapter, { views: [] });
    await viewsDb.read();
    viewsDb.data ||= { views: [] };
    const { viewer, viewed } = body;
    viewsDb.data.views.push({ viewer, viewed, date: new Date().toISOString() });
    await viewsDb.write();
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/favourite')) {
    const favPath = path.join(process.cwd(), 'data/favourites.json');
    const favAdapter = new JSONFile<{ favourites: any[] }>(favPath);
    const favDb = new Low(favAdapter, { favourites: [] });
    await favDb.read();
    favDb.data ||= { favourites: [] };
    const { user, itemType, itemId } = body;
    favDb.data.favourites.push({ user, itemType, itemId });
    await favDb.write();
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/unfavourite')) {
    const favPath = path.join(process.cwd(), 'data/favourites.json');
    const favAdapter = new JSONFile<{ favourites: any[] }>(favPath);
    const favDb = new Low(favAdapter, { favourites: [] });
    await favDb.read();
    favDb.data ||= { favourites: [] };
    const { user, itemType, itemId } = body;
    const idx = favDb.data.favourites.findIndex((f: any) => f.user === user && f.itemType === itemType && f.itemId === itemId);
    if (idx !== -1) {
      favDb.data.favourites.splice(idx, 1);
      await favDb.write();
    }
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/comment-advanced')) {
    const commentsPath = path.join(process.cwd(), 'data/comments.json');
    const commentsAdapter = new JSONFile<{ comments: any[] }>(commentsPath);
    const commentsDb = new Low(commentsAdapter, { comments: [] });
    await commentsDb.read();
    commentsDb.data ||= { comments: [] };
    const { postId, username, text, image, sticker } = body;
    commentsDb.data.comments.push({ postId, username, text, image, sticker, createdAt: new Date().toISOString() });
    await commentsDb.write();
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/share')) {
    const sharesPath = path.join(process.cwd(), 'data/shares.json');
    const sharesAdapter = new JSONFile<{ shares: any[] }>(sharesPath);
    const sharesDb = new Low(sharesAdapter, { shares: [] });
    await sharesDb.read();
    sharesDb.data ||= { shares: [] };
    const { user, postId } = body;
    sharesDb.data.shares.push({ user, postId, date: new Date().toISOString() });
    await sharesDb.write();
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/tag')) {
    const tagsPath = path.join(process.cwd(), 'data/tags.json');
    const tagsAdapter = new JSONFile<{ tags: any[] }>(tagsPath);
    const tagsDb = new Low(tagsAdapter, { tags: [] });
    await tagsDb.read();
    tagsDb.data ||= { tags: [] };
    const { postId, username } = body;
    tagsDb.data.tags.push({ postId, username });
    await tagsDb.write();
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/untag')) {
    const tagsPath = path.join(process.cwd(), 'data/tags.json');
    const tagsAdapter = new JSONFile<{ tags: any[] }>(tagsPath);
    const tagsDb = new Low(tagsAdapter, { tags: [] });
    await tagsDb.read();
    tagsDb.data ||= { tags: [] };
    const { postId, username } = body;
    const idx = tagsDb.data.tags.findIndex((t: any) => t.postId === postId && t.username === username);
    if (idx !== -1) {
      tagsDb.data.tags.splice(idx, 1);
      await tagsDb.write();
    }
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/bookmark')) {
    const bookmarksPath = path.join(process.cwd(), 'data/bookmarks.json');
    const bookmarksAdapter = new JSONFile<{ bookmarks: any[] }>(bookmarksPath);
    const bookmarksDb = new Low(bookmarksAdapter, { bookmarks: [] });
    await bookmarksDb.read();
    bookmarksDb.data ||= { bookmarks: [] };
    const { user, postId } = body;
    bookmarksDb.data.bookmarks.push({ user, postId });
    await bookmarksDb.write();
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/unbookmark')) {
    const bookmarksPath = path.join(process.cwd(), 'data/bookmarks.json');
    const bookmarksAdapter = new JSONFile<{ bookmarks: any[] }>(bookmarksPath);
    const bookmarksDb = new Low(bookmarksAdapter, { bookmarks: [] });
    await bookmarksDb.read();
    bookmarksDb.data ||= { bookmarks: [] };
    const { user, postId } = body;
    const idx = bookmarksDb.data.bookmarks.findIndex((b: any) => b.user === user && b.postId === postId);
    if (idx !== -1) {
      bookmarksDb.data.bookmarks.splice(idx, 1);
      await bookmarksDb.write();
    }
    return NextResponse.json({ success: true });
  } else if (pathname.endsWith('/media-upload')) {
    const mediaPath = path.join(process.cwd(), 'data/media.json');
    const mediaAdapter = new JSONFile<{ media: any[] }>(mediaPath);
    const mediaDb = new Low(mediaAdapter, { media: [] });
    await mediaDb.read();
    mediaDb.data ||= { media: [] };
    const { user, type, url, filters, audio, document, location, emojis, fontSize, hashtags, mentions } = body;
    mediaDb.data.media.push({ user, type, url, filters, audio, document, location, emojis, fontSize, hashtags, mentions, createdAt: new Date().toISOString() });
    await mediaDb.write();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid social action' }, { status: 400 });
}