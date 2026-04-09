'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = '画像' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });

    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
      setStatus('idle');
    } else {
      const { error } = await res.json().catch(() => ({ error: 'アップロードに失敗しました' }));
      setErrorMsg(error ?? 'アップロードに失敗しました');
      setStatus('error');
    }

    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  }

  const isExternalUrl = value.startsWith('http');

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative w-24 h-24 border border-[var(--border)] overflow-hidden bg-zinc-100">
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            unoptimized={isExternalUrl}
          />
        </div>
      )}

      {/* URL input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="URL を入力 または ↓ からアップロード"
        className="w-full border border-[var(--border)] px-3 py-2 text-sm bg-transparent outline-none focus:border-[var(--foreground)] transition-colors"
      />

      {/* File upload */}
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === 'uploading'}
          className="text-xs px-3 py-1.5 border border-[var(--border)] hover:border-[var(--foreground)] transition-colors disabled:opacity-40"
        >
          {status === 'uploading' ? 'アップロード中...' : 'ファイルを選択'}
        </button>
        <span className="text-xs text-[var(--muted)]">JPG / PNG / GIF / WebP</span>
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
