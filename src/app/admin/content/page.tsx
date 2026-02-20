'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ChevronLeft, FileText, Edit } from 'lucide-react';

const pages: { id: number; name: string; route: string; sections: string[]; lastEdited: string }[] = [];

export default function AdminContentPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 hover:opacity-70 transition">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold">Manage Pages & Content</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {pages.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
            <FileText className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No content pages configured</h3>
            <p className="text-gray-500 mb-6">Content management will appear here once pages are set up.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-gray-800 border border-gray-700 hover:border-blue-500 transition p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-bold">{page.name}</h3>
                      <p className="text-gray-400 text-sm">{page.route}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Sections:</p>
                  <div className="flex flex-wrap gap-2">
                    {page.sections.map((section, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-700 px-2 py-1 rounded"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Last edited: {page.lastEdited}
                </div>

                <Link href={`/admin/content/${page.id}`}>
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Page
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
        )}

        {/* Content Tips */}
        <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700 p-6 mt-12">
          <h3 className="text-xl font-bold mb-4">📝 Content Management Tips</h3>
          <ul className="space-y-2 text-gray-200">
            <li>• Click "Edit Page" to modify content for any page</li>
            <li>• Changes are saved automatically</li>
            <li>• Use markdown formatting for rich text</li>
            <li>• Images should be uploaded to public folder</li>
            <li>• Keep content updated for better SEO</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
