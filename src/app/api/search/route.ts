import { NextRequest, NextResponse } from 'next/server';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const postsPath = path.join(process.cwd(), 'data/posts.json');
const usersPath = path.join(process.cwd(), 'data/users.json');
const postsAdapter = new JSONFile<{ posts: any[] }>(postsPath);
const usersAdapter = new JSONFile<{ users: any[] }>(usersPath);
const postsDb = new Low(postsAdapter, { posts: [] });
const usersDb = new Low(usersAdapter, { users: [] });

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  let results = [];
  
  await postsDb.read();
  postsDb.data ||= { posts: [] };

  if (q.startsWith('#')) {
    const hashtag = q.slice(1).toLowerCase();
    results = postsDb.data.posts.filter((post: any) => {
      if (!post.content) return false;
      const matches = post.content.match(/#(\w+)/g);
      if (!matches) return false;
      return matches.map((h: string) => h.slice(1).toLowerCase()).includes(hashtag);
    });
  } else if (q) {
    await usersDb.read();
    usersDb.data ||= { users: [] };
    const matchedUsers = usersDb.data.users
      .filter((user: any) => user.username?.toLowerCase().includes(q.toLowerCase()))
      .map((user: any) => user.username);

    if (matchedUsers.length > 0) {
      results = postsDb.data.posts.filter((post: any) => matchedUsers.includes(post.username));
    }
  } else {
    results = [];
  }
  return NextResponse.json(results);
}