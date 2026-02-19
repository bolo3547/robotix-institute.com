import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { renderToBuffer } from '@react-pdf/renderer';
import QuotationPDF from '@/components/pdf/QuotationPDF';
import { Quotation } from '@/types';

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const quotation: Quotation = await request.json();
    
    if (!quotation || !quotation.quotationNumber) {
      return NextResponse.json(
        { success: false, error: 'Invalid quotation data' },
        { status: 400 }
      );
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      QuotationPDF({ quotation }) as React.ReactElement
    );

    // Return PDF as response (convert Buffer to Uint8Array)
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${quotation.quotationNumber}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
