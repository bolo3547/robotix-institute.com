'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Mail,
  Phone,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { QuotationRequest, Quotation } from '@/types';

// Dynamic import PDF components (client-side only)
const PDFPreviewModal = dynamic(
  () => import('@/components/pdf/PDFPreviewModal'),
  { ssr: false }
);

const programs = [
  { id: 'robotics-foundations', name: 'Robotics Foundations', ageGroup: '6-8 years', price: 2500 },
  { id: 'advanced-robotics', name: 'Advanced Robotics', ageGroup: '9-12 years', price: 3500 },
  { id: 'python', name: 'Python Programming', ageGroup: '10-14 years', price: 3000 },
  { id: 'ai-ml', name: 'AI & Machine Learning', ageGroup: '13-18 years', price: 4500 },
  { id: 'scratch', name: 'Scratch for Kids', ageGroup: '5-8 years', price: 2000 },
  { id: 'web-dev', name: 'Web Development', ageGroup: '12-16 years', price: 3200 },
  { id: 'electronics', name: 'Electronics Basics', ageGroup: '8-12 years', price: 2800 },
];

const programDetails: Record<string, { name: string; price: number; duration: string; sessions: number; description: string }> = {
  'robotics-foundations': { name: 'Robotics Foundations', price: 2500, duration: '3 months', sessions: 2, description: 'Introduction to robotics and basic programming concepts' },
  'advanced-robotics': { name: 'Advanced Robotics', price: 3500, duration: '6 months', sessions: 2, description: 'Complex builds and competition preparation' },
  'python': { name: 'Python Programming', price: 3000, duration: '4 months', sessions: 2, description: 'Python fundamentals and game development' },
  'ai-ml': { name: 'AI & Machine Learning', price: 4500, duration: '8 months', sessions: 3, description: 'AI fundamentals and neural networks' },
  'scratch': { name: 'Scratch for Kids', price: 2000, duration: '2 months', sessions: 2, description: 'Visual coding for young beginners' },
  'web-dev': { name: 'Web Development', price: 3200, duration: '5 months', sessions: 2, description: 'HTML, CSS, JavaScript web skills' },
  'electronics': { name: 'Electronics Basics', price: 2800, duration: '3 months', sessions: 2, description: 'Circuits and electronic components' },
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
};

// Generate quotation number
function generateQuotationNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ROBOTIX-${year}${month}-${random}`;
}

// Quotation requests and quotations fetched from API (no mock data)

export default function AdminQuotationsPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'sent'>('requests');
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<QuotationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // PDF Preview state
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);

  // Quote form state
  const [discount, setDiscount] = useState(0);
  const [discountReason, setDiscountReason] = useState('');
  const [notes, setNotes] = useState('');
  const [validDays, setValidDays] = useState(14);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const reqRes = await fetch('/api/quotations');
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        if (reqData.data && reqData.data.length > 0) {
          // Map Prisma QuoteRequest fields to QuotationRequest type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: QuotationRequest[] = reqData.data.map((r: any) => ({
            id: r.id,
            parentName: r.name || r.parentName || '',
            parentEmail: r.email || r.parentEmail || '',
            parentPhone: r.phone || r.parentPhone || '',
            childName: r.organization || r.childName || '',
            childAge: r.numberOfStudents || r.childAge || 0,
            programs: r.programInterest
              ? r.programInterest.split(',').map((s: string) => s.trim())
              : r.programs || [],
            message: r.message || undefined,
            preferredSchedule: undefined,
            createdAt: new Date(r.createdAt),
            status: r.status === 'pending' ? 'pending' : 'sent',
          }));
          setRequests(mapped);
        } else {
          setRequests([]);
        }
      }

      const quoteRes = await fetch('/api/admin/quotations');
      if (quoteRes.ok) {
        const quoteData = await quoteRes.json();
        if (quoteData.data && quoteData.data.length > 0) {
          setQuotations(quoteData.data);
        } else {
          setQuotations([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createQuotationFromRequest = (request: QuotationRequest): Quotation => {
    const items = request.programs.map(programId => {
      const program = programDetails[programId] || { 
        name: programId, 
        price: 2500, 
        duration: '3 months', 
        sessions: 2,
        description: 'Program description'
      };
      return {
        programName: program.name,
        description: `${program.description} - ${program.duration} program`,
        duration: program.duration,
        sessionsPerWeek: program.sessions,
        pricePerMonth: program.price,
        quantity: 1,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.pricePerMonth, 0);
    const total = subtotal - discount;

    return {
      id: `Q-${Date.now()}`,
      requestId: request.id,
      quotationNumber: generateQuotationNumber(),
      parentName: request.parentName,
      parentEmail: request.parentEmail,
      parentPhone: request.parentPhone,
      childName: request.childName,
      childAge: request.childAge,
      items,
      subtotal,
      discount: discount || undefined,
      discountReason: discountReason || undefined,
      total,
      currency: 'ZMW',
      validUntil: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000),
      notes: notes || undefined,
      terms: `1. This quotation is valid for ${validDays} days from the date of issue.
2. Payment is due upon enrollment confirmation.
3. All fees are quoted in Zambian Kwacha (ZMW).
4. Materials and equipment are included in the program fees.
5. Classes are held at ROBOTIX Institute, Lusaka.
6. A minimum of 48 hours notice is required for class rescheduling.
7. Refunds are available within 7 days of enrollment if unsatisfied.`,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  const handlePreviewAndSend = () => {
    if (!selectedRequest) return;
    
    const quotation = createQuotationFromRequest(selectedRequest);
    setPreviewQuotation(quotation);
    setShowSendModal(false);
    setShowPDFPreview(true);
  };

  const handleSendFromPreview = async () => {
    if (!previewQuotation || !selectedRequest) return;

    setIsLoading(true);
    try {
      const finalQuotation: Quotation = {
        ...previewQuotation,
        status: 'sent',
        sentAt: new Date(),
      };

      // Send quotation via API — this emails the parent and updates DB
      const res = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalQuotation),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send quotation');
      }

      setQuotations(prev => [finalQuotation, ...prev]);
      setRequests(prev =>
        prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'sent' as const } : r)
      );

      alert('Quotation sent successfully! The parent will receive it via email.');
    } catch (error) {
      console.error('Error sending quotation:', error);
      alert('Failed to send quotation. Please try again.');
    } finally {
      setIsLoading(false);
      setShowPDFPreview(false);
      setPreviewQuotation(null);
      setSelectedRequest(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setDiscount(0);
    setDiscountReason('');
    setNotes('');
    setValidDays(14);
  };

  const openSendModal = (request: QuotationRequest) => {
    setSelectedRequest(request);
    setShowSendModal(true);
  };

  const openPDFPreviewForQuote = (quote: Quotation) => {
    setPreviewQuotation(quote);
    setShowPDFPreview(true);
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await fetch(`/api/quotations?id=${id}`, { method: 'DELETE' });
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const calculateSubtotal = (programIds: string[]) => {
    return programIds.reduce((sum, id) => {
      const program = programs.find(p => p.id === id);
      return sum + (program?.price || 0);
    }, 0);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const sentCount = quotations.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quotation Management</h1>
                <p className="text-sm text-gray-500">Create professional PDF quotations and send to parents</p>
              </div>
            </div>
            <Button onClick={fetchData} variant="outline" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{sentCount}</p>
                  <p className="text-sm text-gray-500">Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {quotations.filter(q => q.status === 'accepted').length}
                  </p>
                  <p className="text-sm text-gray-500">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{requests.length + quotations.length}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-brand-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Quote Requests ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'sent'
                ? 'bg-brand-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sent Quotations ({sentCount})
          </button>
        </div>

        {/* Requests List */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No quotation requests yet</p>
                </CardContent>
              </Card>
            ) : (
              requests.map(request => {
                const isExpanded = expandedRequest === request.id;
                
                return (
                  <Card key={request.id}>
                    <CardContent className="p-0">
                      {/* Header Row */}
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-brand-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{request.parentName}</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                                {request.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Child: {request.childName} ({request.childAge} years) • {request.programs.length} program(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-gray-900">
                              K{calculateSubtotal(request.programs).toLocaleString()}/month
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Contact Info */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <a href={`mailto:${request.parentEmail}`} className="text-brand-600 hover:underline">
                                    {request.parentEmail}
                                  </a>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <a href={`tel:${request.parentPhone}`} className="text-brand-600 hover:underline">
                                    {request.parentPhone}
                                  </a>
                                </div>
                                {request.preferredSchedule && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{request.preferredSchedule}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Selected Programs */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Selected Programs</h4>
                              <div className="space-y-2">
                                {request.programs.map(programId => {
                                  const program = programs.find(p => p.id === programId);
                                  return (
                                    <div key={programId} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                                      <span className="text-gray-900">{program?.name || programId}</span>
                                      <span className="text-gray-500">K{program?.price.toLocaleString()}/mo</span>
                                    </div>
                                  );
                                })}
                                <div className="flex items-center justify-between text-sm font-medium pt-2 border-t">
                                  <span>Total</span>
                                  <span>K{calculateSubtotal(request.programs).toLocaleString()}/month</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Message */}
                          {request.message && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                              <p className="text-sm text-gray-600 bg-white p-3 rounded">{request.message}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                            {request.status === 'pending' && (
                              <Button 
                                variant="primary" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openSendModal(request);
                                }}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Create Quotation
                              </Button>
                            )}
                            <Button 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${request.parentEmail}?subject=ROBOTIX Quote Request&body=Dear ${request.parentName},%0D%0A%0D%0AThank you for your interest in ROBOTIX Institute...`);
                              }}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Email
                            </Button>
                            <Button 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRequest(request.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Sent Quotations List */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {quotations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Send className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No quotations sent yet</p>
                </CardContent>
              </Card>
            ) : (
              quotations.map(quote => {
                return (
                  <Card key={quote.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-sm text-gray-900">{quote.quotationNumber}</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[quote.status]}`}>
                                {quote.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              To: {quote.parentName} ({quote.parentEmail})
                            </p>
                            <p className="text-sm text-gray-500">
                              Child: {quote.childName} • {quote.items.length} program(s)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            K{quote.total.toLocaleString()}
                          </p>
                          {quote.discount && quote.discount > 0 && (
                            <p className="text-xs text-green-600">-K{quote.discount} discount</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Valid until {new Date(quote.validUntil).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Quote Items */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid gap-2">
                          {quote.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.programName}</span>
                              <span className="text-gray-900">K{item.pricePerMonth.toLocaleString()}/mo</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => openPDFPreviewForQuote(quote)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-2" />
                          Resend
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Create Quote Modal */}
      {showSendModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Quotation</h2>
                <button 
                  onClick={() => { setShowSendModal(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Recipient Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Creating quotation for</h3>
                <p className="text-sm text-gray-600">{selectedRequest.parentName}</p>
                <p className="text-sm text-gray-500">{selectedRequest.parentEmail}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Child: {selectedRequest.childName} ({selectedRequest.childAge} years)
                </p>
              </div>

              {/* Quote Summary */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Programs to Quote</h3>
                <div className="space-y-2">
                  {selectedRequest.programs.map(programId => {
                    const program = programs.find(p => p.id === programId);
                    return (
                      <div key={programId} className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span>{program?.name || programId}</span>
                        <span className="font-medium">K{program?.price.toLocaleString()}/mo</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-sm py-2">
                    <span>Subtotal</span>
                    <span className="font-medium">K{calculateSubtotal(selectedRequest.programs).toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>

              {/* Discount */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Discount (Optional)</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => setDiscount(Math.max(0, discount - 100))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={discount}
                      onChange={e => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 text-center border-x border-gray-200 py-2 outline-none"
                      placeholder="0"
                    />
                    <button 
                      type="button"
                      onClick={() => setDiscount(discount + 100)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-gray-500">ZMW</span>
                </div>
                {discount > 0 && (
                  <input
                    type="text"
                    value={discountReason}
                    onChange={e => setDiscountReason(e.target.value)}
                    className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Reason for discount (e.g., Multi-program enrollment)"
                  />
                )}
              </div>

              {/* Validity */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Quote Valid For</h3>
                <select
                  value={validDays}
                  onChange={e => setValidDays(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Additional Notes (Optional)</h3>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  placeholder="Any special notes or offers for the parent..."
                />
              </div>

              {/* Total */}
              <div className="bg-brand-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Quote Amount</span>
                  <span className="text-2xl font-bold text-brand-600">
                    K{(calculateSubtotal(selectedRequest.programs) - discount).toLocaleString()}/month
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => { setShowSendModal(false); resetForm(); }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  onClick={handlePreviewAndSend}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview PDF & Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPDFPreview && previewQuotation && (
        <PDFPreviewModal
          quotation={previewQuotation}
          isOpen={showPDFPreview}
          onClose={() => {
            setShowPDFPreview(false);
            setPreviewQuotation(null);
          }}
          onSendEmail={handleSendFromPreview}
        />
      )}
    </div>
  );
}
