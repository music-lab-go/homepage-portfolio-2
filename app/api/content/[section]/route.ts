import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import {
  getProfile, getWorks, getSchedule,
  saveProfile, saveWorks, saveSchedule,
} from '@/lib/data';

const ALLOWED_SECTIONS = ['profile', 'works', 'schedule'] as const;
type Section = typeof ALLOWED_SECTIONS[number];

function isAllowedSection(s: string): s is Section {
  return ALLOWED_SECTIONS.includes(s as Section);
}

async function getData(section: Section) {
  switch (section) {
    case 'profile': return getProfile();
    case 'works': return getWorks();
    case 'schedule': return getSchedule();
  }
}

async function saveData(section: Section, data: unknown) {
  switch (section) {
    case 'profile': return saveProfile(data as Parameters<typeof saveProfile>[0]);
    case 'works': return saveWorks(data as Parameters<typeof saveWorks>[0]);
    case 'schedule': return saveSchedule(data as Parameters<typeof saveSchedule>[0]);
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  if (!isAllowedSection(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }
  const data = await getData(section);
  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  if (!isAllowedSection(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  await saveData(section, body);

  return NextResponse.json({ ok: true });
}
