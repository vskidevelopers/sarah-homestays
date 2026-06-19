// app/(public)/layout.tsx
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <FloatingWhatsApp />
        </>
    );
}