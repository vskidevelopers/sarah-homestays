// app/(public)/page.tsx
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
            <UnitCollection />

            {/* The Collection */}
            <section className="py-12">
                {locationOrder.map((location) => {
                    const locationUnits = unitsByLocation[location];
                    if (!locationUnits || locationUnits.length === 0) return null;

                    return (
                        <div key={location}>
                            <LocationHeader location={location} />
                            <div className="flex flex-col">
                                {locationUnits.map((unit, index) => (
                                    <UnitShowcase key={unit.id} unit={unit} index={index} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>
        </main>
    );
}