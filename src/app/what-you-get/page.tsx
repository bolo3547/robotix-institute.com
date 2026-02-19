'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle, Award } from 'lucide-react';

const offers = [
  {
    icon: '🎁',
    title: 'Free Trial Class',
    description: 'Attend any program for free before enrolling',
    features: ['No commitment', 'Meet instructors', 'See our methods'],
  },
  {
    icon: '💎',
    title: 'Founder\'s Discount',
    description: '30% off first month for new students',
    features: ['Limited time', 'All programs', 'Stackable deals'],
  },
  {
    icon: '👥',
    title: 'Referral Rewards',
    description: 'Earn credits by referring friends',
    features: ['500 ZMW per referral', 'Unlimited earnings', 'Instant credits'],
  },
  {
    icon: '📚',
    title: 'Learning Materials',
    description: 'All resources included in enrollment',
    features: ['Digital books', 'Video tutorials', 'Project files'],
  },
  {
    icon: '🏆',
    title: 'Certificate Program',
    description: 'Recognized industry certifications',
    features: ['Portfolio building', 'LinkedIn ready', 'Job ready'],
  },
  {
    icon: '🎯',
    title: 'Career Support',
    description: 'Job placement assistance & mentorship',
    features: ['Resume review', 'Interview prep', 'Job connections'],
  },
];

const inclusions = [
  { icon: '✓', text: 'Professional instruction from industry experts' },
  { icon: '✓', text: 'Small class sizes (max 15 students)' },
  { icon: '✓', text: 'Hands-on projects and real-world experience' },
  { icon: '✓', text: 'Take-home kits and resources' },
  { icon: '✓', text: 'Regular progress reports to parents' },
  { icon: '✓', text: 'Access to online learning portal' },
  { icon: '✓', text: 'Safe, supervised learning environment' },
  { icon: '✓', text: 'Flexible scheduling options' },
  { icon: '✓', text: 'Make-up classes for absences' },
  { icon: '✓', text: 'Community of 2,500+ alumni' },
];

const bonuses = [
  {
    title: 'Welcome Package',
    items: [
      'Program starter kit',
      'Digital course materials',
      'Community access',
      'Monthly newsletter',
    ],
  },
  {
    title: 'Exclusive Access',
    items: [
      'Weekly webinars',
      'Networking events',
      'Expert Q&A sessions',
      'Special workshops',
    ],
  },
  {
    title: 'Learning Tools',
    items: [
      'Online platform access',
      'Video recordings',
      'Assignment portal',
      'Resource library',
    ],
  },
  {
    title: 'Future Benefits',
    items: [
      'Alumni network',
      'Job board access',
      'Continuing education',
      'Lifetime support',
    ],
  },
];

export default function WhatYouGetTodayPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4">What You Get Today</h1>
            <p className="text-xl opacity-90 mb-6">
              Enroll today and unlock exclusive benefits, special offers, and lifetime support
            </p>
            <div className="inline-block bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold text-lg mb-8">
              🎁 Limited Time Offer: 30% Off First Month
            </div>
          </motion.div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Special Offers & Bonuses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="elevated">
                  <CardContent>
                    <div className="text-4xl mb-4">{offer.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    <div className="space-y-2">
                      {offer.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">What's Included in Every Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inclusions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
              >
                <span className="text-2xl text-green-600 font-bold flex-shrink-0">{item.icon}</span>
                <span className="text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Packages */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Bonus Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bonuses.map((bonus, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="kid">
                  <CardContent>
                    <h3 className="text-xl font-bold mb-4 text-emerald-700">{bonus.title}</h3>
                    <ul className="space-y-3">
                      {bonus.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-emerald-600 font-bold mt-1">•</span>
                          <span>{item}</span>
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

      {/* Pricing Comparison */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Enrollment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Single Class',
                price: '500 ZMW',
                desc: 'Try one class',
                items: ['1 class trial', 'Full program access', 'No commitment'],
              },
              {
                name: 'Monthly',
                price: '2-4.5K',
                desc: 'Most popular',
                items: ['4 sessions/month', 'Cancel anytime', 'Progress tracking', 'RECOMMENDED'],
                highlight: true,
              },
              {
                name: 'Quarterly',
                price: '6-12K',
                desc: 'Best value',
                items: ['3 months', '10% discount', 'Priority support'],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card variant={plan.highlight ? 'elevated' : 'outlined'}>
                  <CardContent>
                    {plan.highlight && (
                      <div className="bg-emerald-600 text-white px-3 py-1 rounded-full inline-block text-sm font-bold mb-4">
                        🌟 {plan.items[3]}
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-emerald-600 text-3xl font-bold mb-1">{plan.price}</p>
                    <p className="text-gray-600 text-sm mb-4">{plan.desc}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.items.slice(0, 3).map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.highlight ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-12 px-4 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <Award className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">100% Satisfaction Guarantee</h2>
            <p className="text-lg text-gray-700 mb-6">
              Not happy with your program? Get a full refund within 14 days. No questions asked.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-600">95%</p>
                <p className="text-sm text-gray-600">Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">2,500+</p>
                <p className="text-sm text-gray-600">Happy Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">0</p>
                <p className="text-sm text-gray-600">Complaints</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">8+</p>
                <p className="text-sm text-gray-600">Years Trust</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Time Offer */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 sm:p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">🎊 Limited Time Offer</h2>
            <p className="text-2xl mb-2">Get 30% OFF Your First Month!</p>
            <p className="text-lg opacity-90 mb-8">Plus a FREE consultation with our director</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button variant="kidPrimary" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Claim Offer Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 text-lg px-8 py-4">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-75 mt-6">Offer expires in 7 days. Limited spots available!</p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How do I use the free trial?',
                a: 'Simply sign up and choose any program. Attend one free class within 7 days. If you like it, enroll!',
              },
              {
                q: 'Can I pause my subscription?',
                a: 'Yes! You can pause up to 2 months per year without losing your spot or payment.',
              },
              {
                q: 'What if I need a refund?',
                a: 'We offer a 14-day money-back guarantee. If unsatisfied, just ask for a refund - no questions asked.',
              },
              {
                q: 'Are siblings discounts available?',
                a: 'Yes! Get 15% off when 2+ siblings enroll in the same program.',
              },
            ].map((item, i) => (
              <details key={i} className="border border-gray-300 rounded-lg overflow-hidden group">
                <summary className="flex items-center cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 font-semibold">
                  <span className="mr-3 text-emerald-600 group-open:rotate-90 transition">▶</span>
                  {item.q}
                </summary>
                <div className="p-4 border-t border-gray-300 bg-white text-gray-700">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-4 bg-gradient-to-br from-emerald-100 to-teal-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Child's Future?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Join 2,500+ families who have trusted ROBOTIX Institute. Start with a free trial today!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button variant="primary" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="text-lg px-8 py-4">
                Talk to Us First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
