'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-sm font-light tracking-widest uppercase">Admin Panel</span>
          <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            ← サイトを見る
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
