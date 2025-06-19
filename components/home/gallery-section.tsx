import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';

const dummyImages = [
  {
    _id: '1',
    title:
      'सुवासचन्द्र नेम्वाङ स्मृती अभ्यास अदालत(Moot Court) प्रतियोगिता २०८१',
    description:
      'सुवासचन्द्र नेम्वाङ स्मृती अभ्यास अदालत(Moot Court) प्रतियोगिता २०८१',
    imageUrl: '/home.jpg',
    categoryName: 'Events',
  },
  {
    _id: '2',
    title: 'अनेरास्ववियु २४औ राष्ट्रिय महाधिवेशन',
    description: 'अनेरास्ववियु २४औ राष्ट्रिय महाधिवेशन',
    imageUrl: '/gallery-2.jpg',
    categoryName: 'Community',
  },
  {
    _id: '4',
    title: 'Gopal Nepal',
    description: 'Gopal Nepal',
    imageUrl: '/about.webp',
    categoryName: 'Education',
  },
  {
    _id: '3',
    title: 'अनेरास्ववियु २४ औ राष्ट्रिय महाधिवेशन',
    description: 'अनेरास्ववियु २४औ राष्ट्रिय महाधिवेशन',
    imageUrl: '/gallery-2.jpg',
    categoryName: 'Community',
  },
];

export default function GallerySection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-navy">Gallery Highlights</h2>
          <div className="mt-2 h-1 w-20 rounded-full bg-primary"></div>
        </div>
        <Link href="/gallery">
          <Button
            variant="default"
            className="transform shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
          >
            View Full Gallery
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {dummyImages.map((image, index) => (
          <Link
            key={image._id}
            href="/gallery"
            className={`group relative overflow-hidden rounded-xl ${index === 0 ? 'col-span-2 row-span-2' : ''} ${
              index === 3 ? 'col-span-2 hidden md:block' : ''
            }`}
          >
            {index !== 1 && index !== 2 && (
              <>
                <div className="absolute inset-0 z-10 flex flex-col justify-end bg-navy/50 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-lg font-bold text-white">
                    {image.title}
                  </h3>
                  <p className="text-sm text-white/80">{image.description}</p>
                  <span className="mt-2 flex items-center text-sm text-white underline">
                    View larger <ExternalLink className="ml-1 h-3 w-3" />
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-[5] bg-gradient-to-t from-black/70 to-transparent p-4 group-hover:hidden">
                  <h3 className="font-bold text-white">{image.title}</h3>
                  <p className="text-xs text-white/80">{image.categoryName}</p>
                </div>
              </>
            )}
            {(index === 1 || index === 2) && (
              <div className="absolute inset-0 z-10 flex flex-col justify-end bg-navy/50 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="mt-2 flex items-center text-sm text-white underline">
                  View larger <ExternalLink className="ml-1 h-3 w-3" />
                </span>
              </div>
            )}

            <div
              className={`relative w-full ${index === 0 ? 'aspect-square md:aspect-[4/4.6]' : 'aspect-square md:aspect-[4/3]'}`}
            >
              <Image
                src={image.imageUrl || '/placeholder.svg'}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
