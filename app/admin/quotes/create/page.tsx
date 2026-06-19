/* eslint-disable react-hooks/set-state-in-effect */
// app/admin/quotes/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/admin/InvoicePDF';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format, differenceInDays, parseISO } from 'date-fns';

interface Unit {
    id: string;
    name: string;
    location: string;
    nightlyRate: number;
}

export default function CreateQuotePage() {
    const router = useRouter();
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [nightlyRate, setNightlyRate] = useState(0);

    // Derived State
    const selectedUnit = units.find(u => u.id === selectedUnitId);
    const nights = checkIn && checkOut ? Math.max(1, differenceInDays(parseISO(checkOut), parseISO(checkIn))) : 0;
    const totalAmount = nights * nightlyRate;

    useEffect(() => {
        const fetchUnits = async () => {
            const snapshot = await getDocs(collection(db, 'units'));
            setUnits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit)));
            setLoading(false);
        };
        fetchUnits();
    }, []);

    // Auto-fill rate when unit changes
    useEffect(() => {
        if (selectedUnit) {
            setNightlyRate(selectedUnit.nightlyRate);
        }
    }, [selectedUnitId]);

    const handleSaveAndDownload = async () => {
        if (!clientName || !selectedUnit || !checkIn || !checkOut) return;

        setSaving(true);
        try {
            // 1. Save data to Firestore
            const quoteData = {
                clientName,
                clientPhone,
                unitId: selectedUnit.id,
                unitName: selectedUnit.name,
                location: selectedUnit.location,
                checkIn,
                checkOut,
                nights,
                nightlyRate,
                totalAmount,
                createdAt: new Date().toISOString(),
            };

            await addDoc(collection(db, 'quotes'), quoteData);

            // 2. The PDFDownloadLink will handle the download automatically via its `document` prop
            // We just need to wait a tick for the UI to update if we were using a button, 
            // but since we are using the Link component, we can just redirect after a brief delay.
            setTimeout(() => router.push('/admin/quotes'), 1000);
        } catch (error) {
            console.error("Error saving quote:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    const invoiceData = {
        clientName,
        clientPhone,
        unitName: selectedUnit?.name || 'N/A',
        location: selectedUnit?.location || 'N/A',
        checkIn: checkIn ? format(parseISO(checkIn), 'MMM dd, yyyy') : 'N/A',
        checkOut: checkOut ? format(parseISO(checkOut), 'MMM dd, yyyy') : 'N/A',
        nights,
        nightlyRate,
        totalAmount,
        createdAt: format(new Date(), 'MMM dd, yyyy'),
    };

    return (
        <div className="p-6 md:p-12 max-w-5xl mx-auto">
            <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Form */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-display text-2xl">New Quote</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Client Name</Label>
                                <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="0712..." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Select Unit</Label>
                            <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
                                <SelectTrigger><SelectValue placeholder="Choose a unit..." /></SelectTrigger>
                                <SelectContent>
                                    {units.map(unit => (
                                        <SelectItem key={unit.id} value={unit.id}>
                                            {unit.name} ({unit.location})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Check-in</Label>
                                <Input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Check-out</Label>
                                <Input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nightly Rate (KES)</Label>
                                <Input type="number" value={nightlyRate} onChange={e => setNightlyRate(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Nights</Label>
                                <Input value={nights} disabled className="bg-secondary" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-muted-foreground font-medium">Total Amount</span>
                                <span className="font-display text-3xl text-accent">KES {totalAmount.toLocaleString()}</span>
                            </div>

                            {/* The Magic Button: Saves to Firestore AND Downloads PDF */}
                            <PDFDownloadLink
                                document={<InvoicePDF data={invoiceData} />}
                                fileName={`Invoice_${clientName.replace(/\s+/g, '_')}_${checkIn}.pdf`}
                                className="w-full"
                            >
                                {({ blob, url, loading, error }) => (
                                    <Button
                                        onClick={handleSaveAndDownload}
                                        disabled={saving || !clientName || !selectedUnitId || !checkIn || !checkOut}
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                                    >
                                        {saving ? (
                                            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...</>
                                        ) : (
                                            <><FileDown className="w-5 h-5 mr-2" /> Save & Download Invoice</>
                                        )}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Visual Summary (Desktop Only) */}
                <div className="hidden lg:block">
                    <Card className="bg-secondary/30 border-none sticky top-8">
                        <CardContent className="p-8">
                            <h3 className="font-display text-xl mb-6 text-foreground">Summary</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">Guest</span><span>{clientName || '-'}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Unit</span><span>{selectedUnit?.name || '-'}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Dates</span><span>{checkIn && checkOut ? `${checkIn} to ${checkOut}` : '-'}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Nights</span><span>{nights}</span></div>
                                <div className="h-px bg-border my-4" />
                                <div className="flex justify-between text-lg font-bold text-foreground">
                                    <span>Total</span>
                                    <span className="text-accent">KES {totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}