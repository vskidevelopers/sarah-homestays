// types/index.ts
export interface Unit {
  id: string;
  name: string;
  location: string;
  type: string;
  description: string;
  nightlyRate: number;
  amenities: string[];
  heroImage: string;
  images: string[]; // NEW: Array of Cloudinary URLs for the gallery
  isActive: boolean;
}
