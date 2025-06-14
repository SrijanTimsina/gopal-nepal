import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

interface VideoCardMinimalProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  href: string;
}

export default function VideoCard({
  title,
  description,
  thumbnailUrl,
  href,
}: VideoCardMinimalProps) {
  function getYouTubeVideoId(url: string) {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match
      ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
      : null;
  }

  const thumbnail = thumbnailUrl
    ? `https://utfs.io/f/${thumbnailUrl}`
    : getYouTubeVideoId(href);

  return (
    <Link href={href} className="group block" target="_blank">
      <div className="relative overflow-hidden rounded-xl shadow-md transition-all duration-500 hover:shadow-xl">
        <div className="relative aspect-video">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>

          <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg">
              <Play
                className="ml-0.5 h-6 w-6 fill-current text-white"
                fill="currentColor"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 translate-y-2 transform p-6 transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="mb-2 line-clamp-1 text-xl font-bold text-white">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-white/80">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
