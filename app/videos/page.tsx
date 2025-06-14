import clientPromise from "@/lib/mongodb";
import type { Video } from "@/lib/models";
import PageHeader from "@/components/page-header";
import VideoCard from "@/components/cards/video-card";

async function getVideos() {
  const client = await clientPromise;
  const db = client.db();
  const videos = await db
    .collection("videos")
    .find({})
    .sort({ date: -1 })
    .toArray();
  return videos as Video[];
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Featured Videos"
        breadcrumbs={[{ label: "Featured Videos", href: "/videos" }]}
      />
      {videos.length === 0 ? (
        <p className="mt-8 text-center">No videos available at the moment.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {videos.map((video) => (
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
  );
}
