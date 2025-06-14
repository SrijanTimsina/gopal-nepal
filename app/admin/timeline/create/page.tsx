'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ImageInput from '@/components/ImageInput';

export default function CreateTimelineItem() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      setIsLoading(false);
      return;
    }
    const filteredImages = images.filter(
      (img): img is string => img !== null || img != ''
    );

    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          images: filteredImages,
        }),
      });

      if (response.ok) {
        router.push('/admin/timeline');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create timeline item');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploaded = (index: number, url: string) => {
    const newImages = [...images];
    if (!url || url.trim() === '') {
      newImages[index] = null;
      setImages(newImages);
      return;
    }
    newImages[index] = url;
    setImages(newImages);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/timeline')}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Create Timeline Item</h1>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <CardTitle>Timeline Item Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium">
                Title (e.g., year or date)
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="2023"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="mb-1 block text-sm font-medium"
              >
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Describe the timeline event..."
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Images (up to 4)
              </label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
                <ImageInput
                  label={`Add Image 1`}
                  setValue={(url) => handleImageUploaded(0, url)}
                />
                <ImageInput
                  label={`Add Image 2`}
                  setValue={(url) => handleImageUploaded(1, url)}
                />
                <ImageInput
                  label={`Add Image 3`}
                  setValue={(url) => handleImageUploaded(2, url)}
                />
                <ImageInput
                  label={`Add Image 4`}
                  setValue={(url) => handleImageUploaded(3, url)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Timeline Item'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
