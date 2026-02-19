'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  const lastUpdated = 'February 8, 2026';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
      {/* Hero */}
      <section className="pt-32 pb-12 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Privacy Policy
          </motion.h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg prose-blue">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>1. Introduction</h2>
            <p>
              ROBOTIX INSTITUTE ("we," "our," or "us") is committed to protecting the privacy of children and their families. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
              website or use our services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us, including:</p>
            <ul>
              <li>Parent/Guardian name, email address, and phone number</li>
              <li>Child's name, age, and educational information</li>
              <li>Billing and payment information</li>
              <li>Emergency contact information</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage statistics and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>Providing and managing educational services</li>
              <li>Communicating with parents about their child's progress</li>
              <li>Processing payments and billing</li>
              <li>Improving our services and website</li>
              <li>Ensuring the safety of our students</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2>4. Children's Privacy (COPPA Compliance)</h2>
            <p>
              We are committed to complying with the Children's Online Privacy Protection Act (COPPA) and similar 
              regulations. We do not knowingly collect personal information from children under 13 without verifiable 
              parental consent.
            </p>
            <ul>
              <li>Parents can review their child's information upon request</li>
              <li>Parents can request deletion of their child's data</li>
              <li>We use collected data only for educational purposes</li>
            </ul>

            <h2>5. Data Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information. We may share information with:</p>
            <ul>
              <li>Instructors and staff (limited to educational purposes)</li>
              <li>Payment processors (for billing only)</li>
              <li>Legal authorities (when required by law)</li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul>
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Staff training on data protection</li>
            </ul>

            <h2>7. Cookies Policy</h2>
            <p>Our website uses cookies to enhance your experience. Types of cookies we use:</p>
            <ul>
              <li><strong>Essential cookies:</strong> Required for basic functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand website usage</li>
              <li><strong>Marketing cookies:</strong> Used for relevant advertising (with consent)</li>
            </ul>
            <p>You can manage cookie preferences through our cookie consent banner or your browser settings.</p>

            <h2>8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2>9. Data Retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfill the purposes outlined in this policy, 
              typically for the duration of enrollment plus 3 years, unless a longer retention period is required by law.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>Email: info@robotixinstitute.io</li>
              <li>Phone: +260 956 355 117</li>
              <li>Address: No. 7 Mistry Court, Great East Road, Lusaka, Zambia</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-4">Have questions about your data?</p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Our Privacy Team
          </Link>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
