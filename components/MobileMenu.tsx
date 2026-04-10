'use client';

import { useState } from 'react';
import Link from 'next/link';
import LangSwitcher from './LangSwitcher';
import type { Lang } from '@/lib/types';

type NavItem = {
  href: string;
  label: string;
};

type Props = {
  lang: Lang;
  navItems: NavItem[];
};

export default function MobileMenu({ lang, navItems }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-[var(--foreground)] hover:opacity-60 transition-opacity"
        aria-label="メニューを開く"
      >
        <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor" aria-hidden="true">
          <rect y="0"  width="20" height="1.5" />
          <rect y="7"  width="20" height="1.5" />
          <rect y="14" width="20" height="1.5" />
        </svg>
      </button>

      {/* フルスクリーンメニュー */}
      {open ? (
        <div className="fixed inset-0 bg-[var(--background)] z-50 flex flex-col">
          {/* ヘッダー行 */}
          <div className="h-14 flex items-center justify-between px-6 border-b border-[var(--border)]">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-sm font-light tracking-widest uppercase text-[var(--foreground)] hover:opacity-60 transition-opacity"
            >
              Portfolio
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-[var(--foreground)] hover:opacity-60 transition-opacity"
              aria-label="メニューを閉じる"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* ナビリンク */}
          <nav className="flex flex-col items-start px-8 py-10 gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-light text-[var(--foreground)] hover:opacity-60 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 言語切り替え */}
          <div className="px-8 mt-auto pb-10">
            <LangSwitcher current={lang} />
          </div>
        </div>
      ) : null}
    </>
  );
}
