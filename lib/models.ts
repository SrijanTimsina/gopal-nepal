import type { ObjectId } from 'mongodb';

export interface NewsArticle {
  _id?: ObjectId;
  title: string;
  date: string;
  link: string;
  excerpt: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Video {
  _id: ObjectId;
  title: string;
  description: string;
  href: string;
  thumbnailUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogPost {
  _id: ObjectId;
  title: string;
  date: string;
  content: string;
  image: string;
  author: string;
  tags?: string[];
  status: 'draft' | 'published'; // Add status field
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GalleryCategory {
  _id?: ObjectId;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GalleryImage {
  _id?: ObjectId;
  title: string;
  description?: string;
  imageUrl: string;
  categoryId: string | ObjectId;
  categoryName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimelineItem {
  _id: ObjectId;
  title: string;
  content: string;
  order: number;
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}
