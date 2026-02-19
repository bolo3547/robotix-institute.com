'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Check, Star, ArrowRight } from 'lucide-react';

const programs = [
  {
    id: 'robotics-foundations',
    name: 'Robotics Foundations',
    ageGroup: '6-8 years',
    level: 'Beginner',
    price: 2500,
    duration: '3 months',
    popular: false,
    features: [
      'Build simple robots',
      'Learn logic basics',
      'Team collaboration',
      'Weekly 2-hour sessions',
      'All materials provided',
      'Certificate of completion',
    ],
  },
  {
    id: 'advanced-robotics',
    name: 'Advanced Robotics',
    ageGroup: '9-12 years',
    level: 'Intermediate',
    price: 3500,
    duration: '6 months',
    popular: true,
    features: [
      'Complex robot builds',
      'Advanced programming',
      'Competition preparation',
      'Weekly 2.5-hour sessions',
      'Personal robot kit',
      'Competition entry fees included',
      'Parent progress reports',
    ],
  },
  {
    id: 'python',
    name: 'Python Programming',
    ageGroup: '10-14 years',
    level: 'Intermediate',
    price: 3000,
    duration: '4 months',
    popular: false,
    features: [
      'Python fundamentals',
      'Game development',
      'Data structures',
      'Real project portfolio',
      'Online resources access',
      'Industry mentorship',
    ],
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    ageGroup: '13-18 years',
    level: 'Advanced',
    price: 4500,
    duration: '8 months',
    popular: false,
    features: [
      'AI fundamentals',
      'Neural networks',
      'Data science projects',
      'Cloud computing credits',
      'University prep guidance',
      'Internship opportunities',
      'Capstone project',
    ],
  },
];

const addOns = [
  { name: 'Private Tutoring (per hour)', price: 300 },
  { name: 'Summer Camp (2 weeks)', price: 5000 },
  { name: 'Competition Coaching', price: 2000 },
  { name: 'Robot Kit (take home)', price: 1500 },
];

const faqs = [
  {
    q: 'Are there any discounts available?',
    a: 'Yes! We offer 10% sibling discount, 15% for annual payment, and merit-based scholarships.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept MTN Mobile Money, Airtel Money, bank transfers, and cash payments.',
  },
  {
    q: 'Can I switch programs mid-course?',
    a: 'Yes, you can upgrade or switch programs. We\'ll pro-rate your remaining balance.',
  },
  {
    q: 'Is there a trial period?',
    a: 'Yes! We offer a free trial class for all programs. No obligation to continue.',
  },
  {
    q: 'What if my child misses a class?',
    a: 'We offer makeup classes and recorded sessions for any missed content.',
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getPrice = (basePrice: number) => {
    if (billingCycle === 'quarterly') {
      return Math.round(basePrice * 2.7); // 10% discount for quarterly
    }
    return basePrice;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Transparent Pricing
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Invest in Your Child&apos;s Future
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Quality STEM education at affordable prices. No hidden fees, flexible payment options, and a money-back guarantee.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center bg-gray-200 rounded-full p-1"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'quarterly'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Quarterly <span className="text-green-600 font-bold">Save 10%</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${program.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              >
                {program.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> MOST POPULAR
                    </span>
                  </div>
                )}
                <Card
                  className={`h-full ${
                    program.popular
                      ? 'border-2 border-brand-500 shadow-xl ring-1 ring-brand-100'
                      : 'border border-gray-200'
                  }`}
                >
                  <CardContent className="p-6">
                    {/* Level Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        program.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        program.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {program.level}
                      </span>
                      <span className="text-xs text-gray-500">{program.ageGroup}</span>
                    </div>

                    {/* Program Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{program.duration} program</p>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        ZMW {getPrice(program.price).toLocaleString()}
                      </span>
                      <span className="text-gray-500">
                        /{billingCycle === 'monthly' ? 'mo' : 'qtr'}
                      </span>
                    </div>

                    {/* CTA */}
                    <Link href="/auth/signup" className="block mb-6">
                      <Button
                        variant={program.popular ? 'primary' : 'outline'}
                        fullWidth
                      >
                        Start Free Trial
                      </Button>
                    </Link>

                    {/* Features */}
                    <ul className="space-y-3">
                      {program.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Optional Add-ons</h2>
            <p className="text-gray-600">Enhance your child's learning experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <span className="font-medium text-gray-900">{addon.name}</span>
                <span className="text-brand-600 font-bold">ZMW {addon.price.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white"
          >
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-3xl font-bold mb-4">30-Day Money-Back Guarantee</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
              Not satisfied after the first month? Get a full refund, no questions asked. 
              We're confident your child will love learning with us.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Start Risk-Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing FAQs</h2>
            <p className="text-gray-600">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ArrowRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-gray-600">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Book a free consultation or get a personalized quotation for your child&apos;s programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="primary">
                Book Free Trial Class
              </Button>
            </Link>
            <Link href="/request-quote">
              <Button size="lg" variant="outline">
                Get Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
