import { getProfile, getSchedule } from '@/lib/data';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function SchedulePage() {
  const [schedule, profile] = await Promise.all([getSchedule(), getProfile()]);

  const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-20">
      {/* Schedule */}
      <section>
        <h2 className="text-2xl font-light tracking-wide mb-10">Schedule</h2>
        {sorted.length === 0 ? (
          <p className="text-[var(--muted)] text-sm">No upcoming events.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {sorted.map((item) => (
              <div key={item.id} className="py-5 flex gap-8 items-start">
                <time className="text-sm text-[var(--muted)] whitespace-nowrap font-mono pt-0.5 min-w-[120px]">
                  {formatDate(item.date)}
                </time>
                <div className="space-y-1">
                  <p className="text-sm font-light">{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{item.description}</p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline underline-offset-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      詳細 →
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
        <h2 className="text-2xl font-light tracking-wide mb-8">Contact</h2>
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
