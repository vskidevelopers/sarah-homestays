// app/admin/units/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Unit {
    id: string;
    name: string;
    location: string;
    type: string;
    nightlyRate: number;
    heroImage: string;
    isActive: boolean;
}

export default function UnitsPage() {
    const { data: units, isLoading } = useQuery({
        queryKey: ['admin-units'],
        queryFn: async () => {
            const snapshot = await getDocs(collection(db, 'units'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
        },
    });

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>;
    }

    return (
        <div className="p-6 md:p-12 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-3xl md:text-4xl text-foreground">My Units</h1>
                    <p className="text-muted-foreground mt-1">Manage your property listings.</p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/admin/units/new">
                        <Plus className="w-4 h-4 mr-2" /> Add Unit
                    </Link>
                </Button>
            </div>

            {units && units.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {units.map((unit) => (
                        <Card key={unit.id} className="overflow-hidden border-border/50 hover:border-accent/50 transition-colors group">
                            <div className="aspect-[4/3] relative bg-secondary">
                                <Image src={unit.heroImage} alt={unit.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                {!unit.isActive && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white font-medium">Inactive</span>
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium text-foreground truncate">{unit.name}</h3>
                                        <p className="text-xs text-muted-foreground">{unit.location} &middot; {unit.type}</p>
                                    </div>
                                </div>
                                <p className="font-display text-lg text-accent">KES {unit.nightlyRate.toLocaleString()}<span className="text-xs text-muted-foreground font-sans">/night</span></p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-border rounded-sm">
                    <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No units added yet.</p>
                    <Button asChild variant="outline">
                        <Link href="/admin/units/new">Add your first unit</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}