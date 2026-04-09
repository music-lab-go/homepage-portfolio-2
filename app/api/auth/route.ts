import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { signToken, COOKIE_NAME } from '@/lib/auth';

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body as { username: string; password: string };

  const expectedUsername = process.env.ADMIN_USERNAME ?? '';
  const expectedPassword = process.env.ADMIN_PASSWORD ?? '';

  const valid =
    safeCompare(username, expectedUsername) &&
    safeCompare(password, expectedPassword);

  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signToken({ username });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
