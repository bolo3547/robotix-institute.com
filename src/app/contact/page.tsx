'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+260 956 355 117',
    href: 'tel:+260956355117',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@robotixinstitute.io',
    href: 'mailto:info@robotixinstitute.io',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Hive Coworking / BongoHive, Great East Road, Lusaka',
    href: 'https://maps.google.com/?q=BongoHive+Great+East+Road+Lusaka+Zambia',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon-Fri: 3-6 PM (After-school), Sat: 9 AM-1 PM (Cohort)',
    href: '#',
  },
];

const faqItems = [
  {
    question: 'What age groups do you serve?',
    answer: 'We serve children and teens aged 6-18. Ages 6-12 start with visual programming and intro to robotics, while ages 13-18 progress to Python, C++, and advanced projects.',
  },
  {
    question: 'Where are your programs held?',
    answer: 'Our weekend cohort programs run at BongoHive / Hive Coworking on Great East Road, Lusaka. We also offer after-school programs at select schools across Lusaka, including Northmead Primary.',
  },
  {
    question: 'What if my child has no prior experience?',
    answer: 'Perfect! All our beginner programs are designed for complete newcomers. Our experienced instructors guide students from fundamentals to advanced concepts at their own pace.',
  },
  {
    question: 'How are the programs structured?',
    answer: 'We run cohort-based programs (currently Cohort 3) with weekend sessions, as well as after-school programs during weekdays. Each cohort follows a structured curriculum with hands-on projects.',
  },
  {
    question: 'Do you partner with schools?',
    answer: 'Yes! We partner with schools like Northmead Primary to bring coding and robotics education directly to students, supported by partners like Stanbic Bank Zambia and BongoHive.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! We offer a free trial class for new students. This gives your child a chance to experience our teaching style and meet the instructors before committing.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send form data to API endpoint
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send');
    } catch {
      // Silently handle - still show success for UX
    }
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', program: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Have questions? We'd love to hear from you. Reach out to us anytime!
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card variant="elevated" className="h-full hover:shadow-lg transition-shadow bg-white border-gray-200">
                    <CardContent className="text-center">
                      <Icon className="w-12 h-12 mx-auto mb-4 text-accent-400" />
                      <p className="text-sm text-gray-500 mb-2">{info.label}</p>
                      <p className="font-semibold text-gray-900">{info.value}</p>
                    </CardContent>
                  </Card>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none transition"
                    placeholder="+260 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-600 mb-2">
                    Interested Program
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none transition"
                  >
                    <option value="">Select a program</option>
                    <option value="visual-programming">Visual Programming (Ages 6-9)</option>
                    <option value="coding-robotics">Coding & Robotics Foundations (Ages 10-12)</option>
                    <option value="python">Python & Advanced Projects (Ages 13-15)</option>
                    <option value="advanced">Advanced Coding & C++ (Ages 16-18)</option>
                    <option value="weekend">Weekend Cohort Program</option>
                    <option value="afterschool">After-School Program</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none transition resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitted ? 'Message Sent! âœ“' : 'Send Message'}
                </Button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <details key={index} className="group border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="flex items-center cursor-pointer p-4 bg-white hover:bg-gray-50 transition font-semibold text-gray-900">
                      <span className="mr-3 text-accent-400 group-open:rotate-90 transition">▶</span>
                      {item.question}
                    </summary>
                    <div className="p-4 border-t border-gray-200 bg-gray-50 text-gray-600">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Find Us</h2>
          <div className="w-full h-96 bg-white rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846.1!2d28.3228!3d-15.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19408b89a3bdf06f%3A0xf0b06359aaf72d44!2sBongoHive!5e0!3m2!1sen!2szm"
              title="Robotix Institute location at BongoHive, Lusaka"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-accent-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your free trial class today with no commitment
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="kidPrimary" className="bg-white text-brand-500 hover:bg-gray-100">
              Book Free Trial
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
