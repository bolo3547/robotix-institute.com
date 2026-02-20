import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programs | ROBOTIX Institute — Robotics, Coding & AI Courses',
  description:
    'Explore our programs: Robotics Foundations, Advanced Robotics, Python Programming, AI & Machine Learning, Digital Skills, and Coding Basics for ages 6-18.',
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
