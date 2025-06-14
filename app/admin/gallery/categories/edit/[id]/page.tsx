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
import type { GalleryCategory } from "@/lib/models";

export default function EditGalleryCategory({
  params,
}: {
  params: { id: string };
}) {
  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/gallery/categories/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCategory(data);
          setName(data.name);
          setDescription(data.description || "");
        } else {
          setError("Category not found");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch category");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/gallery/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (response.ok) {
        router.push("/admin/gallery/categories");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update category");
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
        Loading category...
      </div>
    );
  }

  if (!category && !isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive">
          <AlertDescription>Category not found</AlertDescription>
        </Alert>
        <Button
          onClick={() => router.push("/admin/gallery/categories")}
          className="mt-4"
        >
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/gallery/categories")}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Gallery Category</h1>
      </div>

      <Card>
        <CardHeader className="bg-navy text-white">
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Category Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium"
              >
                Description (Optional)
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Update Category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
