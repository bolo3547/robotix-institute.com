import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | ROBOTIX Institute — Coding & Robotics Education in Zambia',
  description:
    'Learn about ROBOTIX Institute — Zambia\'s leading coding and robotics education provider for children aged 6-18. Founded in 2016, now serving 2,500+ students.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
