// app/admin/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Home, Settings } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="p-6 md:p-12 max-w-5xl mx-auto">
            <h1 className="font-display text-4xl text-foreground mb-2">Welcome back, Sarah.</h1>
            <p className="text-muted-foreground mb-12">What would you like to do today?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/admin/quotes/create" className="group">
                    <div className="p-8 border border-border/50 rounded-sm hover:border-accent/50 hover:bg-secondary/30 transition-all h-full flex flex-col justify-between">
                        <FileText className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                        <div>
                            <h3 className="font-display text-xl text-foreground mb-1">New Quote</h3>
                            <p className="text-sm text-muted-foreground">Generate an invoice for a client.</p>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/quotes" className="group">
                    <div className="p-8 border border-border/50 rounded-sm hover:border-accent/50 hover:bg-secondary/30 transition-all h-full flex flex-col justify-between">
                        <FileText className="w-8 h-8 text-foreground mb-4 group-hover:scale-110 transition-transform" />
                        <div>
                            <h3 className="font-display text-xl text-foreground mb-1">Quote History</h3>
                            <p className="text-sm text-muted-foreground">View and re-download past invoices.</p>
                        </div>
                    </div>
                </Link>

                {/* Placeholder for future Unit Management */}
                <Link href="/admin/units" className="group">
                    <div className="p-8 border border-border/50 rounded-sm hover:border-accent/50 hover:bg-secondary/30 transition-all h-full flex flex-col justify-between">
                        <Home className="w-8 h-8 text-foreground mb-4 group-hover:scale-110 transition-transform" />
                        <div>
                            <h3 className="font-display text-xl text-foreground mb-1">Manage Units</h3>
                            <p className="text-sm text-muted-foreground">Add, edit, and organize your properties.</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}