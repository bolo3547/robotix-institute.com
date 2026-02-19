'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Mukamba Chanda',
    role: 'Parent',
    image: '👩',
    text: 'My daughter went from being shy to presenting her robotics project confidently. ROBOTIX transformed her completely!',
    rating: 5,
    childName: 'Zainab',
    program: 'Robotics Basics',
    location: 'Lusaka',
  },
  {
    name: 'David Mwale',
    role: 'Parent',
    image: '👨',
    text: 'The instructors are exceptionally qualified and genuinely care about each child\'s progress. Worth every kwacha!',
    rating: 5,
    childName: 'Chanda',
    program: 'Advanced Coding',
    location: 'Livingstone',
  },
  {
    name: 'Grace Banda',
    role: 'Parent',
    image: '👩',
    text: 'Outstanding safety protocols and transparent communication. I always know what my son is learning and how he\'s progressing.',
    rating: 5,
    childName: 'Lwamba',
    program: 'Python Programming',
    location: 'Kitwe',
  },
  {
    name: 'Joshua Simfukwe',
    role: 'Parent',
    image: '👨',
    text: 'My son started as a novice and now he\'s building drones! The instructors make learning fun while teaching real skills.',
    rating: 5,
    childName: 'Michael',
    program: 'Drone Technology',
    location: 'Ndola',
  },
  {
    name: 'Amelia Zulu',
    role: 'Parent',
    image: '👩',
    text: 'The flexibility in scheduling and personalized attention each child receives sets ROBOTIX apart from other programs.',
    rating: 5,
    childName: 'Nomsa',
    program: 'Web Development',
    location: 'Lusaka',
  },
  {
    name: 'Kenneth Mfula',
    role: 'Parent',
    image: '👨',
    text: 'Investment in my child\'s education has never felt better. She\'s excited about tech and asking to learn more every day!',
    rating: 5,
    childName: 'Lena',
    program: 'AI & Machine Learning',
    location: 'Kabwe',
  },
];

const stats = [
  { label: '2,500+', description: 'Happy Students' },
  { label: '95%', description: 'Satisfaction Rate' },
  { label: '4.9/5', description: 'Average Rating' },
  { label: '0', description: 'Safety Incidents' },
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Success Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            Hear from parents and students about their transformative experiences with ROBOTIX
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <p className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.label}</p>
                <p className="text-gray-600">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="elevated">
                  <CardContent>
                    {/* Quote Icon */}
                    <Quote className="w-8 h-8 text-gray-600 mb-4" />

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {Array(testimonial.rating)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

                    {/* Author Info */}
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{testimonial.image}</span>
                        <div>
                          <p className="font-bold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>

                      {/* Child Info */}
                      <div className="bg-gray-50 rounded p-3 text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">Child:</span> {testimonial.childName}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Program:</span> {testimonial.program}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Location:</span> {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12">Why Parents Trust Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Safety First</h3>
              <p className="text-gray-600">
                Rigorous safety protocols with zero reported incidents in 8+ years of operation
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-3">Transparent</h3>
              <p className="text-gray-600">
                Regular progress updates and open communication with parents every step
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3">Proven Results</h3>
              <p className="text-gray-600">
                2,500+ successful students with 95% satisfaction rate and measurable outcomes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Categories */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="kid">
              <CardContent>
                <h3 className="text-2xl font-bold mb-4">🎯 Confidence Boost</h3>
                <p className="text-gray-700">
                  Students develop confidence through hands-on learning and peer collaboration. 
                  Many shy students become program ambassadors!
                </p>
              </CardContent>
            </Card>
            <Card variant="kid">
              <CardContent>
                <h3 className="text-2xl font-bold mb-4">💡 Real Skills</h3>
                <p className="text-gray-700">
                  Students gain marketable skills in robotics, coding, and AI that set them apart 
                  from peers in school and future opportunities.
                </p>
              </CardContent>
            </Card>
            <Card variant="kid">
              <CardContent>
                <h3 className="text-2xl font-bold mb-4">🤝 Community</h3>
                <p className="text-gray-700">
                  Students build friendships with like-minded peers who share their passion for 
                  learning and innovation.
                </p>
              </CardContent>
            </Card>
            <Card variant="kid">
              <CardContent>
                <h3 className="text-2xl font-bold mb-4">🚀 Future Ready</h3>
                <p className="text-gray-700">
                  Students develop critical thinking and problem-solving skills that prepare them 
                  for high school, university, and tech careers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-brand-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Ready to Write Your Success Story?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied families and transform your child's future
          </p>
          <Link href="/auth/signup">
            <Button variant="kidPrimary" className="bg-white text-brand-600 hover:bg-gray-100">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
