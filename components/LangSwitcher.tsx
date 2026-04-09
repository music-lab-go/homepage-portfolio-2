'use client';

import { useRouter } from 'next/navigation';
import type { Lang } from '@/lib/types';

export default function LangSwitcher({ current }: { current: Lang }) {
  const router = useRouter();

  async function switchLang(lang: Lang) {
    await fetch('/api/lang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang }),
    });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => switchLang('ja')}
        className={`px-1.5 py-0.5 transition-opacity ${
          current === 'ja' ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
        }`}
      >
        JA
      </button>
      <span className="text-[var(--border)]">/</span>
      <button
        onClick={() => switchLang('en')}
        className={`px-1.5 py-0.5 transition-opacity ${
          current === 'en' ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
        }`}
      >
        EN
      </button>
    </div>
  );
}
