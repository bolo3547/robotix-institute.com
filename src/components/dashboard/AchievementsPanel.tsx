'use client';

import Badge from './Badge';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  name: string;
  earned: boolean;
}

interface Props {
  achievements: Achievement[];
}

export default function AchievementsPanel({ achievements }: Props) {
  return (
    <section aria-label="Achievements">
      <h3 className="text-xl font-bold mb-4">Achievements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((a) => (
          <motion.div key={a.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Badge name={a.name} earned={a.earned} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
