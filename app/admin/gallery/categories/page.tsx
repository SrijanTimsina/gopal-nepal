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
import type { GalleryCategory } from '@/lib/models';

export default function AdminGalleryCategories() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/gallery/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching gallery categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this category? This action cannot be undone.'
      )
    ) {
      try {
        const response = await fetch(`/api/gallery/categories/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setCategories(
            categories.filter((category) => category._id?.toString() !== id)
          );
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('An error occurred while deleting the category');
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
        <h1 className="text-3xl font-bold">Manage Gallery Categories</h1>
      </div>

      <div className="mb-6 flex justify-end">
        <Button onClick={() => router.push('/admin/gallery/categories/create')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <CardTitle>Gallery Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center">
              No categories found. Add your first category!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id?.toString()}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/gallery/categories/edit/${category._id}`
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDelete(category._id?.toString() || '')
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
