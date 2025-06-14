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
import { Plus, Edit, Trash, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { BlogPost } from '@/lib/models';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/blog?includeDrafts=true');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`/api/blog/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPosts(posts.filter((post) => post._id?.toString() !== id));
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const togglePostStatus = async (post: BlogPost) => {
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';

      if (newStatus === 'published') {
        if (
          !post.title ||
          !post.date ||
          !post.content ||
          !post.image ||
          !post.author
        ) {
          window.alert('Please fill in all required fields before publishing.');
          return;
        }
      }

      const response = await fetch(`/api/blog/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setPosts(
          posts.map((p) =>
            p._id === post._id ? { ...p, status: newStatus } : p
          )
        );
      }
    } catch (error) {
      window.alert('Error updating post status. Please try again later.');
      console.error('Error updating post status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin')}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
      </div>

      <div className="mb-6 mt-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Button onClick={() => router.push('/admin/blog/create')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Blog Post
        </Button>

        <Tabs
          value={filter}
          onValueChange={(value) =>
            setFilter(value as 'all' | 'published' | 'draft')
          }
        >
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <CardTitle>Blog Posts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">Loading blog posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-6 text-center">
              No blog posts found. Add your first post!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post._id?.toString()}>
                    <TableCell className="font-medium underline">
                      <Link href={`/blog/${post._id}`} target="_blank">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {post.date ? formatDate(post.date) : 'No date'}
                    </TableCell>
                    <TableCell>{post.author || 'No author'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === 'published' ? 'success' : 'secondary'
                        }
                      >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/blog/edit/${post._id}`)
                          }
                          title="Edit post"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePostStatus(post)}
                          title={
                            post.status === 'published'
                              ? 'Move to drafts'
                              : 'Publish post'
                          }
                        >
                          {post.status === 'published' ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDelete(post._id?.toString() || '')
                          }
                          title="Delete post"
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
