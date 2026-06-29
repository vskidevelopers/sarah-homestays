// components/admin/InvoicePDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register standard fonts (Using Helvetica for clean, professional look)
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf' }, // Fallback
        { src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica-Bold.ttf', fontWeight: 'bold' },
    ]
});

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', color: '#2A2420' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, borderBottom: 2, borderColor: '#C4A035', paddingBottom: 20 },
    brandName: { fontSize: 24, fontWeight: 'bold', color: '#1E2560', letterSpacing: 1 },
    brandTagline: { fontSize: 10, color: '#6B6560', marginTop: 4 },
    invoiceTitle: { fontSize: 28, fontWeight: 'bold', color: '#1E2560', textAlign: 'right' },
    invoiceNumber: { fontSize: 10, color: '#6B6560', textAlign: 'right', marginTop: 4 },

    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#1E2560', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },

    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, fontSize: 11 },
    label: { color: '#6B6560', width: '40%' },
    value: { fontWeight: 'bold', width: '60%', textAlign: 'right' },

    totalSection: { marginTop: 40, paddingTop: 20, borderTop: 1, borderColor: '#D9D2C4' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 14 },
    totalLabel: { fontWeight: 'bold', color: '#1E2560' },
    totalValue: { fontWeight: 'bold', fontSize: 18, color: '#C4A035' },

    footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: '#6B6560', borderTop: 1, borderColor: '#D9D2C4', paddingTop: 15 },
    mpesaBox: { backgroundColor: '#F2EDE4', padding: 15, borderRadius: 4, marginTop: 20, alignItems: 'center' },
    mpesaText: { fontSize: 10, color: '#1E2560', fontWeight: 'bold' },
});

interface InvoiceData {
    clientName: string;
    clientPhone: string;
    unitName: string;
    location: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    nightlyRate: number;
    totalAmount: number;
    createdAt: string;
}

export const InvoicePDF = ({ data }: { data: InvoiceData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.brandName}>SARAH HOMESTAY</Text>
                    <Text style={styles.brandTagline}>A home away from home</Text>
                </View>
                <View>
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
                    <Text style={styles.invoiceNumber}>Date: {data.createdAt}</Text>
                </View>
            </View>

            {/* Bill To */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bill To</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>{data.clientName}</Text>
                <Text style={{ fontSize: 11, color: '#6B6560' }}>{data.clientPhone}</Text>
            </View>

            {/* Stay Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stay Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Property</Text>
                    <Text style={styles.value}>{data.unitName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Location</Text>
                    <Text style={styles.value}>{data.location}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Check-in</Text>
                    <Text style={styles.value}>{data.checkIn}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Check-out</Text>
                    <Text style={styles.value}>{data.checkOut}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Duration</Text>
                    <Text style={styles.value}>{data.nights} Night{data.nights > 1 ? 's' : ''}</Text>
                </View>
            </View>

            {/* Financials */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Charges</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Nightly Rate</Text>
                    <Text style={styles.value}>KES {data.nightlyRate.toLocaleString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Subtotal</Text>
                    <Text style={styles.value}>KES {(data.nightlyRate * data.nights).toLocaleString()}</Text>
                </View>
            </View>

            {/* Total & Payment */}
            <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TOTAL DUE</Text>
                    <Text style={styles.totalValue}>KES {data.totalAmount.toLocaleString()}</Text>
                </View>

                <View style={styles.mpesaBox}>
                    <Text style={{ fontSize: 9, color: '#6B6560', marginBottom: 4 }}>PAYMENT DETAILS</Text>
                    <Text style={styles.mpesaText}>M-Pesa Paybill / Send Money</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1E2560', marginTop: 4 }}>+254 722 323 471</Text>
                    <Text style={{ fontSize: 9, color: '#6B6560', marginTop: 4 }}>Name: Sarah Homestays</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Thank you for choosing Sarah Homestay. We look forward to hosting you.</Text>
                <Text style={{ marginTop: 4 }}>For inquiries, contact us via WhatsApp: +254 722 323 471</Text>
            </View>
        </Page>
    </Document>
);