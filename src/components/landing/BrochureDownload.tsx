'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, ChevronDown, CheckCircle, BookOpen, Cpu, Code2, Globe2 } from 'lucide-react';

const brochures = [
  {
    id: 'general',
    title: 'ROBOTIX General Brochure',
    description: 'Full overview of our programs, pricing, and what makes us different.',
    icon: BookOpen,
    pages: 8,
    fileSize: '2.4 MB',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'robotics',
    title: 'Robotics Curriculum Guide',
    description: 'Detailed breakdown of our robotics program — topics, projects, and learning outcomes.',
    icon: Cpu,
    pages: 6,
    fileSize: '1.8 MB',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'coding',
    title: 'Coding Program Outline',
    description: 'Python, web development, and AI program details for all age groups.',
    icon: Code2,
    pages: 5,
    fileSize: '1.5 MB',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'digital',
    title: 'Digital Skills Overview',
    description: 'Essential digital skills curriculum and Microsoft Office training details.',
    icon: Globe2,
    pages: 4,
    fileSize: '1.2 MB',
    color: 'from-amber-500 to-orange-500',
  },
];

export default function BrochureDownload() {
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBrochure, setSelectedBrochure] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleDownload = (id: string) => {
    setSelectedBrochure(id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloaded((prev) => [...prev, selectedBrochure]);
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '' });
    }, 3000);
  };

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 bg-accent-50 text-accent-600 rounded-full text-sm font-semibold mb-4"
          >
            📄 Free Downloads
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Download Our Brochures & Curriculum Guides
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Get detailed information about our programs to share with family and friends. Available in PDF format.
          </motion.p>
        </div>

        {/* Brochure Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {brochures.map((brochure, i) => (
            <motion.div
              key={brochure.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${brochure.color} flex items-center justify-center flex-shrink-0`}>
                  <brochure.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{brochure.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{brochure.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {brochure.pages} pages
                    </span>
                    <span>{brochure.fileSize}</span>
                    <span>PDF</span>
                  </div>
                  {downloaded.includes(brochure.id) ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Requested — Check your email!
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDownload(brochure.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download Free
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Download Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Request Received!</h3>
                  <p className="text-gray-500 text-sm">
                    We&apos;ll email the brochure to you shortly. Thank you for your interest!
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Almost there!</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Enter your details to download the brochure. We&apos;ll also email you a copy.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="e.g. John Mwale"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+260 9XX XXX XXX"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-accent-500 text-white font-bold rounded-lg hover:bg-accent-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Now
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      We respect your privacy. No spam, ever.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
