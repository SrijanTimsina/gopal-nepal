import { Button } from "@/components/ui/button";
import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import type { NewsArticle } from "@/lib/models";
import { ArrowRight } from "lucide-react";
import NewsCard from "../cards/news-card";

async function getLatestNews() {
  const client = await clientPromise;
  const db = client.db();
  const articles = await db
    .collection("news")
    .find({})
    .sort({ date: -1 })
    .limit(3)
    .toArray();
  return articles as NewsArticle[];
}

export default async function NewsArticles() {
  const articles = await getLatestNews();

  return (
    <section className="relative overflow-hidden py-16">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-navy">Featured News</h2>
            <div className="mt-2 h-1 w-20 rounded-full bg-primary"></div>
          </div>
          <Link href="/news">
            <Button
              variant="default"
              className="transform shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              View All News
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {articles &&
            articles.length > 0 &&
            articles
              .splice(0, 3)
              .map((article, index) => (
                <NewsCard article={article} index={index} key={index} />
              ))}
        </div>
      </div>
    </section>
  );
}
