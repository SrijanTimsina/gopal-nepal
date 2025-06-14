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
import type { Video } from "@/lib/models";
import ImageInput from "@/components/ImageInput";

export default function EditVideo({ params }: { params: { id: string } }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [href, setHref] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${id}`);
        if (response.ok) {
          const data = await response.json();
          setVideo(data);
          setTitle(data.title);
          setDescription(data.description);
          setHref(data.href);
          setThumbnailUrl(data.thumbnailUrl);
        } else {
          setError("Video not found");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch video");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          href,
          thumbnailUrl,
        }),
      });

      if (response.ok) {
        router.push("/admin/videos");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update video");
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
      <div className="container mx-auto p-4 text-center">Loading video...</div>
    );
  }

  if (!video && !isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive">
          <AlertDescription>Video not found</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/videos")} className="mt-4">
          Back to Videos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/videos")}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Video</h1>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <CardTitle>Video Details</CardTitle>
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
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="href" className="mb-1 block text-sm font-medium">
                YouTube Video Link
              </label>
              <Input
                id="href"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                required
              />
            </div>
            <div>
              <ImageInput
                label="Thumbnail"
                setValue={(url) => setThumbnailUrl(url)}
                defaultValue={thumbnailUrl}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Update Video"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
