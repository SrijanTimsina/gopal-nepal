import Link from 'next/link';
import Sidebar from './sidebar';
import SocialLinks from './contact/social-links';

export default function Navbar() {
  return (
    <nav className="bg-navy p-4 text-white">
      <div className="container mx-auto flex flex-row-reverse items-center justify-between sm:flex-row">
        <Sidebar />
        <Link
          href="/"
          className="transform text-2xl font-bold sm:text-4xl md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          गाेपाल नेपाल
        </Link>
        <SocialLinks className="hidden space-x-2 sm:flex" />
      </div>
    </nav>
  );
}
