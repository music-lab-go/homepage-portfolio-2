'use client';

import { useState, useEffect, useRef } from 'react';
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // メニューが一度でも開かれたかを追跡（初期マウント時のフォーカス奪取を防ぐ）
  const hasOpenedRef = useRef(false);

  // 開閉に合わせてフォーカスを移動
  useEffect(() => {
    if (open) {
      hasOpenedRef.current = true;
      closeButtonRef.current?.focus();
    } else if (hasOpenedRef.current) {
      // 閉じた場合のみトリガーにフォーカスを戻す（初期マウント時は除く）
      triggerRef.current?.focus();
    }
  }, [open]);

  // Escape キーで閉じる
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // フォーカストラップ
  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const menuId = 'mobile-menu-panel';

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="メニューを開く"
        className="p-2 text-[var(--foreground)] hover:opacity-60 transition-opacity"
      >
        <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor" aria-hidden="true">
          <rect y="0"  width="20" height="1.5" />
          <rect y="7"  width="20" height="1.5" />
          <rect y="14" width="20" height="1.5" />
        </svg>
      </button>

      {/* フルスクリーンメニュー */}
      {open ? (
        <div
          id={menuId}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="ナビゲーションメニュー"
          onKeyDown={handlePanelKeyDown}
          className="fixed inset-0 bg-[var(--background)] z-50 flex flex-col"
        >
          {/* ヘッダー行 */}
          <div className="h-14 flex items-center justify-between px-6 border-b border-[var(--border)] shrink-0">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-sm font-light tracking-widest uppercase text-[var(--foreground)] hover:opacity-60 transition-opacity"
            >
              Portfolio
            </Link>
            <button
              ref={closeButtonRef}
              onClick={() => setOpen(false)}
              aria-label="メニューを閉じる"
              className="p-2 text-[var(--foreground)] hover:opacity-60 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="17" y1="1" x2="2" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* ナビリンク（スクロール可能） */}
          <nav className="flex flex-col items-start px-8 py-10 gap-8 overflow-y-auto flex-1 min-h-0">
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
          <div className="px-8 pb-10 pt-4 shrink-0">
            <LangSwitcher current={lang} />
          </div>
        </div>
      ) : null}
    </>
  );
}
