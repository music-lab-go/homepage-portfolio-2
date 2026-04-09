import Link from 'next/link';

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">
      <nav className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-light tracking-widest uppercase text-[var(--foreground)] hover:opacity-60 transition-opacity"
        >
          Portfolio
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm text-[var(--foreground)] hover:opacity-60 transition-opacity">
            Profile
          </Link>
          <Link href="/works" className="text-sm text-[var(--foreground)] hover:opacity-60 transition-opacity">
            Works
          </Link>
          <Link href="/schedule" className="text-sm text-[var(--foreground)] hover:opacity-60 transition-opacity">
            Schedule
          </Link>
          <Link href="/schedule#contact" className="text-sm text-[var(--foreground)] hover:opacity-60 transition-opacity">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
