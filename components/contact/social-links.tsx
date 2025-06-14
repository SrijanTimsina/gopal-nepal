import Link from 'next/link';
import React from 'react';
import { FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function socialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex space-x-3 ${className}`}>
      <Link
        href="https://www.facebook.com/srijan.timsina"
        target="_blank"
        className="transform rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
        aria-label="Facebook"
      >
        <FiFacebook className="h-5 w-5" />
      </Link>
      <Link
        href="https://www.instagram.com/srijantimsina_"
        target="_blank"
        className="transform rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
        aria-label="Instagram"
      >
        <FiInstagram className="h-5 w-5" />
      </Link>

      <Link
        href="https://www.linkedin.com/in/srijan-timsina-13b516226/"
        target="_blank"
        className="transform rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
        aria-label="LinkedIn"
      >
        <FiLinkedin className="h-5 w-5" />
      </Link>
    </div>
  );
}
