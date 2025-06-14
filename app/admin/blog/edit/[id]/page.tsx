'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { BlogPost } from '@/lib/models';
import RichTextEditor from '@/components/rich-text-editor';
import ImageInput from '@/components/ImageInput';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
          setTitle(data.title || '');
          setDate(data.date ? data.date.split('T')[0] : '');
          setContent(data.content || '');
          setImage(data.image || '');
          setAuthor(data.author || '');
          setTags(data.tags?.join(', ') || '');
          setStatus(data.status || 'draft');
        } else {
          setError('Blog post not found');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // For published posts, validate all required fields
      if (status === 'published') {
        if (!title || !date || !content || !image || !author) {
          setError('All fields are required for published posts');
          setIsSaving(false);
          return;
        }
      } else {
        // For drafts, only title is required
        if (!title) {
          setError('Title is required even for drafts');
          setIsSaving(false);
          return;
        }
      }

      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          date: date || new Date().toISOString().split('T')[0],
          content,
          image,
          author,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          status,
        }),
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update blog post');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUploaded = (url: string) => {
    setImage(url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading blog post...
      </div>
    );
  }

  if (!post && !isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive">
          <AlertDescription>Blog post not found</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/admin/blog')} className="mt-4">
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/blog')}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <Badge
          variant={status === 'published' ? 'success' : 'secondary'}
          className="ml-4"
        >
          {status === 'published' ? 'Published' : 'Draft'}
        </Badge>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <div className="flex items-center justify-between">
            <CardTitle>Blog Post Details</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="publish-switch" className="text-sm text-white">
                {status === 'published' ? 'Published' : 'Draft'}
              </Label>
              <Switch
                id="publish-switch"
                checked={status === 'published'}
                onCheckedChange={(checked) =>
                  setStatus(checked ? 'published' : 'draft')
                }
              />
            </div>
          </div>
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
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="mb-1 block text-sm font-medium">
                Date{' '}
                {status === 'published' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required={status === 'published'}
              />
            </div>
            <div>
              <label
                htmlFor="author"
                className="mb-1 block text-sm font-medium"
              >
                Author{' '}
                {status === 'published' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required={status === 'published'}
              />
            </div>
            <div>
              <label
                htmlFor="featuredImage"
                className="mb-1 block text-sm font-medium"
              >
                Featured Image{' '}
                {status === 'published' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <div className="mb-2">
                <ImageInput
                  label="Featured Image"
                  setValue={(url) => handleImageUploaded(url)}
                  defaultValue={image}
                />
              </div>
            </div>
            <div>
              <label htmlFor="tags" className="mb-1 block text-sm font-medium">
                Tags (comma separated)
              </label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="politics, education, leadership"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="mb-1 block text-sm font-medium"
              >
                Content{' '}
                {status === 'published' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your blog post content here..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/blog')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {status === 'published' ? (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    {isSaving ? 'Publishing...' : 'Publish Post'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save as Draft'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
