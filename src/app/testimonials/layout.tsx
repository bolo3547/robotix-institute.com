import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testimonials | ROBOTIX Institute — Parent & Student Reviews',
  description:
    'Read what parents and students say about their experience with ROBOTIX Institute coding and robotics programs in Zambia.',
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
