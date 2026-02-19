'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Calendar } from 'lucide-react';

export default function InstructorFeedback() {
  const feedbackList = [
    {
      id: 1,
      instructor: 'Alice Instructor',
      date: '2024-02-28',
      content: 'Emma is showing excellent progress in robotics! Her understanding of motor control has improved significantly.',
      rating: 5,
    },
    {
      id: 2,
      instructor: 'Alice Instructor',
      date: '2024-02-21',
      content: 'Great work on the coding project this week. Emma solved the logic puzzle independently!',
      rating: 5,
    },
    {
      id: 3,
      instructor: 'Alice Instructor',
      date: '2024-02-14',
      content: 'Emma collaborated well with peers. She could work on listening to feedback from team members.',
      rating: 4,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-8 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Instructor Feedback</h2>
      </div>

      <div className="space-y-4">
        {feedbackList.map((feedback, idx) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">👨‍🏫</div>
                <div>
                  <p className="font-semibold text-gray-900">{feedback.instructor}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    {new Date(feedback.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{feedback.content}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
