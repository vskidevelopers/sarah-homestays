// app/admin/units/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

export default function NewUnitPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [nightlyRate, setNightlyRate] = useState('');
    const [amenities, setAmenities] = useState(''); // Comma separated
    const [images, setImages] = useState<string[]>([]);

    const handleSave = async () => {
        if (!name || !location || !type || !nightlyRate || images.length === 0) {
            alert('Please fill in all required fields and add at least one image.');
            return;
        }

        setSaving(true);
        try {
            await addDoc(collection(db, 'units'), {
                name,
                location,
                type,
                description,
                nightlyRate: Number(nightlyRate),
                amenities: amenities.split(',').map(a => a.trim()).filter(a => a),
                heroImage: images[0], // First image is the hero
                images,
                isActive: true,
                createdAt: new Date().toISOString(),
            });
            router.push('/admin/units');
        } catch (error) {
            console.error('Error saving unit:', error);
            alert('Failed to save unit.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-3xl mx-auto pb-24">
            <Link href="/admin/units" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Units
            </Link>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="font-display text-2xl">Add New Unit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* The Basics */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-accent uppercase tracking-wider">The Basics</h3>
                        <div className="space-y-2">
                            <Label>Unit Name *</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Kindaruma Smart Studio" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Location *</Label>
                                <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Kilimani">Kilimani</SelectItem>
                                        <SelectItem value="Malindi">Malindi</SelectItem>
                                        <SelectItem value="Nanyuki">Nanyuki</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Unit Type *</Label>
                                <Input value={type} onChange={e => setType(e.target.value)} placeholder="e.g., Studio, 1 Bedroom" />
                            </div>
                        </div>
                    </div>

                    {/* The Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-accent uppercase tracking-wider">The Details</h3>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe the vibe and key features..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nightly Rate (KES) *</Label>
                                <Input type="number" value={nightlyRate} onChange={e => setNightlyRate(e.target.value)} placeholder="5000" />
                            </div>
                            <div className="space-y-2">
                                <Label>Amenities</Label>
                                <Input value={amenities} onChange={e => setAmenities(e.target.value)} placeholder="WiFi, Pool, Gym (comma separated)" />
                            </div>
                        </div>
                    </div>

                    {/* The Visuals */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-accent uppercase tracking-wider">The Visuals *</h3>
                        <ImageUploader images={images} setImages={setImages} label="Upload Property Photos" />
                        <p className="text-xs text-muted-foreground">The first photo uploaded will be used as the main cover image.</p>
                    </div>

                    {/* Action */}
                    <div className="pt-6 border-t border-border">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Unit</>}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}