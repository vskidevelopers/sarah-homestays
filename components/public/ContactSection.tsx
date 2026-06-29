// components/public/ContactSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail } from 'lucide-react';

export default function ContactSection() {
    return (
        <section id="contact" className="relative py-24 md:py-32 bg-secondary overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Overline */}
                    <p className="text-(--gold-500) text-xs md:text-sm uppercase tracking-[0.3em] mb-4 font-medium">
                        Get in Touch
                    </p>

                    {/* Headline */}
                    <h2 className="font-display text-4xl md:text-6xl text-foreground mb-6 leading-[1.1] tracking-tight">
                        Let&apos;s plan your <span className="italic text-(--gold-500)">perfect</span> stay.
                    </h2>

                    {/* Body Copy */}
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto mb-10 font-light">
                        Whether you&apos;re seeking a smart-enabled sanctuary in Kilimani or a coastal retreat in Malindi,
                        reach out directly to check availability and secure your dates.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {/* Primary: WhatsApp */}
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 py-6 rounded-sm font-medium shadow-lg shadow-accent/20 transition-all hover:scale-105"
                        >
                            <a
                                href="https://wa.me/254722323471?text=Hi%20Sarah,%20I'd%20like%20to%20inquire%20about%20a%20booking."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Chat on WhatsApp
                            </a>
                        </Button>

                        {/* Secondary: Email */}
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto border-foreground/20 text-foreground hover:bg-foreground hover:text-background text-base px-8 py-6 rounded-sm font-medium"
                        >
                            <a
                                href="mailto:hello@sarahhomestay.com"
                                className="flex items-center justify-center gap-2"
                            >
                                <Mail className="w-5 h-5" />
                                Email Us
                            </a>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}