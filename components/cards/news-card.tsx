import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { NewsArticle } from "@/lib/models";
import { ArrowRight, Calendar } from "lucide-react";
import { AnimatedLink } from "../ui/animated-link";

export default function NewsCard({
  article,
  index,
}: {
  article: NewsArticle;
  index: number;
}) {
  return (
    <div
      key={index}
      className="group transform overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
    >
      <Link href={article.link} target="_blank" rel="noopener noreferrer">
        <div className="relative">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={`https://utfs.io/f/${article.image}` || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-center text-sm text-gray-500">
            <Calendar className="mr-1 h-4 w-4 text-primary" />
            <span>
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h3 className="mb-3 text-xl font-bold text-navy transition-colors duration-300 group-hover:text-primary">
            {article.title}
          </h3>

          <p className="mb-6 line-clamp-2 text-gray-600">{article.excerpt}</p>

          <div>
            <AnimatedLink
              href={article.link}
              className="font-semibold"
              target="_blank"
            >
              <div className="flex flex-row items-center">
                Read Full Story
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </AnimatedLink>
          </div>
        </div>
      </Link>
    </div>
  );
}
