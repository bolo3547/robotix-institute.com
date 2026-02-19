import Link from 'next/link';

export default function CTASection() {
  return (
    <section id="contact" className="bg-gradient-to-r from-brand-600 to-accent-600">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-white/80 mb-8">
            Empower your child with the skills of the future. Our Coding &amp; Robotics Program is designed for kids aged 6-18 to learn programming, build robots, and boost creativity &amp; confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-brand-700 bg-white hover:bg-gray-100 rounded-lg transition-colors"
            >
              Book Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Trust Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2,500+</div>
              <div className="text-sm text-white/80">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-sm text-white/80">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">8+ Years</div>
              <div className="text-sm text-white/80">Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
