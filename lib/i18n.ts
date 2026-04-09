import { cookies } from 'next/headers';
import type { Lang } from './types';

// Server-only: reads language from cookie
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const val = store.get('lang')?.value;
  return val === 'en' ? 'en' : 'ja';
}
