'use client';

import Link from 'next/link';
import {
  Home,
  User,
  ImageIcon,
  Mail,
  Newspaper,
  Video,
  X,
  PanelLeft,
  BookOpen,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import SocialLinks from './contact/social-links';

const menuItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: User, label: 'About', href: '/about' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: Video, label: 'Videos', href: '/videos' },
  { icon: BookOpen, label: 'Blog', href: '/blog' },
  { icon: ImageIcon, label: 'Gallery', href: '/gallery' },
  { icon: Mail, label: 'Contact', href: '/contact' },
];

const Sidebar = () => {
  return (
    <div className="flex">
      <Sheet>
        <SheetTrigger className="rounded-lg bg-gray-900 p-2 text-white hover:bg-primary">
          <PanelLeft size={24} />
        </SheetTrigger>

        <SheetContent
          side="dynamic"
          className="w-80 space-y-6 border-none bg-gray-900 p-5 text-white"
        >
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Menu</h2>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-6 w-6" />
              </Button>
            </SheetClose>
          </div>

          <nav>
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2 text-lg transition-colors hover:text-primary"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-center">
            <SocialLinks className="pt-2" />
          </div>

          <div className="pt-8">
            <p className="text-sm text-gray-400">© 2025 Name</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
