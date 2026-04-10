import Link from 'next/link';
import { getLang } from '@/lib/i18n';
import LangSwitcher from './LangSwitcher';
import MobileMenu from './MobileMenu';

const NAV_LABELS = {
  profile:  { ja: 'Profile',  en: 'Profile'  },
  works:    { ja: 'Works',    en: 'Works'    },
  schedule: { ja: 'Schedule', en: 'Schedule' },
  contact:  { ja: 'Contact',  en: 'Contact'  },
};

export default async function Navigation() {
  const lang = await getLang();
  const l = (key: keyof typeof NAV_LABELS) => NAV_LABELS[key][lang];

  const navItems = [
    { href: '/',                label: l('profile')  },
    { href: '/works',           label: l('works')    },
    { href: '/schedule',        label: l('schedule') },
    { href: '/schedule#contact', label: l('contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">
      <nav className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-light tracking-widest uppercase text-[var(--foreground)] hover:opacity-60 transition-opacity"
        >
          Portfolio
        </Link>

        {/* デスクトップ: md以上で表示 */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-[var(--foreground)] hover:opacity-60 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
          <LangSwitcher current={lang} />
        </div>

        {/* モバイル: md未満で表示 */}
        <div className="flex md:hidden">
          <MobileMenu lang={lang} navItems={navItems} />
        </div>
      </nav>
    </header>
  );
}
