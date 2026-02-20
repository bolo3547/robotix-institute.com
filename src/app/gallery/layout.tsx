import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | ROBOTIX Institute — Photos & Highlights',
  description:
    'Browse photos from ROBOTIX Institute events, classes, competitions, and student showcases across Lusaka, Zambia.',
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
