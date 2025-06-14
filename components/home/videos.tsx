import { Button } from "@/components/ui/button";
import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import type { Video } from "@/lib/models";
import VideoCard from "../cards/video-card";
import { ArrowRight } from "lucide-react";

async function getLatestVideos() {
  const client = await clientPromise;
  const db = client.db();
  const videos = await db
    .collection("videos")
    .find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .toArray();
  return videos as Video[];
}

export default async function Videos() {
  const videos = await getLatestVideos();

  return (
    <section className="relative overflow-hidden bg-gray-50 py-16 pb-20">
      <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/3 translate-x-1/3 transform rounded-full bg-blue-700/5"></div>
      <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 transform rounded-full bg-blue-700/5"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-navy">Featured Videos</h2>
            <div className="mt-2 h-1 w-20 rounded-full bg-primary"></div>
          </div>
          <Link href="/videos">
            <Button
              variant="default"
              className="transform shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              Watch All Videos
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        {videos.length === 0 ? (
          <p className="text-center">No videos available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {videos &&
              videos.length > 0 &&
              videos.map((video) => (
                <VideoCard
                  id={video._id.toString()}
                  title={video.title}
                  description={video.description}
                  href={video.href}
                  thumbnailUrl={video.thumbnailUrl}
                  key={video._id.toString()}
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
