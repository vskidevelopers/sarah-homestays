// app/(public)/unit/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Unit } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fetchUnit = async (id: string): Promise<Unit> => {
    const docRef = doc(db, 'units', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Unit;
    }
    throw new Error('Unit not found');
};

export default function UnitDetailPage() {
    const { id } = useParams();
    const { data: unit, isLoading } = useQuery({
        queryKey: ['unit', id],
        queryFn: () => fetchUnit(id as string),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

    if (!unit) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
                <p className="text-muted-foreground">Unit not found.</p>
                <Link href="/"><Button variant="outline">Return Home</Button></Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background pb-24">
            {/* Navigation Header */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <Link href="/" className="text-background hover:text-accent transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <span className="text-background font-display text-lg tracking-wide">
                    {unit.location}
                </span>
            </div>

            {/* Cinematic Gallery */}
            <section className="relative w-full">
                {/* Desktop Grid / Mobile Scroll Snap */}
                <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-2 md:h-[80vh] h-[60vh] overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none">
                    {unit.images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative w-full h-full min-w-full md:min-w-0 snap-center overflow-hidden bg-secondary ${index === 0 ? 'md:row-span-2' : ''
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${unit.name} view ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={index === 0}
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Details Section */}
            <section className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-accent text-sm uppercase tracking-[0.2em] mb-4 font-medium">
                        {unit.type} &middot; {unit.location}
                    </p>
                    <h1 className="font-display text-4xl md:text-6xl text-foreground mb-8 leading-[1.1]">
                        {unit.name}
                    </h1>

                    <div className="w-full h-[1px] bg-border my-8" />

                    <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-light mb-12">
                        {unit.description}
                    </p>

                    {/* Amenities */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                        {unit.amenities.map((amenity) => (
                            <div key={amenity} className="flex items-center gap-3 text-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                <span className="text-sm md:text-base">{amenity}</span>
                            </div>
                        ))}
                    </div>

                    {/* Pricing & CTA */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 bg-secondary/50 rounded-sm border border-border">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                Starting from
                            </p>
                            <p className="font-display text-3xl text-foreground">
                                KES {unit.nightlyRate.toLocaleString()}
                                <span className="text-base font-sans text-muted-foreground"> / night</span>
                            </p>
                        </div>

                        <Button
                            asChild
                            size="lg"
                            className="bg-accent text-primary hover:bg-accent/90 text-base px-8 py-6 rounded-sm font-medium shadow-lg shadow-black/5"
                        >
                            <a
                                href={`https://wa.me/254701946104?text=Hi%20Sarah,%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(unit.name)}%20in%20${encodeURIComponent(unit.location)}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Book via WhatsApp
                            </a>
                        </Button>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}