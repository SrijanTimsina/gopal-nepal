"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, FolderOpen, ArrowLeft } from "lucide-react";

export default function AdminGallery() {
  const router = useRouter();

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
        <h1 className="text-3xl font-bold">Gallery Management</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="flex items-center">
              <FolderOpen className="mr-2 h-5 w-5" /> Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">
              Manage gallery categories for organizing your images.
            </p>
            <Button onClick={() => router.push("/admin/gallery/categories")}>
              Manage Categories
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" /> Images
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">Upload and manage images in your gallery.</p>
            <Button onClick={() => router.push("/admin/gallery/images")}>
              Manage Images
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
