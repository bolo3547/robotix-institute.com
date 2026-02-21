'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Star, Quote, MessageSquare } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
  childName: string;
  program: string;
  location: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetch('/api/admin/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch {
        // API not available yet
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

      {/* Testimonials Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {testimonials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No Testimonials Yet</h2>
              <p className="text-gray-500 max-w-md mb-8">
                Success stories will appear here as parents and students share their
                experiences with ROBOTIX.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id ?? index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card variant="elevated">
                    <CardContent>
                      <Quote className="w-8 h-8 text-gray-600 mb-4" />

                      {testimonial.rating > 0 && (
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
                      )}

                      <p className="text-gray-700 mb-6 italic">&quot;{testimonial.text}&quot;</p>

                      <div className="border-t pt-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{testimonial.image || '👤'}</span>
                          <div>
                            <p className="font-bold text-gray-900">{testimonial.name}</p>
                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                          </div>
                        </div>

                        {(testimonial.childName || testimonial.program || testimonial.location) && (
                          <div className="bg-gray-50 rounded p-3 text-sm">
                            {testimonial.childName && (
                              <p className="text-gray-600">
                                <span className="font-semibold">Child:</span> {testimonial.childName}
                              </p>
                            )}
                            {testimonial.program && (
                              <p className="text-gray-600">
                                <span className="font-semibold">Program:</span> {testimonial.program}
                              </p>
                            )}
                            {testimonial.location && (
                              <p className="text-gray-600">
                                <span className="font-semibold">Location:</span> {testimonial.location}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Parents Trust Us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12">Why Parents Trust Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Safety First</h3>
              <p className="text-gray-600">
                Rigorous safety protocols ensuring a secure learning environment for every child
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
                Dedicated educators with measurable learning outcomes for students
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Students Say */}
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
            Join our community and transform your child&apos;s future
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
