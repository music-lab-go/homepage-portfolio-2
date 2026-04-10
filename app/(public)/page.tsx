import Image from 'next/image';
import { getProfile } from '@/lib/data';
import { getLang } from '@/lib/i18n';
import { t } from '@/lib/t';

export default async function HomePage() {
  const [profile, lang] = await Promise.all([getProfile(), getLang()]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="flex flex-col items-center text-center gap-8">
        {profile.photo && (
          <div className="relative w-48 h-48 overflow-hidden border border-[var(--border)]">
            <Image
              src={profile.photo}
              alt={t(profile.name, lang)}
              fill
              className="object-cover"
              priority
              unoptimized={profile.photo.startsWith('http')}
            />
          </div>
        )}
        <div className="space-y-4">
          <h1 className="text-4xl font-light tracking-wide">{t(profile.name, lang)}</h1>
          <p className="text-lg leading-relaxed text-[var(--muted)] max-w-xl whitespace-pre-wrap">{t(profile.bio, lang)}</p>
        </div>
        {profile.links.length > 0 && (
          <div className="flex flex-wrap gap-6 justify-center">
            {profile.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--foreground)] underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
