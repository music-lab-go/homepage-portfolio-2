'use client';

import { useState } from 'react';
import type { Profile, LocalizedString } from '@/lib/types';
import ImageUpload from './ImageUpload';

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
      <LocalizedField
        label="名前"
        value={data.name}
        onChange={(v) => setData({ ...data, name: v })}
      />
      <LocalizedField
        label="Bio"
        value={data.bio}
        onChange={(v) => setData({ ...data, bio: v })}
        multiline
      />
      <Field label="写真">
        <ImageUpload
          value={data.photo}
          onChange={(url) => setData({ ...data, photo: url })}
          label="プロフィール写真"
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
        <button onClick={addLink} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mt-1">
          + リンクを追加
        </button>
      </div>

      <SaveButton status={status} onSave={handleSave} />
    </div>
  );
}

function LocalizedField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: LocalizedString;
  onChange: (v: LocalizedString) => void;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-[var(--muted)]">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest">JA</span>
          {multiline ? (
            <textarea
              value={value.ja}
              onChange={(e) => onChange({ ...value, ja: e.target.value })}
              rows={3}
              className={inputClass}
            />
          ) : (
            <input
              value={value.ja}
              onChange={(e) => onChange({ ...value, ja: e.target.value })}
              className={inputClass}
            />
          )}
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest">EN</span>
          {multiline ? (
            <textarea
              value={value.en}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              rows={3}
              className={inputClass}
            />
          ) : (
            <input
              value={value.en}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              className={inputClass}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full border border-[var(--border)] px-3 py-2 text-sm bg-transparent outline-none focus:border-[var(--foreground)] transition-colors';

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
