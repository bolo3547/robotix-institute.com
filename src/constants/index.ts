// Constants for the application

export const APP_NAME = 'ROBOTIX INSTITUTE';
export const APP_DESCRIPTION = 'World-Class Robotics & Coding Education for Children in Zambia';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Age Groups
export const AGE_GROUPS = {
  young: { label: 'Ages 6-8', value: '6-8' },
  middle: { label: 'Ages 9-12', value: '9-12' },
  teen: { label: 'Ages 13-16', value: '13-16' },
  preteen: { label: 'Ages 5-7', value: '5-7' },
};

// Program Levels
export const PROGRAM_LEVELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

// Enrollment Status
export const ENROLLMENT_STATUS = {
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  paused: 'Paused',
};

// Payment Status
export const PAYMENT_STATUS = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
  refunded: 'Refunded',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  present: 'Present',
  absent: 'Absent',
  excused: 'Excused',
  late: 'Late',
};

// Trust Signals & Social Proof
export const TRUST_SIGNALS = {
  studentCount: '2,500+',
  yearsOfExperience: '8+',
  awardsWon: 6,
  partnershipCount: 15,
  successRate: '95%',
  parentSatisfaction: '4.9/5',
};

// Contact Information
export const CONTACT_INFO = {
  phone: '+260 956 355 117',
  email: 'info@robotixinstitute.io',
  address: 'No. 7 Mistry Court, Great East Road, Lusaka Zambia',
  website: 'https://www.robotixinstitute.io',
};

// Testimonial Ratings
export const RATING_LABELS = {
  5: 'Excellent',
  4: 'Very Good',
  3: 'Good',
  2: 'Fair',
  1: 'Poor',
};

// Learning Outcomes
export const LEARNING_OUTCOMES = {
  robotics: [
    'Build and program robots from scratch',
    'Understand mechanical engineering principles',
    'Develop problem-solving skills',
    'Work collaboratively in teams',
    'Present and explain technical concepts',
  ],
  coding: [
    'Master fundamental programming concepts',
    'Build interactive applications',
    'Understand algorithms and data structures',
    'Debug and optimize code',
    'Deploy applications to the web',
  ],
  ai: [
    'Understand artificial intelligence basics',
    'Train machine learning models',
    'Work with datasets',
    'Build AI-powered applications',
    'Understand ethics in AI',
  ],
};

// Notification Types
export const NOTIFICATION_TYPES = {
  announcement: 'Announcement',
  grade: 'Grade Notification',
  attendance: 'Attendance Update',
  achievement: 'Achievement Unlocked',
  reminder: 'Reminder',
};

// Days of Week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Contact Types
export const CONTACT_TYPES = {
  inquiry: 'Inquiry',
  feedback: 'Feedback',
  support: 'Support Request',
};

// Validation Rules
export const VALIDATION = {
  minPasswordLength: 8,
  maxNameLength: 100,
  minNameLength: 2,
  phonePattern: /^(\+\d{1,3}|0)[\d\s-]{8,}$/,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// API Endpoints
export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  users: {
    profile: '/api/users/profile',
    update: '/api/users/update',
    children: '/api/users/children',
  },
  programs: {
    list: '/api/programs',
    detail: '/api/programs/:id',
    enroll: '/api/programs/:id/enroll',
  },
  enrollments: {
    list: '/api/enrollments',
    detail: '/api/enrollments/:id',
    progress: '/api/enrollments/:id/progress',
  },
  dashboard: {
    parent: '/api/dashboard/parent',
    child: '/api/dashboard/child',
    instructor: '/api/dashboard/instructor',
  },
  contact: {
    submit: '/api/contact',
  },
};
