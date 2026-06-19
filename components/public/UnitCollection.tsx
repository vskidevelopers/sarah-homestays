// components/public/UnitCollection.tsx
'use client';

import { motion } from 'framer-motion';
import { useUnits } from '@/hooks/useUnits';
import { Unit } from '@/types';
import LocationHeader from './LocationHeader';
import UnitShowcase from './UnitShowcase';
import { Loader2 } from 'lucide-react';

export default function UnitCollection() {
    const { data: units, isLoading, isError } = useUnits();

    if (isLoading) {
        return (
            <section className="h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </section>
        );
    }

    if (isError || !units) {
        return (
            <section className="h-screen flex items-center justify-center bg-background">
                <p className="text-muted-foreground">Unable to load collection.</p>
            </section>
        );
    }

    // Group units by location
    const unitsByLocation = units.reduce((acc, unit) => {
        if (!acc[unit.location]) acc[unit.location] = [];
        acc[unit.location].push(unit);
        return acc;
    }, {} as Record<string, Unit[]>);

    const locationOrder = ['Kilimani', 'Malindi', 'Nanyuki'];

    return (
        <section className="py-12 bg-background">
            {locationOrder.map((location) => {
                const locationUnits = unitsByLocation[location];
                if (!locationUnits || locationUnits.length === 0) return null;

                return (
                    <motion.div
                        key={location}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1 }}
                    >
                        <LocationHeader location={location} />
                        <div className="flex flex-col">
                            {locationUnits.map((unit, index) => (
                                <UnitShowcase key={unit.id} unit={unit} index={index} />
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </section>
    );
}