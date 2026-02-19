import HeroSection from '@/components/landing/HeroSection';
import PartnersLogoBar from '@/components/landing/PartnersLogoBar';
import AnimatedStats from '@/components/landing/AnimatedStats';
import LearningJourney from '@/components/landing/LearningJourney';
import CourseFinder from '@/components/landing/CourseFinder';
import ComparisonSection from '@/components/landing/ComparisonSection';
import LiveClassDemo from '@/components/landing/LiveClassDemo';
import StudentSpotlight from '@/components/landing/StudentSpotlight';
import OutcomesSection from '@/components/landing/OutcomesSection';
import BrochureDownload from '@/components/landing/BrochureDownload';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import ScrollReveal from '@/components/ui/ScrollReveal';

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

      {/* Final CTA */}
      <ScrollReveal direction="up">
        <CTASection />
      </ScrollReveal>
    </>
  );
}
