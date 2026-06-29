// app/admin/layout.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LayoutDashboard, FileText, List, Home, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isMobileOpen]);

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'New Quote', href: '/admin/quotes/create', icon: FileText },
        { name: 'Quote History', href: '/admin/quotes', icon: List },
        { name: 'Manage Units', href: '/admin/units', icon: Home },
    ];

    // Smart active state logic
    const getActiveState = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        if (href === '/admin/quotes') return pathname === '/admin/quotes'; // Prevents highlighting History when on Create
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    return (
        <AdminGuard>
            <div className="min-h-screen flex bg-background">

                {/* --- DESKTOP SIDEBAR --- */}
                <aside className="hidden md:flex flex-col w-64 bg-[#141840] text-(--ivory) fixed h-screen p-6 z-30">
                    <Link href="/admin" className="mb-12">
                        <span className="font-display text-2xl tracking-wide text-(--ivory)">
                            SARAH <span className="text-accent">ADMIN</span>
                        </span>
                    </Link>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = getActiveState(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-accent/10 text-accent border-l-2 border-accent pl-[14px]'
                                        : 'text-(--ivory)/60 hover:text-(--ivory) hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-(--ivory)/60 hover:text-(--ivory) hover:bg-white/5 transition-all mt-auto"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </aside>

                {/* --- MOBILE HEADER --- */}
                <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#141840] text-(--ivory) px-6 py-4 flex justify-between items-center shadow-lg">
                    <span className="font-display text-lg tracking-wide">
                        SARAH <span className="text-accent">ADMIN</span>
                    </span>
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 hover:bg-white/10 rounded-sm transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* --- MOBILE DRAWER --- */}
                {isMobileOpen && (
                    <div className="md:hidden fixed inset-0 z-50 flex">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileOpen(false)}
                        />

                        {/* Drawer Content */}
                        <div className="relative w-72 h-full bg-[#141840] text-(--ivory) p-6 flex flex-col shadow-2xl">
                            <div className="flex justify-between items-center mb-10">
                                <span className="font-display text-xl tracking-wide">
                                    SARAH <span className="text-accent">ADMIN</span>
                                </span>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-sm transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = getActiveState(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all ${isActive
                                                ? 'bg-accent/10 text-accent border-l-2 border-accent pl-[14px]'
                                                : 'text-(--ivory)/60 hover:text-(--ivory) hover:bg-white/5'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-(--ivory)/60 hover:text-(--ivory) hover:bg-white/5 transition-all mt-auto"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}

                {/* --- MAIN CONTENT AREA --- */}
                <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
                    <div className="p-6 md:p-10 max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>

            </div>
        </AdminGuard>
    );
}