import Introduction from '@/components/about/introduction';
import AnimatedTimeline from '@/components/about/animated-timeline';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TimelineItem } from '@/lib/models';
import clientPromise from '@/lib/mongodb';

export default async function About() {
  const timelineItems: TimelineItem[] = await fetchTimelineItems();
  return (
    <div className="flex flex-col gap-8 py-4 md:gap-16 md:py-8">
      <Introduction />
      <AnimatedTimeline timelineItems={timelineItems} />

      <div className="px-2 pb-8 text-center">
        <p className="mb-4 text-gray-600">
          Interested in learning more about my contributions or discussing
          potential collaborations?
        </p>
        <Button className="transform bg-primary text-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:bg-navy/90 hover:shadow-xl">
          <Link href="/contact" className="flex">
            Contact Me <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
async function fetchTimelineItems() {
  const client = await clientPromise;
  const db = client.db();
  const timelineItems = await db
    .collection('timeline')
    .find({})
    .sort({ order: 1 })
    .toArray();

  return timelineItems as TimelineItem[];
}
