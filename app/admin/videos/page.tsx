"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash, ArrowLeft } from "lucide-react";
import type { Video } from "@/lib/models";

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos");
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await fetch(`/api/videos/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setVideos(videos.filter((video) => video._id?.toString() !== id));
        }
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin")}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Manage Videos</h1>
      </div>

      <div className="mb-6 flex justify-end">
        <Button onClick={() => router.push("/admin/videos/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Video
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <CardTitle>Videos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="p-6 text-center">
              No videos found. Add your first video!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video._id?.toString()}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell className="font-medium">{video.href}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/videos/edit/${video._id}`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDelete(video._id?.toString() || "")
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
