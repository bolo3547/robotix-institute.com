import dynamic from 'next/dynamic';
import HeroSection from '@/components/landing/HeroSection';
import PartnersLogoBar from '@/components/landing/PartnersLogoBar';
import AnimatedStats from '@/components/landing/AnimatedStats';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Lazy-load below-fold sections for faster initial page load
const LearningJourney = dynamic(() => import('@/components/landing/LearningJourney'));
const CourseFinder = dynamic(() => import('@/components/landing/CourseFinder'));
const ComparisonSection = dynamic(() => import('@/components/landing/ComparisonSection'));
const LiveClassDemo = dynamic(() => import('@/components/landing/LiveClassDemo'));
const StudentSpotlight = dynamic(() => import('@/components/landing/StudentSpotlight'));
const OutcomesSection = dynamic(() => import('@/components/landing/OutcomesSection'));
const BrochureDownload = dynamic(() => import('@/components/landing/BrochureDownload'));
const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'));
const CTASection = dynamic(() => import('@/components/landing/CTASection'));
const VideoShowcase = dynamic(() => import('@/components/landing/VideoShowcase'));

export default function HomePage() {
  return (
    <>
      {/* Hero — no delay, visible immediately */}
      <HeroSection />

      {/* Social proof — trusted by */}
      <ScrollReveal direction="up">
        <PartnersLogoBar />
      </ScrollReveal>

      {/* Animated impact numbers */}
      <ScrollReveal direction="up">
        <AnimatedStats />
      </ScrollReveal>

      {/* How it works — 4-step visual */}
      <ScrollReveal direction="up">
        <LearningJourney />
      </ScrollReveal>

      {/* Browse courses by age */}
      <ScrollReveal direction="up">
        <CourseFinder />
      </ScrollReveal>

      {/* Before / After comparison */}
      <ScrollReveal direction="left">
        <ComparisonSection />
      </ScrollReveal>

      {/* Live class preview */}
      <ScrollReveal direction="up">
        <LiveClassDemo />
      </ScrollReveal>

      {/* Student success stories */}
      <ScrollReveal direction="up">
        <StudentSpotlight />
      </ScrollReveal>

      {/* Outcomes grid */}
      <ScrollReveal direction="up">
        <OutcomesSection />
      </ScrollReveal>

      {/* Downloadable brochures */}
      <ScrollReveal direction="right">
        <BrochureDownload />
      </ScrollReveal>

      {/* Parent testimonials */}
      <ScrollReveal direction="up">
        <TestimonialsSection />
      </ScrollReveal>

      {/* TikTok Video Showcase */}
      <ScrollReveal direction="up">
        <VideoShowcase />
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal direction="up">
        <CTASection />
      </ScrollReveal>
    </>
  );
}
