import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  res.cookies.set('user', '', { path: '/', httpOnly: false, maxAge: 0 });
  return res;
}