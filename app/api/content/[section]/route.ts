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

// --- Input validators ---

function isLocalizedString(v: unknown): boolean {
  if (typeof v !== 'object' || v === null) return false;
  const d = v as Record<string, unknown>;
  return typeof d.ja === 'string' && typeof d.en === 'string';
}

function validateProfile(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    isLocalizedString(d.name) &&
    isLocalizedString(d.bio) &&
    typeof d.photo === 'string' &&
    Array.isArray(d.links) &&
    (d.links as unknown[]).every(
      (l) =>
        typeof l === 'object' && l !== null &&
        typeof (l as Record<string, unknown>).label === 'string' &&
        typeof (l as Record<string, unknown>).url === 'string'
    )
  );
}

const VALID_CATEGORIES = new Set(['music', 'art', 'project']);

function validateWorks(data: unknown): boolean {
  if (!Array.isArray(data)) return false;
  return data.every((item: unknown) => {
    if (typeof item !== 'object' || item === null) return false;
    const d = item as Record<string, unknown>;
    return (
      typeof d.id === 'string' &&
      isLocalizedString(d.title) &&
      VALID_CATEGORIES.has(d.category as string) &&
      isLocalizedString(d.description) &&
      typeof d.image === 'string' &&
      typeof d.link === 'string'
    );
  });
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidCalendarDate(s: string): boolean {
  if (!DATE_RE.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  // If the date rolls over (e.g. Feb 31 → Mar 3), the components won't match
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function validateSchedule(data: unknown): boolean {
  if (!Array.isArray(data)) return false;
  return data.every((item: unknown) => {
    if (typeof item !== 'object' || item === null) return false;
    const d = item as Record<string, unknown>;
    return (
      typeof d.id === 'string' &&
      typeof d.date === 'string' && isValidCalendarDate(d.date) &&
      isLocalizedString(d.title) &&
      isLocalizedString(d.description) &&
      typeof d.link === 'string'
    );
  });
}

const VALIDATORS: Record<Section, (d: unknown) => boolean> = {
  profile:  validateProfile,
  works:    validateWorks,
  schedule: validateSchedule,
};

// --- Data helpers ---

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

// --- Route handlers ---

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
  if (!VALIDATORS[section](body)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  await saveData(section, body);
  return NextResponse.json({ ok: true });
}
