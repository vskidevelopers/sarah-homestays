// components/admin/ImageUploader.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
    images: string[];
    setImages: (images: string[]) => void;
    label?: string;
}

export default function ImageUploader({ images, setImages, label = "Upload Images" }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        const newImages = [...images];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (data.url) {
                    newImages.push(data.url);
                }
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }

        setImages(newImages);
        setUploading(false);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <label className="cursor-pointer">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploading}
                        className="text-xs"
                    >
                        {uploading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Upload className="w-3 h-3 mr-2" />}
                        Add Photos
                    </Button>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                    />
                </label>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-sm overflow-hidden border border-border group">
                            <Image src={img} alt={`Upload ${index}`} fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}