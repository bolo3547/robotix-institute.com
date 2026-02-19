'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Loader2, Download, Send, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Quotation } from '@/types';

// Dynamic import PDFViewer (can only render on client)
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div> }
);

// Dynamic import pdf function for download
const QuotationPDF = dynamic(
  () => import('@/components/pdf/QuotationPDF'),
  { ssr: false }
);

interface PDFPreviewModalProps {
  quotation: Quotation;
  isOpen: boolean;
  onClose: () => void;
  onSendEmail?: () => void;
}

export default function PDFPreviewModal({ 
  quotation, 
  isOpen, 
  onClose,
  onSendEmail
}: PDFPreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const QuotationPDFComponent = (await import('@/components/pdf/QuotationPDF')).default;
      
      const blob = await pdf(<QuotationPDFComponent quotation={quotation} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${quotation.quotationNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      // In production, this would call an API to send email with PDF attachment
      // For now, simulate sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onSendEmail) {
        onSendEmail();
      }
      alert(`Quotation ${quotation.quotationNumber} sent successfully to ${quotation.parentEmail}!`);
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Quotation Preview</h2>
            <p className="text-sm text-gray-500">{quotation.quotationNumber} • {quotation.parentName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download PDF
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleSendEmail}
              disabled={isSending}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send to {quotation.parentName.split(' ')[0]}
            </Button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-4 bg-gray-100">
          <PDFViewer 
            width="100%" 
            height="100%" 
            className="rounded-lg shadow-inner"
            showToolbar={false}
          >
            <QuotationPDF quotation={quotation} />
          </PDFViewer>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            Will be sent to: <span className="font-medium text-gray-700">{quotation.parentEmail}</span>
          </div>
          <p className="text-xs text-gray-400">
            Valid until {new Date(quotation.validUntil).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
