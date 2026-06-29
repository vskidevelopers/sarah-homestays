// components/public/UnitShowcase.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Unit } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, Wifi } from 'lucide-react';

interface UnitShowcaseProps {
    unit: Unit;
    index: number;
}

export default function UnitShowcase({ unit, index }: UnitShowcaseProps) {
    // Alternating layout: Even index = Image Left, Odd index = Image Right
    const isReversed = index % 2 !== 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-32 md:mb-48`}
        >
            {/* Image Block */}
            <div className="w-full md:w-3/5 aspect-[4/3] md:aspect-[16/10] relative overflow-hidden rounded-sm bg-[var(--secondary)]">
                <Image
                    src={unit.heroImage}
                    alt={unit.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 60vw"
                />
            </div>

            {/* Content Block */}
            <div className="w-full md:w-2/5 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm uppercase tracking-widest mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{unit.type}</span>
                </div>

                <h3 className="font-display text-3xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight">
                    {unit.name}
                </h3>

                <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-8 font-light">
                    {unit.description}
                </p>

                {/* Minimal Amenities Strip */}
                <div className="flex items-center gap-6 mb-10 text-[var(--foreground)]">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[var(--gold-500)]" />
                        <span className="text-sm">Smart Living</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-[var(--gold-500)]" />
                        <span className="text-sm">High-speed WiFi</span>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div>
                        <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">Starting from</p>
                        <p className="font-display text-2xl text-[var(--foreground)]">
                            KES {unit.nightlyRate.toLocaleString()} <span className="text-base font-sans text-[var(--muted-foreground)]">/ night</span>
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-sm px-6 py-3"
                    >
                        <a href={`/unit/${unit.id}`}>View Details</a>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}