import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import SocialLinks from './contact/social-links';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/3 translate-x-1/3 transform rounded-full bg-gold/5"></div>
      <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 transform rounded-full bg-gold/5"></div>

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          <div className="space-y-6">
            <div className="mb-2">
              <h3 className="header-font text-4xl font-bold">गाेपाल नेपाल</h3>
              <div className="mt-2 h-1 w-16 rounded-full bg-primary/60"></div>
            </div>

            <p className="text-lg leading-relaxed text-white/80">
              सत्य पाउन भन्दा लाखौं गुणा बढी जोगाउन मुस्किल छ ।
            </p>

            <SocialLinks />
          </div>

          <div className="relative">
            <div className="absolute -left-4 bottom-0 top-0 hidden w-1 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 lg:block"></div>
            <div className="lg:pl-8">
              <h3 className="mb-8 flex items-center text-xl font-bold text-white">
                <span className="mr-3 h-[3px] w-10 rounded-full bg-primary"></span>
                Quick Links
              </h3>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-1">
                <li>
                  <Link
                    href="/about"
                    className="group flex items-center text-white/80 transition-all duration-300 hover:text-primary"
                  >
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-primary/20">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </span>
                    About Me
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="group flex items-center text-white/80 transition-all duration-300 hover:text-primary"
                  >
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-primary/20">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </span>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="group flex items-center text-white/80 transition-all duration-300 hover:text-primary"
                  >
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-primary/20">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </span>
                    Featured News
                  </Link>
                </li>
                <li>
                  <Link
                    href="/videos"
                    className="group flex items-center text-white/80 transition-all duration-300 hover:text-primary"
                  >
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-primary/20">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </span>
                    Featured Videos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="group flex items-center text-white/80 transition-all duration-300 hover:text-primary"
                  >
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-primary/20">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </span>
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="group flex items-center text-white/80 transition-all duration-300 hover:text-primary"
                  >
                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-primary/20">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </span>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Contact Information */}
          <div className="relative">
            <div className="absolute -left-4 bottom-0 top-0 hidden w-1 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 lg:block"></div>
            <div className="lg:pl-8">
              <h3 className="mb-8 flex items-center text-xl font-bold text-white">
                <span className="mr-3 h-[3px] w-10 rounded-full bg-primary"></span>
                Contact Information
              </h3>
              <ul className="space-y-6">
                <li className="group flex items-center">
                  <div className="mr-4 mt-1 flex-shrink-0 rounded-full bg-white/10 p-2 transition-all duration-300 group-hover:bg-primary/20">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-white/80 transition-all duration-300 group-hover:text-white">
                    मोलुङ गाउँपालिका ओखलढुंगा
                  </p>
                </li>
                <li className="group flex items-center">
                  <div className="mr-4 flex-shrink-0 rounded-full bg-white/10 p-2 transition-all duration-300 group-hover:bg-primary/20">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <Link
                    href="tel:+977-9849665172"
                    className="text-white/80 transition-all duration-300 group-hover:text-white"
                  >
                    9849665172
                  </Link>
                </li>
                <li className="group flex items-center">
                  <div className="mr-4 flex-shrink-0 rounded-full bg-white/10 p-2 transition-all duration-300 group-hover:bg-primary/20">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <Link
                    href="mailto:gnepal41@gmail.com"
                    className="text-white/80 transition-all duration-300 group-hover:text-white"
                  >
                    gnepal41@gmail.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-navy/80 py-6 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row">
          <div className="mb-4 text-sm text-white/60 md:mb-0">
            &copy; {currentYear} Gopal Nepal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
