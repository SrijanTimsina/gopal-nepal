import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import homeImage from '@/public/home.jpg';

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-2 md:gap-6">
          <div className="relative mx-auto h-[300px] w-full max-w-[520px] overflow-hidden rounded-xl shadow-xl md:h-[400px] md:max-w-full">
            <Image
              src={homeImage}
              alt="Name"
              fill
              className="object-cover"
              priority
              placeholder="blur"
            />
          </div>
          <div className="flex flex-col items-center space-y-6 md:mt-8">
            <div className="space-y-6">
              <p className="text-xl font-bold leading-tight text-primary/80 md:text-2xl lg:text-3xl">
                नमस्कार
              </p>
              <h3 className="text-5xl font-bold leading-tight text-navy md:text-6xl lg:text-7xl">
                गाेपाल नेपाल
              </h3>
              <h1 className="sr-only">Gopal Nepal</h1>

              <h2 className="max-w-lg text-base text-gray-700 sm:text-lg">
                सत्य पाउन भन्दा लाखौं गुणा बढी जोगाउन मुस्किल छ ।
              </h2>
            </div>
            <div className="flex flex-row justify-center gap-4 pt-4 md:justify-start">
              <Link href="/blog">
                <Button
                  variant="secondary"
                  className="transform px-8 py-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  Read My Blogs
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="default"
                  className="transform px-8 py-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
