import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { lang } = await request.json();
  const resolved = lang === 'en' ? 'en' : 'ja';

  const response = NextResponse.json({ ok: true });
  response.cookies.set('lang', resolved, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
  return response;
}
