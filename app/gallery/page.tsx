'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { GalleryImage, GalleryCategory } from '@/lib/models';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/page-header';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the full-screen image viewer
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/gallery/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
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
        const response = await fetch('/api/gallery/images');
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const filteredImages =
    activeFilter === 'All'
      ? images
      : images.filter((img) => img.categoryName === activeFilter);

  const openFullScreen = (index: number) => {
    setSelectedImageIndex(index);
    setIsFullScreenOpen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreenOpen(false);
    setSelectedImageIndex(null);
  };

  const goToPrevious = useCallback(() => {
    if (selectedImageIndex === null) return;
    const newIndex =
      selectedImageIndex === 0
        ? filteredImages.length - 1
        : selectedImageIndex - 1;
    setSelectedImageIndex(newIndex);
  }, [selectedImageIndex, filteredImages.length]);

  const goToNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    const newIndex =
      selectedImageIndex === filteredImages.length - 1
        ? 0
        : selectedImageIndex + 1;
    setSelectedImageIndex(newIndex);
  }, [selectedImageIndex, filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullScreenOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          closeFullScreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenOpen, goToNext, goToPrevious]);

  return (
    <div className="px-4 py-8 md:px-8">
      <PageHeader
        title="Gallery"
        breadcrumbs={[{ label: 'Gallery', href: '/gallery' }]}
      />
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Button
          key="All"
          onClick={() => setActiveFilter('All')}
          variant={activeFilter === 'All' ? 'default' : 'outline'}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category._id?.toString()}
            onClick={() => setActiveFilter(category.name)}
            variant={activeFilter === category.name ? 'default' : 'outline'}
          >
            {category.name}
          </Button>
        ))}
      </div>
      {isLoading ? (
        <div className="py-12 text-center">Loading gallery...</div>
      ) : filteredImages.length === 0 ? (
        <div className="py-12 text-center">
          No images found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((img, index) => (
            <div
              key={img._id?.toString()}
              className="aspect-w-4 aspect-h-3 group relative cursor-pointer rounded-xl border"
              onClick={() => openFullScreen(index)}
            >
              <Image
                src={`https://utfs.io/f/${img.imageUrl}` || '/placeholder.svg'}
                alt={img.title}
                width={400}
                height={300}
                className="h-64 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 flex items-end justify-start rounded-lg bg-black bg-opacity-0 p-4 transition-opacity duration-300 group-hover:bg-opacity-40">
                <div className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-lg font-bold">{img.title}</h3>
                  {img.description && (
                    <p className="text-sm">{img.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isFullScreenOpen} onOpenChange={setIsFullScreenOpen}>
        <DialogContent className="max-h-[95vh] max-w-[95vw] border-none bg-black p-0">
          {selectedImageIndex !== null &&
            filteredImages[selectedImageIndex] && (
              <div className="relative flex h-full w-full items-center justify-center">
                <button
                  onClick={closeFullScreen}
                  className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>

                <button
                  onClick={goToPrevious}
                  className="absolute left-4 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                <div className="relative flex h-[80vh] w-full items-center justify-center">
                  <Image
                    src={
                      `https://utfs.io/f/${filteredImages[selectedImageIndex].imageUrl}` ||
                      '/placeholder.svg'
                    }
                    alt={filteredImages[selectedImageIndex].title}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 w-max bg-black/70 p-4 text-white">
                  <h2 className="text-xl font-bold">
                    {filteredImages[selectedImageIndex].title}
                  </h2>
                  {filteredImages[selectedImageIndex].description && (
                    <p className="mt-1">
                      {filteredImages[selectedImageIndex].description}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-300">
                    Image {selectedImageIndex + 1} of {filteredImages.length}
                  </p>
                </div>
              </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
