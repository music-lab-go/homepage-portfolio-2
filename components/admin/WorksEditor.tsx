'use client';

import { useState } from 'react';
import type { WorkItem } from '@/lib/types';

const BLANK_WORK: Omit<WorkItem, 'id'> = {
  title: '',
  category: 'music',
  description: '',
  image: '',
  link: '',
};

export default function WorksEditor({ initial }: { initial: WorkItem[] }) {
  const [works, setWorks] = useState<WorkItem[]>(initial);
  const [editing, setEditing] = useState<WorkItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  function openNew() {
    setEditing({ id: crypto.randomUUID(), ...BLANK_WORK });
    setIsNew(true);
  }

  function openEdit(w: WorkItem) {
    setEditing({ ...w });
    setIsNew(false);
  }

  function saveEditing() {
    if (!editing) return;
    if (isNew) {
      setWorks((ws) => [...ws, editing]);
    } else {
      setWorks((ws) => ws.map((w) => (w.id === editing.id ? editing : w)));
    }
    setEditing(null);
  }

  function deleteWork(id: string) {
    setWorks((ws) => ws.filter((w) => w.id !== id));
  }

  async function handleSave() {
    setStatus('saving');
    const res = await fetch('/api/content/works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(works),
    });
    setStatus(res.ok ? 'saved' : 'error');
    setTimeout(() => setStatus('idle'), 2000);
  }

  if (editing) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-light">{isNew ? '新規追加' : '編集'}</h3>
        <Field label="タイトル">
          <input
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="カテゴリ">
          <select
            value={editing.category}
            onChange={(e) => setEditing({ ...editing, category: e.target.value as WorkItem['category'] })}
            className={inputClass}
          >
            <option value="music">Music</option>
            <option value="art">Art</option>
            <option value="project">Project</option>
          </select>
        </Field>
        <Field label="説明">
          <textarea
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="画像URL">
          <input
            value={editing.image}
            onChange={(e) => setEditing({ ...editing, image: e.target.value })}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
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

  return (
    <div className="space-y-5">
      <div className="divide-y divide-[var(--border)]">
        {works.map((w) => (
          <div key={w.id} className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-light">{w.title || '(無題)'}</p>
              <p className="text-xs text-[var(--muted)] capitalize">{w.category}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => openEdit(w)} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                編集
              </button>
              <button onClick={() => deleteWork(w.id)} className="text-xs text-[var(--muted)] hover:text-red-500 transition-colors">
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
      {works.length === 0 && <p className="text-sm text-[var(--muted)]">作品がありません。</p>}

      <div className="flex gap-4 items-center">
        <button onClick={openNew} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
          + 追加
        </button>
        <SaveButton status={status} onSave={handleSave} />
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
