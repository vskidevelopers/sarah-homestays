/* eslint-disable react-hooks/set-state-in-effect */
// components/public/Hero.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Hero() {
    const { scrollY } = useScroll();

    // Parallax and fade effects
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const scale = useTransform(scrollY, [0, 400], [1, 1.08]);
    const y = useTransform(scrollY, [0, 400], [0, 50]);

    const [currentTime, setCurrentTime] = useState<'morning' | 'day' | 'evening'>('day');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setCurrentTime('morning');
        else if (hour < 18) setCurrentTime('day');
        else setCurrentTime('evening');
    }, []);

    const greeting = {
        morning: 'Good morning',
        day: 'Welcome',
        evening: 'Good evening'
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-[var(--navy-800)]">
            {/* Background Image with Ken Burns Effect */}
            <motion.div
                style={{ scale }}
                className="absolute inset-0 z-0"
            >

                <Image
                    src="https://res.cloudinary.com/dlmmsamck/image/upload/v1782660228/b5d831f8-2408-425c-82c5-81fe2d836706_l8nca0.png"
                    alt="Sarah Homestay Kilimani - Luxury apartment at golden hour"
                    fill
                    priority
                    className="object-cover"
                />
                {/* Cinematic linear Overlays */}
                <div className="absolute inset-0 bg-linear-to-r from-[rgba(20,24,64,0.85)] via-[rgba(20,24,64,0.4)] to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-[var(--background)] via-transparent to-transparent h-1/3 bottom-0 top-auto" />
            </motion.div>

            {/* Content Overlay */}
            <motion.div
                style={{ opacity, y }}
                className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 lg:px-24 py-8"
            >


                {/* Center Content */}
                <div className="flex-1 flex items-center max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="text-(--gold-500) text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
                            {greeting[currentTime]}
                        </p>
                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[var(--background)] font-medium leading-[0.95] mb-6">
                            A home away<br />
                            <span className="text-[var(--gold-500)]">from home</span>
                        </h1>
                        <p className="text-[var(--background)]/80 text-lg md:text-xl max-w-md leading-relaxed font-light">
                            Curated stays in Kilimani, Malindi & Nanyuki.
                            Where comfort meets authentic Kenyan hospitality.
                        </p>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-[var(--gold-500)]" />
                        <p className="text-[var(--background)]/70 text-sm tracking-wide">Available now</p>
                    </div>

                    <Button
                        asChild
                        size="lg"
                        className="bg-[var(--gold-500)] text-[var(--navy-800)] hover:bg-[var(--gold-400)] hover:text-[var(--navy-800)] text-base md:text-lg px-8 py-6 rounded-sm font-medium transition-all duration-300 shadow-lg shadow-black/20"
                    >
                        <a
                            href="https://wa.me/254722323471?text=Hi%20Sarah,%20I'm%20interested%20in%20booking%20a%20stay."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Inquire via WhatsApp
                        </a>
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
}