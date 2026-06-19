// app/loading.tsx
import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="text-sm text-muted-foreground tracking-widest uppercase">Loading</p>
            </div>
        </div>
    );
}