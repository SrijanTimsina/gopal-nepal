import { Timeline } from '@/components/ui/timeline';
import type { TimelineItem } from '@/lib/models';
import PageHeader from '../page-header';

interface TimelineProps {
  timelineItems: TimelineItem[];
  error?: string;
}

export default function AnimatedTimeline({
  timelineItems,
  error,
}: TimelineProps) {
  if (error) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl">
          Career Timeline
        </h2>
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  if (timelineItems?.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl">
          Career Timeline
        </h2>
        <div className="text-center text-gray-500">
          No timeline items available.
        </div>
      </section>
    );
  }

  const formattedData = timelineItems.map((item) => ({
    title: item.title,
    content: item.content,
    images: item.images
      .filter((image) => image)
      .map((image) => `https://utfs.io/f/${image}`),
  }));

  return (
    <section className="container pb-12 pt-4">
      <div className="m-auto w-max px-4">
        <PageHeader title="My Journey" />
      </div>
      <Timeline data={formattedData} />
    </section>
  );
}
