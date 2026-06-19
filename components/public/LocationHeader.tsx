// components/public/LocationHeader.tsx
export default function LocationHeader({ location }: { location: string }) {
    return (
        <div className="py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="flex items-center gap-6">
                <div className="h-[1px] w-16 bg-[var(--gold-500)]" />
                <h2 className="font-display text-4xl md:text-6xl text-[var(--foreground)] tracking-tight uppercase">
                    {location}
                </h2>
            </div>
        </div>
    );
}