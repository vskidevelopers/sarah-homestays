// app/admin/quotes/page.tsx
'use client';

import { useQuotes } from '@/hooks/useQuotes';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/admin/InvoicePDF';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileDown, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function QuotesPage() {
    const { data: quotes, isLoading } = useQuotes();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredQuotes = quotes?.filter(quote =>
        quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.unitName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-3xl md:text-4xl text-foreground">Quote History</h1>
                    <p className="text-muted-foreground mt-1">View and re-download past invoices.</p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/admin/quotes/create">
                        <Plus className="w-4 h-4 mr-2" /> New Quote
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by client name or unit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-secondary/50 border-none"
                />
            </div>

            {/* Quotes List */}
            {filteredQuotes && filteredQuotes.length > 0 ? (
                <div className="space-y-4">
                    {filteredQuotes.map((quote) => {
                        const invoiceData = {
                            clientName: quote.clientName,
                            clientPhone: quote.clientPhone,
                            unitName: quote.unitName,
                            location: quote.location,
                            checkIn: format(parseISO(quote.checkIn), 'MMM dd, yyyy'),
                            checkOut: format(parseISO(quote.checkOut), 'MMM dd, yyyy'),
                            nights: quote.nights,
                            nightlyRate: quote.nightlyRate,
                            totalAmount: quote.totalAmount,
                            createdAt: format(parseISO(quote.createdAt), 'MMM dd, yyyy'),
                        };

                        return (
                            <Card key={quote.id} className="border-border/50 hover:border-accent/50 transition-colors group">
                                <CardContent className="p-4 md:p-6">
                                    {/* Mobile Layout */}
                                    <div className="flex flex-col gap-4 md:hidden">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-foreground text-lg">{quote.clientName}</h3>
                                                <p className="text-sm text-muted-foreground">{quote.unitName}</p>
                                            </div>
                                            <span className="font-display text-xl text-accent">
                                                KES {quote.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-border/50">
                                            <span className="text-xs text-muted-foreground">
                                                {format(parseISO(quote.checkIn), 'MMM dd')} - {format(parseISO(quote.checkOut), 'MMM dd, yyyy')}
                                            </span>
                                            <PDFDownloadLink
                                                document={<InvoicePDF data={invoiceData} />}
                                                fileName={`Invoice_${quote.clientName.replace(/\s+/g, '_')}_${quote.checkIn}.pdf`}
                                            >
                                                <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
                                                    <FileDown className="w-4 h-4 mr-2" /> Download
                                                </Button>
                                            </PDFDownloadLink>
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                                        <div className="col-span-3">
                                            <h3 className="font-medium text-foreground">{quote.clientName}</h3>
                                            <p className="text-sm text-muted-foreground">{quote.clientPhone}</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-sm font-medium text-foreground">{quote.unitName}</p>
                                            <p className="text-xs text-muted-foreground">{quote.location}</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-sm text-foreground">
                                                {format(parseISO(quote.checkIn), 'MMM dd, yyyy')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{quote.nights} night{quote.nights > 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <span className="font-display text-lg text-accent">
                                                KES {quote.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <PDFDownloadLink
                                                document={<InvoicePDF data={invoiceData} />}
                                                fileName={`Invoice_${quote.clientName.replace(/\s+/g, '_')}_${quote.checkIn}.pdf`}
                                            >
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hover:bg-accent/10">
                                                    <FileDown className="w-4 h-4" />
                                                </Button>
                                            </PDFDownloadLink>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">
                        {searchTerm ? 'No quotes match your search.' : 'No quotes created yet.'}
                    </p>
                    {!searchTerm && (
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="/admin/quotes/create">Create your first quote</Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}