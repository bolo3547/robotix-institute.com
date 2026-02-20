'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Calendar } from 'lucide-react';

export interface FeedbackEntry {
  id: string | number;
  program: string;
  week: number;
  topic: string;
  notes: string;
  score: number | null;
  behavior: string | null;
  date: string;
}

interface InstructorFeedbackProps {
  feedback?: FeedbackEntry[];
}

export default function InstructorFeedback({ feedback = [] }: InstructorFeedbackProps) {
  // Convert score to a 1-5 star rating (score is 0-100)
  const scoreToStars = (score: number | null) => {
    if (score === null) return 0;
    return Math.max(1, Math.min(5, Math.round(score / 20)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-5 sm:p-8 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Instructor Feedback</h2>
      </div>

      {feedback.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No instructor feedback yet</p>
          <p className="text-sm mt-1">Feedback will appear here once the instructor adds weekly notes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((entry, idx) => {
            const stars = scoreToStars(entry.score);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 sm:p-5 border border-purple-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl sm:text-3xl">👨‍🏫</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {entry.program} — Week {entry.week}
                      </p>
                      <p className="text-xs sm:text-sm text-purple-700 font-medium">{entry.topic}</p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {stars > 0 && (
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm sm:text-base ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{entry.notes}</p>
                {entry.behavior && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    <span className="font-medium">Behavior:</span> {entry.behavior}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
