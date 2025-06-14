'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { TimelineItem } from '@/lib/models';
import Image from 'next/image';

export default function AdminTimeline() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchTimelineItems = async () => {
    try {
      const response = await fetch(`/api/timeline?t=${new Date().getTime()}`);
      if (response.ok) {
        const data = await response.json();
        setTimelineItems(data);
      } else {
        setError('Failed to fetch timeline items');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching timeline items');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTimelineItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/timeline/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTimelineItems(
          timelineItems.filter((item) => item._id.toString() !== id)
        );
      } else {
        setError('Failed to delete timeline item');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while deleting the timeline item');
    }
  };

  const handleMoveUp = async (item: TimelineItem, index: number) => {
    if (index === 0) return; // Already at the top

    try {
      const prevItem = timelineItems[index - 1];

      // Swap orders
      const currentOrder = item.order;
      const prevOrder = prevItem.order;

      // Update current item
      await fetch(`/api/timeline/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: item.title,
          content: item.content,
          images: item.images,
          order: prevOrder,
        }),
      });

      // Update previous item
      await fetch(`/api/timeline/${prevItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: prevItem.title,
          content: prevItem.content,
          images: prevItem.images,
          order: currentOrder,
        }),
      });

      fetchTimelineItems();
    } catch (error) {
      console.error(error);
      setError('Failed to reorder timeline items');
    }
  };

  const handleMoveDown = async (item: TimelineItem, index: number) => {
    if (index === timelineItems.length - 1) return; // Already at the bottom

    try {
      const nextItem = timelineItems[index + 1];

      // Swap orders
      const currentOrder = item.order;
      const nextOrder = nextItem.order;

      // Update current item
      await fetch(`/api/timeline/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: item.title,
          content: item.content,
          images: item.images,
          order: nextOrder,
        }),
      });

      // Update next item
      await fetch(`/api/timeline/${nextItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: nextItem.title,
          content: nextItem.content,
          images: nextItem.images,
          order: currentOrder,
        }),
      });

      fetchTimelineItems();
    } catch (error) {
      console.error(error);
      setError('Failed to reorder timeline items');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin')}
            className="mr-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Timeline Management</h1>
        </div>
        <Button onClick={() => router.push('/admin/timeline/create')}>
          <Plus className="mr-1 h-4 w-4" /> Add Timeline Item
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
        </div>
      ) : timelineItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              No timeline items found. Create your first one!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {timelineItems.map((item, index) => (
            <Card key={item._id?.toString()} className="overflow-hidden">
              <CardHeader className="bg-navy text-white">
                <CardTitle className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-navy/50"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(item, index)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-navy/50"
                      disabled={index === timelineItems.length - 1}
                      onClick={() => handleMoveDown(item, index)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-navy/50"
                      onClick={() =>
                        router.push(`/admin/timeline/edit/${item._id}`)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-destructive/90"
                      onClick={() => handleDelete(item._id?.toString() || '')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <p className="whitespace-pre-wrap">{item.content}</p>
                </div>
                {item.images && item.images.length > 0 && (
                  <div
                    className={`grid grid-cols-${Math.min(item.images.length, 2)} gap-2`}
                  >
                    {item.images
                      .filter((image) => image)
                      .map((image, i) => (
                        <div
                          key={i}
                          className="relative h-80 overflow-hidden rounded-md"
                        >
                          <Image
                            src={
                              `https://utfs.io/f/${image}` || '/placeholder.svg'
                            }
                            alt={`Image ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
