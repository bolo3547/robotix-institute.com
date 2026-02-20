import Link from 'next/link';
import Image from 'next/image';
import HeroClient from './HeroClient';

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Critical Thinking',
    description: 'Solve real problems and think like engineers.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Future Ready',
    description: 'Skills employers actually want.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Teamwork',
    description: 'Collaborate and lead with confidence.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Creativity',
    description: 'Build robots, write code, and invent.',
  },
];

export default function HeroSection() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 overflow-hidden">
        {/* Floating background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="float-slow absolute top-10 left-[10%] w-72 h-72 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="float-medium absolute top-[40%] right-[5%] w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="float-fast absolute bottom-10 left-[30%] w-48 h-48 rounded-full bg-pink-400/10 blur-2xl" />
          <div className="float-slow absolute top-[20%] right-[30%] w-20 h-20 rounded-full bg-amber-300/20 blur-xl" />
          <div className="float-medium absolute bottom-[20%] left-[5%] w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] dot-grid" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 text-white text-sm font-medium rounded-full mb-6 glass glow-pulse">
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
                Zambia&apos;s Leading STEM Education
              </div>

              {/* Headline with animated gradient text */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] mb-6">
                Pioneering Tomorrow
                <span className="block mt-2 gradient-text-animate">One Line of Code at a Time</span>
              </h1>

              {/* Rotating words — client component */}
              <HeroClient />

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-accent-500 hover:bg-accent-600 rounded-xl transition-all shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40"
                >
                  Book Free Trial
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-all shadow-lg shadow-green-500/20"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/programs"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-base font-medium text-white bg-white/15 hover:bg-white/25 rounded-xl transition-colors border border-white/20"
                >
                  View Programs
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['bg-brand-300', 'bg-accent-400', 'bg-green-400', 'bg-blue-400'].map((bg, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${bg} border-2 border-white/50 flex items-center justify-center text-[10px] font-bold text-white`}
                    >
                      {['M', 'N', 'J', 'C'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-brand-100 mt-0.5">
                    <span className="font-semibold text-white">2,500+</span> students trained
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image Grid */}
            <div className="relative hidden lg:block">
              {/* Main image */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/robotix3.jpg"
                  alt="Students learning robotics at Robotix Institute"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Secondary image */}
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white/30">
                <Image
                  src="/students2.jpg"
                  alt="Young students coding"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating award card */}
              <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-3 flex items-center gap-3 border border-white/20">
                <div className="w-10 h-10 bg-accent-400/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏆</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">6 Awards</div>
                  <div className="text-xs text-brand-100">National &amp; International</div>
                </div>
              </div>

              {/* Floating stats card */}
              <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">95% Satisfaction</div>
                    <div className="text-[10px] text-brand-100">Parent Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Parents Choose Us</h2>
            <p className="text-gray-600">Building confident, capable young minds.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="card-3d bg-white p-6 rounded-xl border border-gray-200 hover:border-brand-300 transition-all group cursor-default"
              >
                <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
