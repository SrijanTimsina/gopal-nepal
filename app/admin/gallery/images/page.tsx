'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash, ArrowLeft } from 'lucide-react';
import type { GalleryImage } from '@/lib/models';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface Category {
  _id: string;
  name: string;
}

export default function AdminGalleryImages() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const router = useRouter();

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
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const url =
          selectedCategory === 'all'
            ? '/api/gallery/images'
            : `/api/gallery/images?categoryId=${selectedCategory}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [selectedCategory]);

  const handleDelete = async (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this image? This action cannot be undone.'
      )
    ) {
      try {
        const response = await fetch(`/api/gallery/images/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setImages(images.filter((image) => image._id?.toString() !== id));
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete image');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('An error occurred while deleting the image');
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/gallery')}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Manage Gallery Images</h1>
      </div>

      <div className="mb-6 flex flex-col items-start justify-end gap-6 md:flex-row md:items-center">
        <div className="w-full md:w-64">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => router.push('/admin/gallery/images/create')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Image
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <CardTitle>Gallery Images</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="p-6 text-center">
              No images found. Add your first image!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image) => (
                  <TableRow key={image._id?.toString()}>
                    <TableCell>
                      <div className="relative h-16 w-16">
                        <Image
                          src={
                            `https://utfs.io/f/${image.imageUrl}` ||
                            '/placeholder.svg'
                          }
                          alt={image.title}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{image.title}</TableCell>
                    <TableCell>{image.categoryName}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/gallery/images/edit/${image._id}`
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDelete(image._id?.toString() || '')
                          }
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
