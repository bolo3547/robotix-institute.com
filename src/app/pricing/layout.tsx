import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | ROBOTIX Institute — Affordable Coding & Robotics Education',
  description:
    'View our program pricing for Robotics Foundations, Advanced Robotics, Python Programming, and AI & Machine Learning courses. Flexible plans for every family.',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
