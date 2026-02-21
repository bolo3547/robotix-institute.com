'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export default function LearningPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch('/api/learning/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch {
        // API not available yet
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" /> Learning Management
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Track your learning progress and continue where you left off</p>
        </motion.div>

        {courses.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Courses Yet</h2>
            <p className="text-gray-500 max-w-md mb-8">
              You haven&apos;t enrolled in any courses yet. Browse our programs to find
              the perfect learning path for you.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors"
            >
              Browse Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          /* Course Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4">Instructor: {course.instructor}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {course.completedLessons}/{course.totalLessons} lessons
                  </span>
                  <span className="text-sm font-bold text-accent-400">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-500 to-yellow-400 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <Link
                  href={`/learning/${course.id}`}
                  className="mt-4 inline-flex items-center text-sm text-accent-400 font-medium hover:text-accent-300"
                >
                  Continue Learning <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
