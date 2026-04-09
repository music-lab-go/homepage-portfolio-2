import type { Profile, WorkItem, ScheduleItem } from './types';
import fs from 'fs/promises';
import path from 'path';

const IS_VERCEL = process.env.VERCEL === '1';

async function readSection<T>(section: string): Promise<T> {
  if (IS_VERCEL) {
    // Read from Vercel Blob
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: `data/${section}.json` });
    if (blobs.length === 0) {
      // Fall back to seed file
      return readFromFs<T>(section);
    }
    const blob = blobs[0];
    const res = await fetch(blob.url);
    return res.json() as T;
  }
  return readFromFs<T>(section);
}

async function readFromFs<T>(section: string): Promise<T> {
  const filePath = path.join(process.cwd(), 'data', `${section}.json`);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

async function writeSection<T>(section: string, data: T): Promise<void> {
  if (IS_VERCEL) {
    const { put } = await import('@vercel/blob');
    await put(`data/${section}.json`, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
  } else {
    const filePath = path.join(process.cwd(), 'data', `${section}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

export const getProfile = () => readSection<Profile>('profile');
export const getWorks = () => readSection<WorkItem[]>('works');
export const getSchedule = () => readSection<ScheduleItem[]>('schedule');

export const saveProfile = (data: Profile) => writeSection('profile', data);
export const saveWorks = (data: WorkItem[]) => writeSection('works', data);
export const saveSchedule = (data: ScheduleItem[]) => writeSection('schedule', data);
