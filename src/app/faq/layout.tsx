import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | ROBOTIX Institute — Frequently Asked Questions',
  description:
    'Find answers to common questions about ROBOTIX Institute programs, enrollment, pricing, schedule, and more.',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
