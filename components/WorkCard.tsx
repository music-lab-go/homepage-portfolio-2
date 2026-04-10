import Image from 'next/image';
import type { WorkItem, Lang } from '@/lib/types';
import { t } from '@/lib/t';

const CATEGORY_LABELS: Record<WorkItem['category'], string> = {
  music: 'Music',
  art: 'Art',
  project: 'Project',
};

export default function WorkCard({ work, lang }: { work: WorkItem; lang: Lang }) {
  const title = t(work.title, lang);
  const description = t(work.description, lang);

  const Card = (
    <div className="group border border-[var(--border)] hover:border-[var(--foreground)] transition-colors">
      {work.image && (
        <div className="relative w-full aspect-video overflow-hidden bg-zinc-100">
          <Image
            src={work.image}
            alt={title}
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
        <h3 className="text-base font-light">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-wrap">{description}</p>
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
