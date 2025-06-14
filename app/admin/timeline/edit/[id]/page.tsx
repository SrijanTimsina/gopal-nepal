'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ImageInput from '@/components/ImageInput';

import type { TimelineItem } from '@/lib/models';

export default function EditTimelineItem({
  params,
}: {
  params: { id: string };
}) {
  const [timelineItem, setTimelineItem] = useState<TimelineItem | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchTimelineItem = async () => {
      try {
        const response = await fetch(
          `/api/timeline/${id}?t=${new Date().getTime()}`
        );
        if (response.ok) {
          const data = await response.json();
          setTimelineItem(data);
          setTitle(data.title);
          setContent(data.content);
          setImages(data.images || []);
        } else {
          setError('Timeline item not found');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch timeline item');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimelineItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/timeline/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          images,
          order: timelineItem?.order,
        }),
      });

      if (response.ok) {
        router.push('/admin/timeline');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update timeline item');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
        <p className="mt-4">Loading timeline item...</p>
      </div>
    );
  }

  if (!timelineItem && !isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive">
          <AlertDescription>Timeline item not found</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/admin/timeline')} className="mt-4">
          Back to Timeline
        </Button>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Edit Timeline Item</h1>
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
              <div className="grid grid-cols-1 gap-4 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
                <ImageInput
                  label={`Add Image 1`}
                  setValue={(url) => handleImageUploaded(0, url)}
                  defaultValue={images[0]}
                />
                <ImageInput
                  label={`Add Image 2`}
                  setValue={(url) => handleImageUploaded(1, url)}
                  defaultValue={images[1]}
                />
                <ImageInput
                  label={`Add Image 3`}
                  setValue={(url) => handleImageUploaded(2, url)}
                  defaultValue={images[2]}
                />
                <ImageInput
                  label={`Add Image 4`}
                  setValue={(url) => handleImageUploaded(3, url)}
                  defaultValue={images[3]}
                />
              </div>
            </div>
            <div className="flex justify-end pt-20">
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Update Timeline Item'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
