// components/admin/AdminGuard.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // 1. If we are on the login page, bypass the protection logic.
        if (pathname === '/admin/login') {
            // Bonus: If she is already logged in and somehow visits the login page, kick her to the dashboard
            if (!loading && user) {
                router.replace('/admin');
            }
            return;
        }

        // 2. If we are on a protected page and she is NOT logged in, redirect to login.
        if (!loading && !user) {
            router.replace('/admin/login');
        }
    }, [user, loading, router, pathname]);

    // 3. ALWAYS render the children if she is on the login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // 4. Show loading state while checking auth on protected pages
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

    // 5. If not logged in and not on login page, render nothing while the redirect happens
    if (!user) return null;

    // 6. Authenticated and on a protected route
    return <>{children}</>;
}