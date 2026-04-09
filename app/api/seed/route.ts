import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { saveProfile, saveWorks, saveSchedule } from '@/lib/data';
import profileSeed from '@/data/profile.json';
import worksSeed from '@/data/works.json';
import scheduleSeed from '@/data/schedule.json';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await Promise.all([
    saveProfile(profileSeed as Parameters<typeof saveProfile>[0]),
    saveWorks(worksSeed as Parameters<typeof saveWorks>[0]),
    saveSchedule(scheduleSeed as Parameters<typeof saveSchedule>[0]),
  ]);

  return NextResponse.json({ ok: true, message: 'Blob seeded from data/*.json' });
}
