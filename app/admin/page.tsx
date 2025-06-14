'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Newspaper,
  Video,
  LogOut,
  BookOpen,
  Image as ImageIcon,
  Clock,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="flex items-center">
              <Newspaper className="mr-2 h-5 w-5" /> News Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">
              Manage news articles that appear on the website.
            </p>
            <Button
              variant={'secondary'}
              onClick={() => router.push('/admin/news')}
            >
              Manage News
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5" /> Videos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">Manage videos that appear on the website.</p>
            <Button
              variant={'secondary'}
              onClick={() => router.push('/admin/videos')}
            >
              Manage Videos
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" /> Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">
              Manage blog posts that appear on the website.
            </p>
            <Button
              variant={'secondary'}
              onClick={() => router.push('/admin/blog')}
            >
              Manage Blog
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" /> Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">Manage images in the gallery.</p>
            <Button
              variant={'secondary'}
              onClick={() => router.push('/admin/gallery')}
            >
              Manage Gallery
            </Button>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" /> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">
              Manage your career timeline on the About page.
            </p>
            <Button onClick={() => router.push('/admin/timeline')}>
              Manage Timeline
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
