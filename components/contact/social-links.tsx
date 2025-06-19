import Link from 'next/link';
import React from 'react';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function socialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex space-x-3 ${className}`}>
      <Link
        href="https://www.facebook.com/meet2gopal"
        target="_blank"
        className="transform rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
        aria-label="Facebook"
      >
        <FiFacebook className="h-5 w-5" />
      </Link>
      <Link
        href="https://www.instagram.com/gopalnepal_"
        target="_blank"
        className="transform rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
        aria-label="Instagram"
      >
        <FiInstagram className="h-5 w-5" />
      </Link>

      <Link
        href="https://x.com/meet2gopal"
        target="_blank"
        className="transform rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
        aria-label="Twitter"
      >
        <FiTwitter className="h-5 w-5" />
      </Link>
    </div>
  );
}
