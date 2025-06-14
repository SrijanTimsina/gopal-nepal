"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { NewsArticle } from "@/lib/models";
import ImageInput from "@/components/ImageInput";

export default function EditNewsArticle({
  params,
}: {
  params: { id: string };
}) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [link, setLink] = useState("");
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
          setTitle(data.title);
          setDate(data.date);
          setLink(data.link);
          setExcerpt(data.excerpt);
          setImage(data.image);
        } else {
          setError("Article not found");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          date,
          link,
          excerpt,
          image,
        }),
      });

      if (response.ok) {
        router.push("/admin/news");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update article");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading article...
      </div>
    );
  }

  if (!article && !isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive">
          <AlertDescription>Article not found</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/news")} className="mt-4">
          Back to News
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/news")}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Edit News Article</h1>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <CardTitle>Article Details</CardTitle>
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
                Title
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
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="link" className="mb-1 block text-sm font-medium">
                News Link
              </label>
              <Input
                id="link"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="excerpt"
                className="mb-1 block text-sm font-medium"
              >
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
              />
            </div>

            <div>
              <ImageInput
                label="Featured Image"
                setValue={(url) => setImage(url)}
                defaultValue={image}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Update Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
