import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png':  '.png',
  'image/gif':  '.gif',
  'image/webp': '.webp',
};

/** Detect actual file type from magic bytes. Returns null if unrecognised. */
function detectMime(buf: Buffer): string | null {
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  // WebP: RIFF????WEBP
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return 'image/webp';
  return null;
}

export async function POST(request: NextRequest) {
  // Auth check
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Reject oversized requests before parsing the multipart body
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Secondary size check using parsed file size (handles missing Content-Length)
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Magic byte verification — ignore client-declared MIME
  const actualMime = detectMime(buffer);
  if (!actualMime) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  const ext = EXT_MAP[actualMime];
  const filename = `${crypto.randomUUID()}${ext}`;

  if (process.env.VERCEL === '1') {
    const { put } = await import('@vercel/blob');
    const blob = await put(`images/${filename}`, buffer, {
      access: 'public',
      contentType: actualMime,
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Local: save to public/images/
  const dir = path.join(process.cwd(), 'public', 'images');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);

  return NextResponse.json({ url: `/images/${filename}` });
}
