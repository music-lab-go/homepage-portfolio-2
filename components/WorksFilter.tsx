'use client';

import { useState } from 'react';
import type { WorkItem, Lang } from '@/lib/types';
import WorkCard from './WorkCard';

const CATEGORIES = ['all', 'music', 'art', 'project'] as const;
const LABELS: Record<string, { ja: string; en: string }> = {
  all:     { ja: 'すべて', en: 'All'     },
  music:   { ja: 'Music',  en: 'Music'   },
  art:     { ja: 'Art',    en: 'Art'     },
  project: { ja: 'Project',en: 'Project' },
};

export default function WorksFilter({ works, lang }: { works: WorkItem[]; lang: Lang }) {
  const [active, setActive] = useState<string>('all');

  const filtered = active === 'all' ? works : works.filter((w) => w.category === active);

  return (
    <div className="space-y-8">
      <div className="flex gap-6 border-b border-[var(--border)] pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-sm pb-1 transition-colors ${
              active === cat
                ? 'text-[var(--foreground)] border-b border-[var(--foreground)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {LABELS[cat][lang]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((work) => (
          <WorkCard key={work.id} work={work} lang={lang} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-[var(--muted)] text-sm text-center py-16">
          {lang === 'ja' ? '作品が見つかりません。' : 'No works found.'}
        </p>
      )}
    </div>
  );
}
