'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, CreditCard, Building, CheckCircle, AlertCircle, Clock, Download, Receipt, ArrowRight, Shield, FileText } from 'lucide-react';

const mobileProviders = [
  { id: 'mtn', name: 'MTN Mobile Money', color: 'bg-yellow-500', textColor: 'text-yellow-900', logo: 'ðŸ“±', prefix: '096/076' },
  { id: 'airtel', name: 'Airtel Money', color: 'bg-red-500', textColor: 'text-gray-900', logo: 'ðŸ“²', prefix: '097/077' },
  { id: 'zamtel', name: 'Zamtel Kwacha', color: 'bg-green-500', textColor: 'text-gray-900', logo: 'ðŸ’³', prefix: '095/075' },
];

const paymentHistory = [
  { id: '1', date: '2026-02-01', program: 'Robotics Fundamentals', child: 'Mwamba', amount: 2500, method: 'MTN MoMo', status: 'completed', receipt: 'REC-2026-0012' },
  { id: '2', date: '2026-01-15', program: 'Python for Kids', child: 'Natasha', amount: 2000, method: 'Airtel Money', status: 'completed', receipt: 'REC-2026-0008' },
  { id: '3', date: '2026-02-05', program: 'Web Dev Junior', child: 'Chilufya', amount: 2500, method: 'Bank Transfer', status: 'pending', receipt: null },
  { id: '4', date: '2025-12-01', program: 'Robotics Fundamentals', child: 'Mwamba', amount: 2500, method: 'MTN MoMo', status: 'completed', receipt: 'REC-2025-0045' },
];

const installmentPlans = [
  {
    id: '1',
    program: 'Robotics Fundamentals',
    child: 'Mwamba',
    total: 7500,
    installments: [
      { amount: 2500, dueDate: '2026-01-01', status: 'paid' },
      { amount: 2500, dueDate: '2026-02-01', status: 'paid' },
      { amount: 2500, dueDate: '2026-03-01', status: 'upcoming' },
    ],
  },
];

function PaymentMethodCard({ method, selected, onSelect }: {
  method: typeof mobileProviders[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-accent-500 bg-accent-500/10'
          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center text-2xl`}>
          {method.logo}
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold">{method.name}</h3>
          <p className="text-gray-500 text-sm">{method.prefix}</p>
        </div>
        {selected && <CheckCircle className="w-5 h-5 text-accent-500 ml-auto" />}
      </div>
    </motion.button>
  );
}

const statusColors = {
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Completed' },
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Pending' },
  failed: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Failed' },
};

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'pay' | 'history' | 'installments'>('pay');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount] = useState(2500);
  const [paymentStep, setPaymentStep] = useState<'select' | 'confirm' | 'processing' | 'success'>('select');

  const handlePay = () => {
    setPaymentStep('processing');
    setTimeout(() => setPaymentStep('success'), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            <CreditCard className="w-4 h-4" /> Payments
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Payments &amp; Billing</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pay securely with Mobile Money, bank transfer, or card. View history and manage installment plans.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-fit mx-auto">
          {[
            { id: 'pay', label: 'Make Payment', icon: Smartphone },
            { id: 'history', label: 'History', icon: Receipt },
            { id: 'installments', label: 'Installments', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === id
                  ? 'bg-accent-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Make Payment Tab */}
          {activeTab === 'pay' && (
            <motion.div key="pay" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto">
              {paymentStep === 'select' && (
                <div className="space-y-6">
                  {/* Payment Summary */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-gray-900 font-semibold mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Program</span>
                        <span className="text-gray-900">Robotics Fundamentals</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Student</span>
                        <span className="text-gray-900">Mwamba Chisanga</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Period</span>
                        <span className="text-gray-900">March 2026</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <span className="text-gray-600 font-semibold">Total Amount</span>
                        <span className="text-accent-400 font-bold text-xl">ZMW {amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Money Options */}
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-accent-400" /> Mobile Money
                    </h3>
                    <div className="grid gap-3">
                      {mobileProviders.map((p) => (
                        <PaymentMethodCard
                          key={p.id}
                          method={p}
                          selected={selectedProvider === p.id}
                          onSelect={() => { setSelectedProvider(p.id); }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Other Methods */}
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                      <Building className="w-5 h-5 text-accent-400" /> Other Methods
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedProvider('bank')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedProvider === 'bank'
                            ? 'border-accent-500 bg-accent-500/10'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Building className="w-6 h-6 text-gray-900" />
                          </div>
                          <div>
                            <h3 className="text-gray-900 font-semibold">Bank Transfer</h3>
                            <p className="text-gray-500 text-sm">Zanaco, FNB, Stanbic</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => setSelectedProvider('card')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedProvider === 'card'
                            ? 'border-accent-500 bg-accent-500/10'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-gray-900" />
                          </div>
                          <div>
                            <h3 className="text-gray-900 font-semibold">Visa / Mastercard</h3>
                            <p className="text-gray-500 text-sm">Debit or Credit Card</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Phone Number Input (for Mobile Money) */}
                  {selectedProvider && ['mtn', 'airtel', 'zamtel'].includes(selectedProvider) && (
                    <div>
                      <label className="text-gray-900 font-semibold mb-2 block">Mobile Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g., 0961234567"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                      />
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-semibold text-sm">Secure Payment</p>
                      <p className="text-green-300/80 text-xs">All payments are encrypted and processed securely. You&apos;ll receive an SMS confirmation.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => selectedProvider && setPaymentStep('confirm')}
                    disabled={!selectedProvider}
                    className="w-full py-4 bg-accent-500 text-white rounded-xl font-bold text-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {paymentStep === 'confirm' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Payment</h2>
                  <div className="bg-gray-100 rounded-xl p-6 mb-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount</span>
                      <span className="text-accent-400 font-bold text-lg">ZMW {amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Method</span>
                      <span className="text-gray-900">{mobileProviders.find(p => p.id === selectedProvider)?.name || 'Bank Transfer'}</span>
                    </div>
                    {phoneNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phone</span>
                        <span className="text-gray-900">{phoneNumber}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPaymentStep('select')}
                      className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePay}
                      className="flex-1 py-3 bg-accent-500 text-white rounded-xl font-bold hover:bg-accent-600 transition-colors"
                    >
                      Pay ZMW {amount.toLocaleString()}
                    </button>
                  </div>
                </motion.div>
              )}

              {paymentStep === 'processing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
                  <p className="text-gray-600">Please approve the payment on your phone...</p>
                </motion.div>
              )}

              {paymentStep === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                  <p className="text-gray-600 mb-8">ZMW {amount.toLocaleString()} has been received. A receipt has been sent to your phone and email.</p>
                  <div className="flex gap-3 justify-center">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                      <Download className="w-4 h-4" /> Download Receipt
                    </button>
                    <button
                      onClick={() => { setPaymentStep('select'); setSelectedProvider(null); setPhoneNumber(''); }}
                      className="px-6 py-3 bg-accent-500 text-white rounded-xl font-bold hover:bg-accent-600 transition-colors"
                    >
                      Make Another Payment
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Payment History Tab */}
          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-3">Program</div>
                  <div className="col-span-2">Student</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2 text-right">Receipt</div>
                </div>
                {paymentHistory.map((p, idx) => {
                  const status = statusColors[p.status as keyof typeof statusColors];
                  const StatusIcon = status.icon;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center border-t border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="md:col-span-2 text-gray-600 text-sm">
                        {new Date(p.date).toLocaleDateString('en-ZM', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="md:col-span-3 text-gray-900 font-medium text-sm">{p.program}</div>
                      <div className="md:col-span-2 text-gray-600 text-sm">{p.child}</div>
                      <div className="md:col-span-2 text-accent-400 font-bold text-sm">ZMW {p.amount.toLocaleString()}</div>
                      <div className="md:col-span-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" /> {status.label}
                        </span>
                      </div>
                      <div className="md:col-span-2 text-right">
                        {p.receipt ? (
                          <button className="text-accent-400 hover:text-accent-300 text-sm flex items-center gap-1 ml-auto">
                            <Download className="w-3.5 h-3.5" /> {p.receipt}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">â€”</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Installments Tab */}
          {activeTab === 'installments' && (
            <motion.div key="installments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {installmentPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-gray-900 font-bold text-lg">{plan.program}</h3>
                      <p className="text-gray-600 text-sm">Student: {plan.child}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-accent-400 font-bold text-xl">ZMW {plan.total.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm">{plan.installments.length} installments</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {plan.installments.map((inst, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          inst.status === 'paid' ? 'bg-green-500/20' : 'bg-gray-100'
                        }`}>
                          {inst.status === 'paid' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">Installment {idx + 1}</p>
                          <p className="text-gray-500 text-sm">
                            Due: {new Date(inst.dueDate).toLocaleDateString('en-ZM', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-accent-400 font-bold">ZMW {inst.amount.toLocaleString()}</p>
                          <span className={`text-xs font-medium ${
                            inst.status === 'paid' ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {inst.status === 'paid' ? 'Paid' : 'Upcoming'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Payment Progress</span>
                      <span className="text-gray-900 font-medium">
                        {plan.installments.filter(i => i.status === 'paid').length}/{plan.installments.length} paid
                      </span>
                    </div>
                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                        style={{ width: `${(plan.installments.filter(i => i.status === 'paid').length / plan.installments.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
