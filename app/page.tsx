import Hero from '@/components/home/hero';
import NewsArticles from '@/components/home/news-articles';
import Videos from '@/components/home/videos';
import BlogSection from '@/components/home/blog-section';
import GallerySection from '@/components/home/gallery-section';
import ContactForm from '@/components/contact/contact-form';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="flex flex-col">
        <BlogSection />
        <NewsArticles />
        <Videos />
        <GallerySection />
        <div className="bg-gray-50">
          <ContactForm
            title="Contact Me"
            description="Have a question or want to discuss a potential collaboration? I'd love to hear from you."
          />
        </div>
      </div>
    </>
  );
}
