import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { Quotation } from '@/types';

// Register fonts for professional look
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  logo: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 700,
    color: '#2563eb',
    letterSpacing: 1,
  },
  logoSubtext: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.5,
  },
  // Document Title
  documentTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 6,
  },
  quotationTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
  },
  quotationNumber: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'right',
  },
  quotationMeta: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 4,
  },
  // Client Section
  clientSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  clientBox: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 6,
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 600,
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 4,
  },
  clientDetail: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 1.6,
  },
  // Table
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    padding: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'center' },
  col4: { width: '20%', textAlign: 'right' },
  programName: {
    fontSize: 11,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 2,
  },
  programDesc: {
    fontSize: 9,
    color: '#64748b',
  },
  cellText: {
    fontSize: 10,
    color: '#475569',
  },
  priceText: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1e293b',
  },
  // Totals
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 25,
  },
  totalsBox: {
    width: 250,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 5,
    borderTopWidth: 2,
    borderTopColor: '#2563eb',
  },
  totalLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1e293b',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2563eb',
  },
  discountText: {
    fontSize: 9,
    color: '#16a34a',
  },
  // Notes Section
  notesSection: {
    marginBottom: 25,
    backgroundColor: '#fffbeb',
    padding: 15,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  notesLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: '#92400e',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 10,
    color: '#78350f',
    lineHeight: 1.6,
  },
  // Terms Section
  termsSection: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  termsTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 10,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  termBullet: {
    fontSize: 9,
    color: '#2563eb',
    marginRight: 8,
  },
  termText: {
    fontSize: 9,
    color: '#64748b',
    flex: 1,
    lineHeight: 1.5,
  },
  // Validity Banner
  validityBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 6,
    marginBottom: 25,
  },
  validityText: {
    fontSize: 10,
    fontWeight: 600,
    color: '#166534',
  },
  // CTA Section
  ctaSection: {
    textAlign: 'center',
    backgroundColor: '#2563eb',
    padding: 20,
    borderRadius: 6,
    marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 10,
    color: '#bfdbfe',
  },
  ctaContact: {
    fontSize: 11,
    fontWeight: 600,
    color: '#ffffff',
    marginTop: 8,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    marginBottom: 3,
  },
  footerLink: {
    fontSize: 9,
    color: '#2563eb',
    fontWeight: 500,
  },
});

interface QuotationPDFProps {
  quotation: Quotation;
}

export default function QuotationPDF({ quotation }: QuotationPDFProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `K${amount.toLocaleString('en-ZM')}`;
  };

  const termsArray: string[] = quotation.terms?.split('\n').filter((t: string) => t.trim()) || [
    '1. This quotation is valid for 14 days from the date of issue.',
    '2. Payment is due upon enrollment confirmation.',
    '3. All fees are quoted in Zambian Kwacha (ZMW).',
    '4. Materials and equipment are included in the program fees.',
    '5. Classes are held at ROBOTIX Institute, Lusaka.',
    '6. A minimum of 48 hours notice is required for class rescheduling.',
    '7. Refunds are available within 7 days of enrollment if unsatisfied.',
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>ROBOTIX</Text>
            <Text style={styles.logoSubtext}>Institute of Technology</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>Hive Coworking / BongoHive, Great East Road</Text>
            <Text>Lusaka, Zambia</Text>
            <Text>Phone: +260 956 355 117</Text>
            <Text>Email: info@robotixinstitute.io</Text>
            <Text>www.robotixinstitute.io</Text>
          </View>
        </View>

        {/* Document Title */}
        <View style={styles.documentTitle}>
          <Text style={styles.quotationTitle}>QUOTATION</Text>
          <View>
            <Text style={styles.quotationNumber}>{quotation.quotationNumber}</Text>
            <Text style={styles.quotationMeta}>Date: {formatDate(quotation.createdAt)}</Text>
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.clientSection}>
          <View style={styles.clientBox}>
            <Text style={styles.sectionLabel}>Bill To</Text>
            <Text style={styles.clientName}>{quotation.parentName}</Text>
            <Text style={styles.clientDetail}>{quotation.parentEmail}</Text>
            <Text style={styles.clientDetail}>{quotation.parentPhone}</Text>
          </View>
          <View style={styles.clientBox}>
            <Text style={styles.sectionLabel}>Student Details</Text>
            <Text style={styles.clientName}>{quotation.childName}</Text>
            <Text style={styles.clientDetail}>Age: {quotation.childAge} years old</Text>
          </View>
        </View>

        {/* Validity Banner */}
        <View style={styles.validityBanner}>
          <Text style={styles.validityText}>
            ✓ This quotation is valid until {formatDate(quotation.validUntil)}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>Program</Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Duration</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>Sessions/Week</Text>
            <Text style={[styles.tableHeaderText, styles.col4]}>Price/Month</Text>
          </View>
          {quotation.items.map((item: { programName: string; description: string; duration: string; sessionsPerWeek: number; pricePerMonth: number }, index: number) => (
            <View 
              key={index} 
              style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
            >
              <View style={styles.col1}>
                <Text style={styles.programName}>{item.programName}</Text>
                <Text style={styles.programDesc}>{item.description}</Text>
              </View>
              <Text style={[styles.cellText, styles.col2]}>{item.duration}</Text>
              <Text style={[styles.cellText, styles.col3]}>{item.sessionsPerWeek}x weekly</Text>
              <Text style={[styles.priceText, styles.col4]}>{formatCurrency(item.pricePerMonth)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal (per month)</Text>
              <Text style={styles.totalValue}>{formatCurrency(quotation.subtotal)}</Text>
            </View>
            {quotation.discount && quotation.discount > 0 && (
              <View style={styles.totalRow}>
                <View>
                  <Text style={styles.totalLabel}>Discount</Text>
                  {quotation.discountReason && (
                    <Text style={styles.discountText}>{quotation.discountReason}</Text>
                  )}
                </View>
                <Text style={[styles.totalValue, { color: '#16a34a' }]}>
                  -{formatCurrency(quotation.discount)}
                </Text>
              </View>
            )}
            <View style={styles.totalRowFinal}>
              <Text style={styles.totalLabel}>Total (per month)</Text>
              <Text style={styles.grandTotal}>{formatCurrency(quotation.total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {quotation.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Special Notes</Text>
            <Text style={styles.notesText}>{quotation.notes}</Text>
          </View>
        )}

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          {termsArray.map((term: string, index: number) => (
            <View key={index} style={styles.termItem}>
              <Text style={styles.termBullet}>•</Text>
              <Text style={styles.termText}>{term.replace(/^\d+\.\s*/, '')}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Enroll?</Text>
          <Text style={styles.ctaText}>
            Contact us to confirm enrollment and secure your child&apos;s spot
          </Text>
          <Text style={styles.ctaContact}>+260 956 355 117 | info@robotixinstitute.io</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing ROBOTIX Institute - Building Future Innovators
          </Text>
          <Text style={styles.footerLink}>www.robotixinstitute.io</Text>
        </View>
      </Page>
    </Document>
  );
}
