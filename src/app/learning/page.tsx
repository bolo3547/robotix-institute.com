'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, CheckCircle, Clock, BookOpen, FileText,
  Download, ChevronRight, Lock, Award, BarChart3
} from 'lucide-react';

const courses = [
  {
    id: '1',
    title: 'Robotics Fundamentals',
    instructor: 'Mr. Banda',
    thumbnail: '🤖',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    modules: [
      {
        title: 'Module 1: Introduction to Robotics',
        lessons: [
          { id: 'l1', title: 'What is a Robot?', duration: '12:30', completed: true, videoUrl: '#' },
          { id: 'l2', title: 'History of Robotics', duration: '15:00', completed: true, videoUrl: '#' },
          { id: 'l3', title: 'Types of Robots', duration: '18:45', completed: true, videoUrl: '#' },
          { id: 'l4', title: 'Quiz: Robotics Basics', duration: '10:00', completed: true, videoUrl: '#', isQuiz: true },
        ],
      },
      {
        title: 'Module 2: Getting Started with Arduino',
        lessons: [
          { id: 'l5', title: 'Arduino Board Overview', duration: '20:00', completed: true, videoUrl: '#' },
          { id: 'l6', title: 'Setting Up Your First Circuit', duration: '25:30', completed: true, videoUrl: '#' },
          { id: 'l7', title: 'LED Blink Project', duration: '22:00', completed: true, videoUrl: '#' },
          { id: 'l8', title: 'Quiz: Arduino Basics', duration: '10:00', completed: true, videoUrl: '#', isQuiz: true },
        ],
      },
      {
        title: 'Module 3: Sensors & Input',
        lessons: [
          { id: 'l9', title: 'Introduction to Sensors', duration: '18:00', completed: true, videoUrl: '#' },
          { id: 'l10', title: 'Using Light Sensors', duration: '20:00', completed: true, videoUrl: '#' },
          { id: 'l11', title: 'Temperature Sensors', duration: '22:00', completed: true, videoUrl: '#' },
          { id: 'l12', title: 'Ultrasonic Distance Sensor', duration: '25:00', completed: true, videoUrl: '#' },
          { id: 'l13', title: 'Sensor Project: Smart Light', duration: '30:00', completed: true, videoUrl: '#' },
          { id: 'l14', title: 'Quiz: Sensors', duration: '12:00', completed: true, videoUrl: '#', isQuiz: true },
        ],
      },
      {
        title: 'Module 4: Motors & Movement',
        lessons: [
          { id: 'l15', title: 'DC Motors Explained', duration: '15:00', completed: true, videoUrl: '#' },
          { id: 'l16', title: 'Servo Motors', duration: '18:00', completed: true, videoUrl: '#' },
          { id: 'l17', title: 'Building a Moving Robot', duration: '35:00', completed: false, videoUrl: '#', current: true },
          { id: 'l18', title: 'Line Following Robot', duration: '40:00', completed: false, videoUrl: '#' },
          { id: 'l19', title: 'Quiz: Motors', duration: '10:00', completed: false, videoUrl: '#', isQuiz: true },
        ],
      },
      {
        title: 'Module 5: Advanced Projects',
        lessons: [
          { id: 'l20', title: 'Robot Arm Design', duration: '30:00', completed: false, videoUrl: '#', locked: true },
          { id: 'l21', title: 'Obstacle Avoidance', duration: '35:00', completed: false, videoUrl: '#', locked: true },
          { id: 'l22', title: 'Remote Control Robot', duration: '40:00', completed: false, videoUrl: '#', locked: true },
          { id: 'l23', title: 'Final Project', duration: '60:00', completed: false, videoUrl: '#', locked: true },
          { id: 'l24', title: 'Final Assessment', duration: '20:00', completed: false, videoUrl: '#', isQuiz: true, locked: true },
        ],
      },
    ],
    resources: [
      { title: 'Arduino Starter Kit Guide', type: 'pdf', size: '2.4 MB' },
      { title: 'Sensor Wiring Diagrams', type: 'pdf', size: '1.8 MB' },
      { title: 'Code Repository', type: 'link', url: '#' },
      { title: 'Parts List', type: 'pdf', size: '0.5 MB' },
    ],
  },
];

export default function LearningPage() {
  const [selectedCourse] = useState(courses[0]);
  const [activeModule, setActiveModule] = useState(3); // Module 4 is active
  const [activeLesson, setActiveLesson] = useState<string | null>('l17');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'lessons' | 'resources' | 'quizzes'>('lessons');

  const currentLesson = selectedCourse.modules.flatMap(m => m.lessons).find(l => l.id === activeLesson);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" /> Learning Management
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedCourse.title}</h1>
              <p className="text-gray-600 mt-1">Instructor: {selectedCourse.instructor} • {selectedCourse.totalLessons} lessons</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-accent-400 font-bold text-lg">{selectedCourse.progress}%</p>
                <p className="text-gray-500 text-xs">Complete</p>
              </div>
              <div className="w-24 h-2 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-500 to-yellow-400 rounded-full" style={{ width: `${selectedCourse.progress}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <div className="bg-brand-900 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl block mb-4">{selectedCourse.thumbnail}</span>
                <h2 className="text-white font-bold text-xl mb-2">{currentLesson?.title || 'Select a lesson'}</h2>
                <p className="text-gray-300 mb-6">{currentLesson?.duration}</p>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors mx-auto"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-brand-900" />
                  ) : (
                    <Play className="w-8 h-8 text-brand-900 ml-1" />
                  )}
                </button>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-50">
                <div className="h-full bg-accent-500 w-1/3 rounded-r-full" />
              </div>
            </div>

            {/* Tabs for Resources / Quizzes */}
            <div className="flex gap-2 bg-white p-1.5 rounded-xl w-fit">
              {[
                { id: 'lessons', label: 'Lesson Notes', icon: BookOpen },
                { id: 'resources', label: 'Resources', icon: FileText },
                { id: 'quizzes', label: 'Quizzes', icon: BarChart3 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === id
                      ? 'bg-accent-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>

            {activeTab === 'lessons' && currentLesson && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-gray-900 font-bold text-lg mb-3">{currentLesson.title}</h3>
                <div className="prose prose-invert max-w-none text-gray-600 text-sm space-y-3">
                  <p>In this lesson, you will learn how to connect and control DC motors to build a moving robot. We&apos;ll cover motor drivers, PWM speed control, and directional movement.</p>
                  <h4 className="text-gray-900 font-semibold">Key Topics:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>H-Bridge motor driver circuit</li>
                    <li>PWM (Pulse Width Modulation) for speed control</li>
                    <li>Forward, backward, and turning movements</li>
                    <li>Chassis assembly and wiring</li>
                  </ul>
                  <h4 className="text-gray-900 font-semibold mt-4">Activity:</h4>
                  <p>Build a two-wheeled robot that can move forward, backward, turn left, and turn right using Arduino commands.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-gray-900 font-bold text-lg mb-4">Course Resources</h3>
                <div className="space-y-3">
                  {selectedCourse.resources.map((res, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium text-sm">{res.title}</p>
                          <p className="text-gray-500 text-xs uppercase">{res.type} {res.size && `• ${res.size}`}</p>
                        </div>
                      </div>
                      <button className="p-2 text-accent-400 hover:text-accent-300 transition-colors" aria-label="Download resource">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'quizzes' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-gray-900 font-bold text-lg mb-4">Module Quizzes</h3>
                <div className="space-y-3">
                  {selectedCourse.modules.map((mod, idx) => {
                    const quiz = mod.lessons.find(l => (l as { isQuiz?: boolean }).isQuiz);
                    if (!quiz) return null;
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            quiz.completed ? 'bg-green-500/20' : (quiz as { locked?: boolean }).locked ? 'bg-gray-100' : 'bg-accent-500/20'
                          }`}>
                            {quiz.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (quiz as { locked?: boolean }).locked ? (
                              <Lock className="w-5 h-5 text-gray-400" />
                            ) : (
                              <BarChart3 className="w-5 h-5 text-accent-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium text-sm">{quiz.title}</p>
                            <p className="text-gray-500 text-xs">{mod.title} • {quiz.duration}</p>
                          </div>
                        </div>
                        {quiz.completed ? (
                          <span className="text-green-400 font-bold text-sm">92%</span>
                        ) : !(quiz as { locked?: boolean }).locked ? (
                          <button className="px-4 py-1.5 bg-accent-500 text-white rounded-lg text-sm font-semibold hover:bg-accent-600 transition-colors">
                            Take Quiz
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">Locked</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Lesson Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-fit sticky top-4">
            <div className="p-4 bg-gray-100 border-b border-gray-200">
              <h3 className="text-gray-900 font-bold">Course Content</h3>
              <p className="text-gray-500 text-sm">{selectedCourse.completedLessons}/{selectedCourse.totalLessons} lessons completed</p>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {selectedCourse.modules.map((mod, modIdx) => (
                <div key={modIdx}>
                  <button
                    onClick={() => setActiveModule(activeModule === modIdx ? -1 : modIdx)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-gray-900 font-medium text-sm">{mod.title}</p>
                      <p className="text-gray-500 text-xs">{mod.lessons.filter(l => l.completed).length}/{mod.lessons.length} completed</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeModule === modIdx ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeModule === modIdx && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        {mod.lessons.map((lesson) => {
                          const isActive = activeLesson === lesson.id;
                          const isLocked = (lesson as { locked?: boolean }).locked;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => !isLocked && setActiveLesson(lesson.id)}
                              disabled={isLocked}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-all ${
                                isActive
                                  ? 'bg-accent-500/10 border-l-2 border-accent-500'
                                  : 'border-l-2 border-transparent hover:bg-gray-100'
                              } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <div className="flex-shrink-0">
                                {lesson.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : isLocked ? (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                ) : (lesson as { current?: boolean }).current ? (
                                  <Play className="w-4 h-4 text-accent-400" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`truncate ${isActive ? 'text-accent-400 font-medium' : 'text-gray-700'}`}>
                                  {(lesson as { isQuiz?: boolean }).isQuiz ? '📝 ' : ''}{lesson.title}
                                </p>
                              </div>
                              <span className="text-gray-400 text-xs flex-shrink-0 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {lesson.duration}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Certificate CTA */}
            <div className="p-4 bg-gray-100 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-accent-400" />
                <p className="text-gray-900 font-semibold text-sm">Earn Your Certificate</p>
              </div>
              <p className="text-gray-500 text-xs mb-3">Complete all lessons and quizzes to earn your certificate of completion.</p>
              <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-500 to-yellow-400 rounded-full" style={{ width: `${selectedCourse.progress}%` }} />
              </div>
              <p className="text-gray-400 text-xs mt-1">{selectedCourse.totalLessons - selectedCourse.completedLessons} lessons remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
