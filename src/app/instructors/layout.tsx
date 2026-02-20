import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instructors | ROBOTIX Institute — Meet Our Teaching Team',
  description:
    'Meet the certified instructors at ROBOTIX Institute who teach coding, robotics, and STEM programs to children aged 6-18 in Zambia.',
};

export default function InstructorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
