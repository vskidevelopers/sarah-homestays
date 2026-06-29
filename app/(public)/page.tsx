// app/(public)/page.tsx
import ContactSection from '@/components/public/ContactSection';
import Hero from '@/components/public/Hero';
import LocationHeader from '@/components/public/LocationHeader';
import UnitCollection from '@/components/public/UnitCollection';
import UnitShowcase from '@/components/public/UnitShowcase';
import { getActiveUnits } from '@/lib/firestore';
import { Unit } from '@/types';

export default async function HomePage() {
    // Fetch data directly on the server
    const units: Unit[] = await getActiveUnits();

    // Group units by location
    const unitsByLocation = units.reduce((acc, unit) => {
        if (!acc[unit.location]) {
            acc[unit.location] = [];
        }
        acc[unit.location].push(unit);
        return acc;
    }, {} as Record<string, Unit[]>);

    // Define the order of locations
    const locationOrder = ['Kilimani', 'Malindi', 'Nanyuki'];

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <Hero />
            <div id="kilimani">

                <UnitCollection />
            </div>

            <ContactSection />


        </main>
    );
}