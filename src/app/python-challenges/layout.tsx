import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Python Challenge Arena | ROBOTIX Institute',
  description:
    'Solve 30+ real-world Python challenges across 4 difficulty levels. Learn problem-solving skills, earn XP, and level up from Starter to Master.',
  openGraph: {
    title: 'Python Challenge Arena — ROBOTIX Institute',
    description:
      'Real-world Python problems for kids ages 10-18. Think bigger, solve harder, build your future in tech.',
  },
};

export default function PythonChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
