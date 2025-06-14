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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { GalleryImage } from '@/lib/models';
import ImageInput from '@/components/ImageInput';

interface Category {
  _id: string;
  name: string;
}

export default function EditGalleryImage({
  params,
}: {
  params: { id: string };
}) {
  const [image, setImage] = useState<GalleryImage | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/gallery/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(
            data.map((cat: Category) => ({ id: cat._id, name: cat.name }))
          );
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/gallery/images/${id}`);
        if (response.ok) {
          const data = await response.json();
          setImage(data);
          setTitle(data.title);
          setDescription(data.description || '');
          setImageUrl(data.imageUrl);
          setCategoryId(data.categoryId);
        } else {
          setError('Image not found');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch image');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/gallery/images/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          categoryId,
        }),
      });

      if (response.ok) {
        router.push('/admin/gallery/images');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update image');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">Loading image...</div>
    );
  }

  if (!image && !isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive">
          <AlertDescription>Image not found</AlertDescription>
        </Alert>
        <Button
          onClick={() => router.push('/admin/gallery/images')}
          className="mt-4"
        >
          Back to Images
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/gallery/images')}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Gallery Image</h1>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <CardTitle>Image Details</CardTitle>
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
                Image Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium"
              >
                Category
              </label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <ImageInput
                setValue={(url) => setImageUrl(url)}
                label="Image"
                defaultValue={imageUrl}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium"
              >
                Description (Optional)
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Update Image'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
