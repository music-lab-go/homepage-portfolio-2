'use client';

import { useState } from 'react';
import type { ScheduleItem, LocalizedString } from '@/lib/types';

const BLANK: Omit<ScheduleItem, 'id'> = {
  date: '',
  title: { ja: '', en: '' },
  description: { ja: '', en: '' },
  link: '',
};

export default function ScheduleEditor({ initial }: { initial: ScheduleItem[] }) {
  const [items, setItems] = useState<ScheduleItem[]>(initial);
  const [editing, setEditing] = useState<ScheduleItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  function openNew() {
    setEditing({ id: crypto.randomUUID(), ...BLANK });
    setIsNew(true);
  }

  function openEdit(item: ScheduleItem) {
    setEditing({ ...item });
    setIsNew(false);
  }

  function saveEditing() {
    if (!editing) return;
    if (isNew) {
      setItems((prev) => [...prev, editing]);
    } else {
      setItems((prev) => prev.map((i) => (i.id === editing.id ? editing : i)));
    }
    setEditing(null);
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleSave() {
    setStatus('saving');
    const res = await fetch('/api/content/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
    setStatus(res.ok ? 'saved' : 'error');
    setTimeout(() => setStatus('idle'), 2000);
  }

  if (editing) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-light">{isNew ? '新規追加' : '編集'}</h3>
        <Field label="日付">
          <input
            type="date"
            value={editing.date}
            onChange={(e) => setEditing({ ...editing, date: e.target.value })}
            className={inputClass}
          />
        </Field>
        <LocalizedField
          label="タイトル"
          value={editing.title}
          onChange={(v) => setEditing({ ...editing, title: v })}
        />
        <LocalizedField
          label="説明"
          value={editing.description}
          onChange={(v) => setEditing({ ...editing, description: v })}
          multiline
        />
        <Field label="リンクURL">
          <input
            value={editing.link}
            onChange={(e) => setEditing({ ...editing, link: e.target.value })}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
        <div className="flex gap-3">
          <button
            onClick={saveEditing}
            className="px-5 py-2 text-sm bg-[var(--foreground)] text-[var(--background)] hover:opacity-80 transition-opacity"
          >
            {isNew ? '追加' : '更新'}
          </button>
          <button
            onClick={() => setEditing(null)}
            className="px-5 py-2 text-sm border border-[var(--border)] hover:border-[var(--foreground)] transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-5">
      <div className="divide-y divide-[var(--border)]">
        {sorted.map((item) => (
          <div key={item.id} className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-light">{item.title.ja || '(無題)'}</p>
              <p className="text-xs text-[var(--muted)]">{item.date}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => openEdit(item)} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                編集
              </button>
              <button onClick={() => deleteItem(item.id)} className="text-xs text-[var(--muted)] hover:text-red-500 transition-colors">
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-sm text-[var(--muted)]">スケジュールがありません。</p>}

      <div className="flex gap-4 items-center">
        <button onClick={openNew} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
          + 追加
        </button>
        <SaveButton status={status} onSave={handleSave} />
      </div>
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
