/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// app/admin/units/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Save, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';
import Image from 'next/image';

// Helper to fetch the specific unit
const fetchUnit = async (id: string) => {
    const docRef = doc(db, 'units', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    throw new Error('Unit not found');
};

export default function EditUnitPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { id } = useParams();

    const { data: unit, isLoading } = useQuery<any>({
        queryKey: ['unit', id],
        queryFn: () => fetchUnit(id as string),
        enabled: !!id,
    });

    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [nightlyRate, setNightlyRate] = useState('');
    const [amenities, setAmenities] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [heroImage, setHeroImage] = useState('');
    const [isActive, setIsActive] = useState(true);

    // Pre-fill form when data loads
    useEffect(() => {
        if (unit) {
            setName(unit?.name || '');
            setLocation(unit.location || '');
            setType(unit.type || '');
            setDescription(unit.description || '');
            setNightlyRate(unit.nightlyRate?.toString() || '');
            setAmenities(unit.amenities?.join(', ') || '');
            setImages(unit.images || []);
            setHeroImage(unit.heroImage || '');
            setIsActive(unit.isActive ?? true);
        }
    }, [unit]);

    const handleSave = async () => {
        if (!name || !location || !nightlyRate || images.length === 0 || !heroImage) {
            alert('Please fill all fields and ensure at least one image is marked as the Cover.');
            return;
        }

        setSaving(true);
        try {
            const docRef = doc(db, 'units', id as string);
            await updateDoc(docRef, {
                name,
                location,
                type,
                description,
                nightlyRate: Number(nightlyRate),
                amenities: amenities.split(',').map(a => a.trim()).filter(a => a),
                images,
                heroImage,
                isActive,
                updatedAt: new Date().toISOString(),
            });

            // Refresh the cache so the list page updates instantly
            queryClient.invalidateQueries({ queryKey: ['admin-units'] });
            queryClient.invalidateQueries({ queryKey: ['units'] }); // Updates public site too
            router.push('/admin/units');
        } catch (error) {
            console.error('Error updating unit:', error);
            alert('Failed to update unit.');
        } finally {
            setSaving(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);

        // Smart logic: If she deletes the current cover, auto-assign the next available image as cover
        if (heroImage === images[index]) {
            setHeroImage(newImages.length > 0 ? newImages[0] : '');
        }
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>;
    }

    if (!unit) {
        return <div className="p-8 text-center text-muted-foreground">Unit not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto pb-24">
            <Link href="/admin/units" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Units
            </Link>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="font-display text-2xl">Edit Unit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* The Basics */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-accent uppercase tracking-wider">The Basics</h3>
                        <div className="space-y-2">
                            <Label>Unit Name *</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Location *</Label>
                                <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Kilimani">Kilimani</SelectItem>
                                        <SelectItem value="Malindi">Malindi</SelectItem>
                                        <SelectItem value="Nanyuki">Nanyuki</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Unit Type *</Label>
                                <Input value={type} onChange={e => setType(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* The Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-accent uppercase tracking-wider">The Details</h3>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nightly Rate (KES) *</Label>
                                <Input type="number" value={nightlyRate} onChange={e => setNightlyRate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Amenities (comma sep.)</Label>
                                <Input value={amenities} onChange={e => setAmenities(e.target.value)} />
                            </div>
                        </div>

                        {/* Active/Inactive Toggle */}
                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={e => setIsActive(e.target.checked)}
                                className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                            />
                            <Label htmlFor="isActive" className="cursor-pointer text-sm text-muted-foreground">
                                Mark as Active (Visible on public site)
                            </Label>
                        </div>
                    </div>

                    {/* The Visuals (The Magic Gallery) */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium text-accent uppercase tracking-wider">The Visuals *</h3>
                            <ImageUploader images={images} setImages={setImages} label="" />
                        </div>

                        <p className="text-xs text-muted-foreground -mt-2">
                            Click the <Star className="w-3 h-3 inline text-accent fill-accent" /> to set the Cover Image.
                        </p>

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {images.map((img, index) => (
                                    <div key={index} className="relative aspect-square rounded-sm overflow-hidden border border-border group">
                                        <Image src={img} alt={`Upload ${index}`} fill className="object-cover" />

                                        {/* Cover Selector (Star) */}
                                        <button
                                            type="button"
                                            onClick={() => setHeroImage(img)}
                                            className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm transition-all hover:scale-110"
                                        >
                                            <Star className={`w-4 h-4 ${heroImage === img ? 'fill-accent text-accent' : 'text-white hover:text-accent'}`} />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm t text-white hover:bg-red-500 transition-all md:opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>

                                        {/* Cover Ribbon */}
                                        {heroImage === img && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-accent/90 text-accent-foreground text-[10px] font-bold text-center py-1 uppercase tracking-widest">
                                                Cover
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action */}
                    <div className="pt-6 border-t border-border flex gap-4">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}