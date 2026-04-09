'use client';

import { useState } from 'react';
import type { Profile } from '@/lib/types';

export default function ProfileEditor({ initial }: { initial: Profile }) {
  const [data, setData] = useState<Profile>(initial);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  function updateLink(i: number, field: 'label' | 'url', value: string) {
    setData((d) => {
      const links = [...d.links];
      links[i] = { ...links[i], [field]: value };
      return { ...d, links };
    });
  }

  function addLink() {
    setData((d) => ({ ...d, links: [...d.links, { label: '', url: '' }] }));
  }

  function removeLink(i: number) {
    setData((d) => ({ ...d, links: d.links.filter((_, idx) => idx !== i) }));
  }

  async function handleSave() {
    setStatus('saving');
    const res = await fetch('/api/content/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? 'saved' : 'error');
    setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <div className="space-y-5">
      <Field label="名前">
        <input
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label="Bio">
        <textarea
          value={data.bio}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          rows={4}
          className={inputClass}
        />
      </Field>
      <Field label="写真URL">
        <input
          value={data.photo}
          onChange={(e) => setData({ ...data, photo: e.target.value })}
          placeholder="/images/profile.jpg または https://..."
          className={inputClass}
        />
      </Field>

      <div className="space-y-2">
        <label className="text-xs text-[var(--muted)]">リンク</label>
        {data.links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={link.label}
              onChange={(e) => updateLink(i, 'label', e.target.value)}
              placeholder="ラベル"
              className={`${inputClass} flex-1`}
            />
            <input
              value={link.url}
              onChange={(e) => updateLink(i, 'url', e.target.value)}
              placeholder="URL"
              className={`${inputClass} flex-[2]`}
            />
            <button
              onClick={() => removeLink(i)}
              className="text-xs text-[var(--muted)] hover:text-red-500 transition-colors px-2"
            >
              削除
            </button>
          </div>
        ))}
        <button onClick={addLink} className={`${smallBtnClass} mt-1`}>
          + リンクを追加
        </button>
      </div>

      <SaveButton status={status} onSave={handleSave} />
    </div>
  );
}

const inputClass =
  'w-full border border-[var(--border)] px-3 py-2 text-sm bg-transparent outline-none focus:border-[var(--foreground)] transition-colors';
const smallBtnClass =
  'text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-[var(--muted)]">{label}</label>
      {children}
    </div>
  );
}

function SaveButton({
  status,
  onSave,
}: {
  status: 'idle' | 'saving' | 'saved' | 'error';
  onSave: () => void;
}) {
  const label =
    status === 'saving' ? '保存中...' : status === 'saved' ? '保存しました' : status === 'error' ? 'エラー' : '保存';
  return (
    <button
      onClick={onSave}
      disabled={status === 'saving'}
      className={`px-6 py-2 text-sm transition-opacity disabled:opacity-40 ${
        status === 'error'
          ? 'bg-red-500 text-white'
          : 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-80'
      }`}
    >
      {label}
    </button>
  );
}
