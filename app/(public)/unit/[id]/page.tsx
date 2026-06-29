// app/(public)/unit/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Unit } from '@/types';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';

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
        <main className="bg-background text-foreground">
            {/* Navigation Header (Glassmorphism) */}
            <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <Link href="/" className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="text-white font-display text-sm md:text-lg tracking-wide drop-shadow-md">
                    {unit.location}
                </span>
                <div className="w-9" /> {/* Spacer for centering */}
            </div>

            {/* --- THE GALLERY --- */}
            {/* Mobile: Horizontal Swipe (Native App Feel) */}
            {/* Desktop: Parallax Hero */}
            <section className="relative w-full h-[100vh] md:h-[90vh] overflow-hidden">

                {/* Mobile Carousel */}
                <div className="md:hidden flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {unit.images.map((img, index) => (
                        <div key={index} className="relative min-w-full h-full snap-center shrink-0">
                            <Image
                                src={img}
                                alt={`${unit.name} view ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            {/* Image Counter Pill */}
                            <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                                {index + 1} / {unit.images.length}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Parallax Hero */}
                <div className="hidden md:block relative w-full h-full overflow-hidden">
                    <motion.div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: `url(${unit.heroImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        // Parallax Effect: Image moves slower than scroll
                        initial={{ scale: 1.1 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    {/* Gradient Overlay for text readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                </div>
            </section>

            {/* --- CONTENT SECTION --- */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-24 -mt-12 md:-mt-24">

                {/* Mobile: White Card overlapping the gallery */}
                <div className="md:bg-transparent bg-background p-6 md:p-0 rounded-t-3xl md:rounded-none shadow-2xl md:shadow-none">

                    {/* Title Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-12"
                    >
                        <p className="text-accent text-xs md:text-sm uppercase tracking-[0.3em] mb-3 font-medium">
                            {unit.type} &middot; {unit.location}
                        </p>
                        <h1 className="font-display text-4xl md:text-7xl text-foreground mb-6 leading-[0.9] tracking-tight">
                            {unit.name}
                        </h1>

                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-accent" />
                                Smart Home Features
                            </span>
                            <span>&middot;</span>
                            <span>Flexible Check-in</span>
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-16"
                    >
                        <h2 className="font-display text-2xl text-foreground mb-6">The Space</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed font-light max-w-2xl">
                            {unit.description}
                        </p>
                    </motion.div>

                    {/* Amenities Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mb-16"
                    >
                        <h2 className="font-display text-2xl text-foreground mb-6">Amenities</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {unit.amenities.map((amenity, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-sm border border-border/50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    <span className="text-sm md:text-base text-foreground">{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Desktop Only: Secondary Gallery Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="hidden md:grid grid-cols-2 gap-4 mb-16"
                    >
                        {unit.images.slice(1).map((img, index) => (
                            <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-sm group">
                                <Image
                                    src={img}
                                    alt={`Gallery ${index}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        ))}
                    </motion.div>

                    {/* Pricing & CTA (Desktop View) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="hidden md:flex flex-row items-center justify-between p-8 bg-secondary/30 rounded-sm border border-border backdrop-blur-sm"
                    >
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                Starting from
                            </p>
                            <p className="font-display text-4xl text-foreground">
                                KES {unit.nightlyRate.toLocaleString()}
                                <span className="text-base font-sans text-muted-foreground font-normal"> / night</span>
                            </p>
                        </div>

                        <Button
                            asChild
                            size="lg"
                            className="bg-accent text-primary hover:bg-accent/90 text-lg px-10 py-7 rounded-sm font-medium shadow-xl shadow-accent/20 transition-all hover:scale-105"
                        >
                            <a
                                href={`https://wa.me/254722323471?text=Hi%20Sarah,%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(unit.name)}%20in%20${encodeURIComponent(unit.location)}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Book via WhatsApp
                            </a>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* --- STICKY MOBILE CTA --- */}
            {/* This is crucial for mobile conversion. It stays at the bottom, always visible. */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/90 backdrop-blur-lg border-t border-border shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Starts at</p>
                        <p className="font-display text-xl text-foreground leading-none">KES {unit.nightlyRate.toLocaleString()}</p>
                    </div>
                    <Button
                        asChild
                        size="lg"
                        className="flex-1 bg-accent text-primary hover:bg-accent/90 font-bold rounded-full py-6 shadow-lg"
                    >
                        <a
                            href={`https://wa.me/254722323471?text=Hi%20Sarah,%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(unit.name)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Book Now
                        </a>
                    </Button>
                </div>
            </div>
        </main>
    );
}