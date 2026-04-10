import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getProfile, getWorks, getSchedule } from '@/lib/data';
import AdminNav from '@/components/admin/AdminNav';
import ProfileEditor from '@/components/admin/ProfileEditor';
import WorksEditor from '@/components/admin/WorksEditor';
import ScheduleEditor from '@/components/admin/ScheduleEditor';

export default async function AdminPage() {
  // Defense-in-depth: verify JWT server-side (proxy.ts is the primary guard)
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) redirect('/admin/login');
  try {
    await verifyToken(token);
  } catch {
    redirect('/admin/login');
  }

  const [profile, works, schedule] = await Promise.all([
    getProfile(),
    getWorks(),
    getSchedule(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminNav />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">
        <Section title="Profile">
          <ProfileEditor initial={profile} />
        </Section>
        <Section title="Works">
          <WorksEditor initial={works} />
        </Section>
        <Section title="Schedule">
          <ScheduleEditor initial={schedule} />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-light tracking-wide mb-6 pb-3 border-b border-[var(--border)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
