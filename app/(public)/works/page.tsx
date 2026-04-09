import { getWorks } from '@/lib/data';
import WorksFilter from '@/components/WorksFilter';

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-light tracking-wide mb-12">Works</h2>
      <WorksFilter works={works} />
    </div>
  );
}
