import clientPromise from '@/lib/mongodb';
import type { NewsArticle } from '@/lib/models';
import NewsCard from '@/components/cards/news-card';
import PageHeader from '@/components/page-header';

async function getNewsArticles() {
  const client = await clientPromise;
  const db = client.db();
  const articles = await db
    .collection('news')
    .find({})
    .sort({ date: -1 })
    .toArray();
  return articles as NewsArticle[];
}

export default async function NewsPage() {
  const articles = await getNewsArticles();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Featured News"
        breadcrumbs={[{ label: 'Featured News', href: '/news' }]}
      />
      {articles.length === 0 ? (
        <p className="text-center">No news articles available at the moment.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <NewsCard article={article} index={index} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
