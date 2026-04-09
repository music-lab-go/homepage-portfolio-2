'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('ユーザー名またはパスワードが正しくありません。');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-sm border border-[var(--border)] p-10 space-y-6">
        <div>
          <h1 className="text-xl font-light tracking-wide">Admin Login</h1>
          <p className="text-xs text-[var(--muted)] mt-1">管理者専用ページ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-[var(--muted)]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full border border-[var(--border)] px-3 py-2 text-sm bg-transparent outline-none focus:border-[var(--foreground)] transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-[var(--muted)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-[var(--border)] px-3 py-2 text-sm bg-transparent outline-none focus:border-[var(--foreground)] transition-colors"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm bg-[var(--foreground)] text-[var(--background)] hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
}
