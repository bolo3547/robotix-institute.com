'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const faqCategories = [
  {
    name: 'Getting Started',
    icon: '🚀',
    questions: [
      { q: 'What age groups do you serve?', a: 'We serve children and teens aged 6-18. Ages 6-12 start with visual programming and intro to robotics, while ages 13-18 progress to Python, C++, and advanced engineering projects.' },
      { q: 'Does my child need prior experience?', a: 'Not at all! Our beginner programs are designed for complete newcomers. We start with visual, drag-and-drop coding tools and build up to text-based programming progressively.' },
      { q: 'Is there a free trial class?', a: 'Yes! We offer a free trial class for new students. This gives your child a chance to experience our hands-on teaching style and meet the instructors before joining a cohort.' },
      { q: 'How do I register my child?', a: 'You can register online through our website, call us at +260 956 355 117, or visit us at Hive Coworking / BongoHive on Great East Road, Lusaka.' },
      { q: 'What makes Robotix Institute different?', a: 'We\'re Zambia\'s pioneer in coding and robotics education for young people. In partnership with BongoHive Technology and Innovation Hub, we provide cohort-based, hands-on learning with real projects — not just screen time.' },
    ],
  },
  {
    name: 'Programs & Curriculum',
    icon: '📚',
    questions: [
      { q: 'What programs do you offer?', a: 'We offer Visual Programming & Intro to Robotics (6-9), Coding & Robotics Foundations (10-12), Python & Advanced Projects (13-15), Advanced Coding & C++ (16-18), Weekend Cohort Program, and After-School Programs at select Lusaka schools.' },
      { q: 'How are programs structured?', a: 'We run cohort-based programs — currently on Cohort 3. Weekend sessions are held at BongoHive / Hive Coworking, and after-school programs run weekdays at partner schools like Northmead Primary.' },
      { q: 'What equipment and tools do you use?', a: 'We use robotics kits, Arduino, sensors, and professional software tools. For coding, younger students use visual block-based tools while teens work with Python, C++, and real development environments. All equipment is provided.' },
      { q: 'Do students get certificates?', a: 'Yes! Students receive a certificate of completion for every cohort they finish. Advanced programs include portfolio-ready project documentation.' },
      { q: 'What programming languages do you teach?', a: 'Younger students (6-12) use visual block-based programming. Teens (13-18) learn Python and C++ along with sensors, IoT, and AI concepts. The language progresses with the student\'s age and skill level.' },
    ],
  },
  {
    name: 'Pricing & Partnerships',
    icon: '💰',
    questions: [
      { q: 'How much do programs cost?', a: 'Please contact us for current pricing. We run cohort-based programs with flexible options. Call +260 956 355 117 or email info@robotixinstitute.io for details.' },
      { q: 'Do you offer scholarships?', a: 'Yes, we have supported students through partnerships. For example, 40 Northmead Primary students excelled in our program with support from Stanbic Bank Zambia.' },
      { q: 'Who are your partners?', a: 'We partner with BongoHive Technology and Innovation Hub, Stanbic Bank Zambia, Northmead Primary School, and other organisations committed to STEM education in Zambia.' },
      { q: 'Do you bring programs to schools?', a: 'Yes! We run after-school coding and robotics programs at select schools across Lusaka. Contact us if you\'d like your school to participate.' },
      { q: 'Do you offer sibling discounts?', a: 'We offer flexible enrolment options for families. Contact us to discuss the best arrangement for your children.' },
    ],
  },
  {
    name: 'Location & Logistics',
    icon: '🛡️',
    questions: [
      { q: 'Where are you located?', a: 'Our main programs run at Hive Coworking / BongoHive on Great East Road, Lusaka, Zambia. We also deliver after-school programs at partner schools across Lusaka.' },
      { q: 'What are your operating hours?', a: 'After-school programs: Monday-Friday 3:00-6:00 PM. Weekend cohort sessions: Saturday mornings. Holiday programs run during school breaks.' },
      { q: 'What happens if my child misses a class?', a: 'We provide catch-up support and materials. Our cohort-based structure ensures students stay on track with their group.' },
      { q: 'How do you ensure child safety?', a: 'We maintain small class sizes, experienced instructors, and a safe learning environment at BongoHive\'s professional facility. Parent communication is ongoing throughout each cohort.' },
      { q: 'How long has Robotix Institute been operating?', a: 'Founded in 2016, we have 9+ years of experience empowering over 2,500 students across Zambia with coding and robotics education.' },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = faqCategories.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <p className="text-xl text-gray-600 mb-8">
            Everything you need to know about Robotix Institute
          </p>

          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-10">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                {category.name}
              </h2>
              <div className="space-y-3">
                {category.questions.map((item, i) => {
                  const key = `${category.name}-${i}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={key}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-4 text-left text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                      >
                        <span>{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-accent-400 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="px-4 pb-4 text-gray-600 text-sm border-t border-gray-200 pt-3"
                        >
                          {item.a}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No questions found matching &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">Our team is happy to help. Reach out anytime!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/260956355117"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
