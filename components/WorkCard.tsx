import Image from 'next/image';
import type { WorkItem } from '@/lib/types';

const CATEGORY_LABELS: Record<WorkItem['category'], string> = {
  music: 'Music',
  art: 'Art',
  project: 'Project',
};

export default function WorkCard({ work }: { work: WorkItem }) {
  const Card = (
    <div className="group border border-[var(--border)] hover:border-[var(--foreground)] transition-colors">
      {work.image && (
        <div className="relative w-full aspect-video overflow-hidden bg-zinc-100">
          <Image
            src={work.image}
            alt={work.title}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
            unoptimized={work.image.startsWith('http')}
          />
        </div>
      )}
      <div className="p-5 space-y-2">
        <span className="text-xs uppercase tracking-widest text-[var(--muted)]">
          {CATEGORY_LABELS[work.category]}
        </span>
        <h3 className="text-base font-light">{work.title}</h3>
        {work.description && (
          <p className="text-sm text-[var(--muted)] leading-relaxed">{work.description}</p>
        )}
      </div>
    </div>
  );

  if (work.link) {
    return (
      <a href={work.link} target="_blank" rel="noopener noreferrer" className="block">
        {Card}
      </a>
    );
  }
  return Card;
}
