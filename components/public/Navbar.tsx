// components/public/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'Kilimani', href: '/#kilimani' },
    { name: 'Malindi', href: '/#malindi' },
    { name: 'Nanyuki', href: '/#nanyuki' },
    { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isMobileOpen]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${isScrolled
                    ? 'bg-background/90 backdrop-blur-md shadow-sm py-4' // Fixed: bg-background/90
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    {/* Logo / Brand */}
                    <Link href="/" className="relative z-50">
                        <img
                            src="/sarahome-logo.svg"
                            alt="Sarah Homestay Logo"
                            className="h-10 md:h-12 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-accent ${isScrolled ? 'text-foreground' : 'text-background' // Fixed: text-background
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="https://wa.me/254722323471"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-5 py-2 text-sm font-medium rounded-sm transition-all duration-300 ${isScrolled
                                ? 'bg-foreground text-background hover:bg-accent hover:text-foreground'
                                : 'bg-accent text-foreground hover:bg-background'
                                }`}
                        >
                            Book Now
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className={`md:hidden relative z-50 p-2 transition-colors ${isScrolled || isMobileOpen ? 'text-foreground' : 'text-background' // Fixed: text-background
                            }`}
                    >
                        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Full-Screen Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-30 bg-background flex flex-col items-center justify-center gap-8"
                    >
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="font-display text-4xl text-foreground hover:text-accent transition-colors"
                            >
                                {link.name}
                            </motion.a>
                        ))}
                        <motion.a
                            href="https://wa.me/254722323471"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="mt-4 px-8 py-3 bg-accent text-foreground font-medium rounded-sm"
                        >
                            Chat on WhatsApp
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}