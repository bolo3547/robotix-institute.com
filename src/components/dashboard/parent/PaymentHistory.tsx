'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, FileText, X } from 'lucide-react';

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  receiptNumber?: string | null;
  method?: string | null;
  currency?: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

interface ReceiptData {
  receiptNumber: string;
  date: string;
  payer: { name: string; email: string };
  description: string;
  amount: number;
  currency: string;
  method: string | null;
  reference: string | null;
  notes: string | null;
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState<string | null>(null);

  const statusConfig = {
    paid: { icon: CheckCircle, color: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    pending: { icon: Clock, color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
    overdue: { icon: AlertCircle, color: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  const viewReceipt = async (paymentId: string) => {
    setLoadingReceipt(paymentId);
    try {
      const res = await fetch(`/api/payments/receipt?id=${paymentId}`);
      if (res.ok) {
        const data = await res.json();
        setReceiptData(data);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to load receipt');
      }
    } catch {
      alert('Failed to load receipt');
    } finally {
      setLoadingReceipt(null);
    }
  };

  const downloadReceipt = () => {
    if (!receiptData) return;

    const receiptHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt ${receiptData.receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 40px; }
    .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; }
    .header h1 { font-size: 24px; margin-bottom: 4px; }
    .header p { opacity: 0.9; font-size: 13px; }
    .receipt-label { text-align: center; padding: 15px; background: #fef3c7; border-bottom: 1px solid #e0e0e0; }
    .receipt-label h2 { color: #92400e; font-size: 18px; letter-spacing: 2px; }
    .body { padding: 30px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #6b7280; font-size: 13px; font-weight: 500; }
    .value { color: #1a1a2e; font-size: 14px; font-weight: 600; text-align: right; }
    .total { background: #f8fafc; padding: 20px 30px; border-top: 2px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
    .total .label { font-size: 16px; font-weight: 700; color: #1a1a2e; }
    .total .value { font-size: 24px; font-weight: 800; color:  #f97316; }
    .status { display: inline-block; background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; background: #f8fafc; border-top: 1px solid #e0e0e0; }
    .footer p { color: #9ca3af; font-size: 11px; line-height: 1.6; }
    @media print { body { padding: 0; } .receipt { border: none; } }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>${receiptData.organization.name}</h1>
      <p>${receiptData.organization.address}</p>
      <p>${receiptData.organization.phone} | ${receiptData.organization.email}</p>
    </div>
    <div class="receipt-label">
      <h2>PAYMENT RECEIPT</h2>
    </div>
    <div class="body">
      <div class="info-row">
        <span class="label">Receipt Number</span>
        <span class="value">${receiptData.receiptNumber}</span>
      </div>
      <div class="info-row">
        <span class="label">Date</span>
        <span class="value">${new Date(receiptData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
      <div class="info-row">
        <span class="label">Paid By</span>
        <span class="value">${receiptData.payer.name}</span>
      </div>
      <div class="info-row">
        <span class="label">Email</span>
        <span class="value">${receiptData.payer.email}</span>
      </div>
      <div class="info-row">
        <span class="label">Description</span>
        <span class="value">${receiptData.description}</span>
      </div>
      ${receiptData.method ? `<div class="info-row"><span class="label">Payment Method</span><span class="value">${receiptData.method.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</span></div>` : ''}
      ${receiptData.reference ? `<div class="info-row"><span class="label">Reference</span><span class="value">${receiptData.reference}</span></div>` : ''}
      <div class="info-row">
        <span class="label">Status</span>
        <span class="value"><span class="status">PAID</span></span>
      </div>
    </div>
    <div class="total">
      <span class="label">Total Amount</span>
      <span class="value">${receiptData.currency} ${receiptData.amount.toLocaleString()}</span>
    </div>
    <div class="footer">
      <p>Thank you for your payment!</p>
      <p>This is a computer-generated receipt. No signature required.</p>
      <p>&copy; ${new Date().getFullYear()} ${receiptData.organization.name}</p>
    </div>
  </div>
</body>
</html>`;

    // Create blob and download
    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${receiptData.receiptNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReceipt = () => {
    if (!receiptData) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt ${receiptData.receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 40px; }
    .receipt { max-width: 600px; margin: 0 auto; }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 3px solid #f97316; margin-bottom: 20px; }
    .header h1 { font-size: 24px; color: #f97316; }
    .header p { color: #666; font-size: 12px; margin-top: 4px; }
    h2 { text-align: center; color: #333; font-size: 18px; margin-bottom: 20px; letter-spacing: 2px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .label { color: #888; font-size: 13px; }
    .value { font-weight: 600; font-size: 14px; }
    .total { margin-top: 20px; padding-top: 15px; border-top: 3px solid #333; display: flex; justify-content: space-between; }
    .total .label { font-size: 16px; font-weight: 700; }
    .total .value { font-size: 22px; font-weight: 800; color: #f97316; }
    .footer { text-align: center; margin-top: 40px; color: #999; font-size: 11px; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>${receiptData.organization.name}</h1>
      <p>${receiptData.organization.address}</p>
      <p>${receiptData.organization.phone} | ${receiptData.organization.email}</p>
    </div>
    <h2>PAYMENT RECEIPT</h2>
    <div class="info-row"><span class="label">Receipt No.</span><span class="value">${receiptData.receiptNumber}</span></div>
    <div class="info-row"><span class="label">Date</span><span class="value">${new Date(receiptData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
    <div class="info-row"><span class="label">Paid By</span><span class="value">${receiptData.payer.name} (${receiptData.payer.email})</span></div>
    <div class="info-row"><span class="label">Description</span><span class="value">${receiptData.description}</span></div>
    ${receiptData.method ? `<div class="info-row"><span class="label">Method</span><span class="value">${receiptData.method.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</span></div>` : ''}
    ${receiptData.reference ? `<div class="info-row"><span class="label">Reference</span><span class="value">${receiptData.reference}</span></div>` : ''}
    <div class="total"><span class="label">Total Paid</span><span class="value">${receiptData.currency} ${receiptData.amount.toLocaleString()}</span></div>
    <div class="footer">
      <p>Thank you for your payment!</p>
      <p>This is a computer-generated receipt.</p>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-8 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">ZMW {totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-1">ZMW {paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-gray-600">Outstanding</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">ZMW {(totalAmount - paidAmount).toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => {
              const config = statusConfig[payment.status];
              const Icon = config.icon;
              return (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`border-b border-gray-100 ${config.bg} hover:opacity-75`}
                >
                  <td className="py-3 px-4 text-gray-900 font-medium">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-700">{payment.description}</td>
                  <td className="py-3 px-4 font-semibold">{payment.currency || 'ZMW'} {payment.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className={`flex items-center gap-2 font-semibold ${config.text}`}>
                      <Icon className="w-4 h-4" />
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {payment.status === 'paid' && !payment.id.startsWith('demo-') ? (
                      <button
                        onClick={() => viewReceipt(payment.id)}
                        disabled={loadingReceipt === payment.id}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {loadingReceipt === payment.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            View
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Receipt Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{receiptData.organization.name}</h3>
                  <p className="text-white/80 text-xs mt-1">{receiptData.organization.address}</p>
                  <p className="text-white/80 text-xs">{receiptData.organization.phone}</p>
                </div>
                <button
                  onClick={() => setReceiptData(null)}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-amber-50 py-3 text-center border-b border-amber-200">
              <h4 className="text-amber-800 font-bold tracking-wider text-sm">PAYMENT RECEIPT</h4>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-3">
              {[
                { label: 'Receipt Number', value: receiptData.receiptNumber },
                { label: 'Date', value: new Date(receiptData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Paid By', value: receiptData.payer.name },
                { label: 'Email', value: receiptData.payer.email },
                { label: 'Description', value: receiptData.description },
                ...(receiptData.method ? [{ label: 'Payment Method', value: receiptData.method.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) }] : []),
                ...(receiptData.reference ? [{ label: 'Reference', value: receiptData.reference }] : []),
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">{row.label}</span>
                  <span className="text-gray-900 font-medium text-sm text-right">{row.value}</span>
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total Paid</span>
                <span className="text-2xl font-extrabold text-orange-600">
                  {receiptData.currency} {receiptData.amount.toLocaleString()}
                </span>
              </div>

              {receiptData.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Notes: {receiptData.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={downloadReceipt}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={printReceipt}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                Print
              </button>
            </div>

            <div className="text-center pb-4">
              <p className="text-xs text-gray-400">Computer-generated receipt. No signature required.</p>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
