import type { LocalizedString, Lang } from './types';

// Safe to import in both Server and Client Components
export function t(str: LocalizedString, lang: Lang): string {
  return str[lang] || str.ja || '';
}
