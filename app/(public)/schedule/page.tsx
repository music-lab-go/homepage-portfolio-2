import { getProfile, getSchedule } from '@/lib/data';
import { getLang } from '@/lib/i18n';
import { t } from '@/lib/t';
import type { Lang } from '@/lib/types';

function formatDate(dateStr: string, lang: Lang): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function SchedulePage() {
  const [schedule, profile, lang] = await Promise.all([
    getSchedule(),
    getProfile(),
    getLang(),
  ]);

  const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));

  const UI = {
    scheduleTitle: { ja: 'スケジュール', en: 'Schedule' },
    noEvents:      { ja: '予定はありません。', en: 'No upcoming events.' },
    detail:        { ja: '詳細 →', en: 'Details →' },
    contactTitle:  { ja: 'お問い合わせ', en: 'Contact' },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-20">
      {/* Schedule */}
      <section>
        <h2 className="text-2xl font-light tracking-wide mb-10">{UI.scheduleTitle[lang]}</h2>
        {sorted.length === 0 ? (
          <p className="text-[var(--muted)] text-sm">{UI.noEvents[lang]}</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {sorted.map((item) => (
              <div key={item.id} className="py-5 flex gap-8 items-start">
                <time className="text-sm text-[var(--muted)] whitespace-nowrap font-mono pt-0.5 min-w-[120px]">
                  {formatDate(item.date, lang)}
                </time>
                <div className="space-y-1">
                  <p className="text-sm font-light">{t(item.title, lang)}</p>
                  {t(item.description, lang) && (
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{t(item.description, lang)}</p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline underline-offset-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {UI.detail[lang]}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section id="contact">
        <h2 className="text-2xl font-light tracking-wide mb-8">{UI.contactTitle[lang]}</h2>
        {profile.links.length > 0 && (
          <div className="flex flex-col gap-3">
            {profile.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity w-fit"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
