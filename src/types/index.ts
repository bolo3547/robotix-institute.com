// User roles and permissions
export type UserRole = 'parent' | 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Parent extends User {
  role: 'parent';
  phone: string;
  children: string[]; // Array of child IDs
  emergencyContact: EmergencyContact;
  preferences: ParentPreferences;
}

export interface Child extends User {
  role: 'student';
  dateOfBirth: Date;
  parentId: string;
  enrolledPrograms: Enrollment[];
  profileImage?: string;
  safetySettings: SafetySettings;
}

export interface Instructor extends User {
  role: 'instructor';
  bio: string;
  qualifications: string[];
  certifications: Certification[];
  assignedPrograms: string[]; // Program IDs
  availability: AvailabilitySlot[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: AdminPermission[];
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface ParentPreferences {
  notifications: NotificationPreference;
  language: string;
  timezone: string;
}

export interface SafetySettings {
  screenTimeLimit: number; // minutes per day
  parentalControls: boolean;
  restrictedFeatures: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: Date;
  expiryDate?: Date;
  credentialUrl?: string;
}

export interface AvailabilitySlot {
  day: string; // 'monday', 'tuesday', etc.
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface NotificationPreference {
  email: boolean;
  sms: boolean;
  push: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export type AdminPermission =
  | 'manage_users'
  | 'manage_programs'
  | 'manage_enrollments'
  | 'view_reports'
  | 'manage_instructors'
  | 'manage_payments';

// Program and Course Types
export interface Program {
  id: string;
  name: string;
  description: string;
  ageGroup: string; // e.g., "6-8", "9-12", "13-16"
  level: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  duration: number; // weeks
  sessionsPerWeek: number;
  maxStudents: number;
  instructor: string; // Instructor ID
  price: number; // in local currency
  curriculum: CurriculumModule[];
  learningOutcomes: string[];
  prerequisites?: string[];
  schedule: ClassSchedule;
  enrollments: Enrollment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CurriculumModule {
  week: number;
  title: string;
  description: string;
  topics: string[];
  learningOutcomes: string[];
  activities: Activity[];
  assessments: Assessment[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'hands-on' | 'theory' | 'project' | 'game';
  duration: number; // minutes
  materials?: string[];
  instructions: string;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'project' | 'presentation' | 'practical';
  rubric: string;
  dueDate?: Date;
}

export interface ClassSchedule {
  startDate: Date;
  endDate: Date;
  sessions: SessionSchedule[];
}

export interface SessionSchedule {
  day: string; // 'monday', 'tuesday', etc.
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
}

export interface Enrollment {
  id: string;
  childId: string;
  programId: string;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  progress: number; // 0-100
  attendance: Attendance[];
  grades: Grade[];
  completionDate?: Date;
}

export interface Attendance {
  date: Date;
  status: 'present' | 'absent' | 'excused' | 'late';
  notes?: string;
}

export interface Grade {
  assessmentId: string;
  score: number;
  maxScore: number;
  feedback: string;
  submissionDate: Date;
}

// Payment Types
export interface Payment {
  id: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'mobile_money';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface StudentProgress {
  childId: string;
  enrollmentId: string;
  overallProgress: number;
  modulesCompleted: number;
  totalModules: number;
  averageScore: number;
  lastActivityDate: Date;
  strengths: string[];
  areasForImprovement: string[];
}

export interface ParentDashboard {
  childId: string;
  childName: string;
  enrollments: EnrollmentWithProgress[];
  recentActivities: Activity[];
  upcomingSessions: SessionSchedule[];
  notifications: Notification[];
}

export interface EnrollmentWithProgress extends Enrollment {
  program: Program;
  progressDetails: StudentProgress;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'announcement' | 'grade' | 'attendance' | 'achievement' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  points: number;
}

export interface StudentAchievement {
  id: string;
  childId: string;
  achievementId: string;
  unlockedDate: Date;
  points: number;
}

// Testimonial and Social Proof
export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: 'parent' | 'child' | 'instructor';
  authorImage: string;
  rating: number; // 1-5
  text: string;
  childName?: string;
  programName?: string;
  createdAt: Date;
  verified: boolean;
}

export interface SuccessStory {
  id: string;
  childName: string;
  childImage?: string;
  parentName: string;
  programName: string;
  story: string;
  achievements: string[];
  beforeAfter?: {
    before: string;
    after: string;
  };
  createdAt: Date;
}

// Contact Form
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'inquiry' | 'feedback' | 'support';
  createdAt: Date;
  status: 'new' | 'in_review' | 'resolved';
}

// Quotation Types
export type QuotationStatus = 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface QuotationRequest {
  id: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number;
  programs: string[];
  message?: string;
  preferredSchedule?: string;
  createdAt: Date;
  status: 'pending' | 'sent';
}

export interface QuotationItem {
  programName: string;
  description: string;
  duration: string;
  sessionsPerWeek: number;
  pricePerMonth: number;
  quantity: number;
}

export interface Quotation {
  id: string;
  requestId?: string;
  quotationNumber: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number;
  items: QuotationItem[];
  subtotal: number;
  discount?: number;
  discountReason?: string;
  total: number;
  currency: string;
  validUntil: Date;
  notes?: string;
  terms: string;
  status: QuotationStatus;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Certificate Types
// ============================================================
export interface Certificate {
  id: string;
  childId: string;
  childName: string;
  programId: string;
  programName: string;
  enrollmentId: string;
  issueDate: Date;
  certificateNumber: string;
  grade: 'distinction' | 'merit' | 'pass';
  skills: string[];
  instructorName: string;
  downloadUrl?: string;
  shareUrl?: string;
}

// ============================================================
// Leaderboard & Gamification Types
// ============================================================
export interface LeaderboardEntry {
  rank: number;
  childId: string;
  childName: string;
  avatar?: string;
  xp: number;
  level: number;
  badges: BadgeInfo[];
  streak: number;
  programId?: string;
}

export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface XPTransaction {
  id: string;
  childId: string;
  amount: number;
  reason: string;
  type: 'attendance' | 'assignment' | 'quiz' | 'achievement' | 'streak' | 'bonus';
  createdAt: Date;
}

export interface StreakInfo {
  childId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakHistory: { date: Date; active: boolean }[];
}

// ============================================================
// Mobile Money / Payment Types
// ============================================================
export type MobileMoneyProvider = 'mtn' | 'airtel' | 'zamtel';

export interface MobileMoneyPayment {
  id: string;
  enrollmentId: string;
  amount: number;
  currency: 'ZMW';
  provider: MobileMoneyProvider;
  phoneNumber: string;
  status: 'initiated' | 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionRef: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface InstallmentPlan {
  id: string;
  enrollmentId: string;
  totalAmount: number;
  numberOfInstallments: number;
  installments: Installment[];
  status: 'active' | 'completed' | 'defaulted';
  createdAt: Date;
}

export interface Installment {
  id: string;
  planId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'upcoming' | 'due' | 'paid' | 'overdue';
  paymentId?: string;
}

export interface PaymentReceipt {
  id: string;
  paymentId: string;
  receiptNumber: string;
  parentName: string;
  childName: string;
  programName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paidAt: Date;
  downloadUrl?: string;
}

// ============================================================
// Notification System Types
// ============================================================
export type NotificationType =
  | 'grade_posted'
  | 'attendance_marked'
  | 'payment_due'
  | 'payment_received'
  | 'class_reminder'
  | 'achievement_unlocked'
  | 'announcement'
  | 'message'
  | 'enrollment_confirmed'
  | 'certificate_ready';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, string>;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationSettings {
  userId: string;
  inApp: boolean;
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  preferences: {
    grades: boolean;
    attendance: boolean;
    payments: boolean;
    announcements: boolean;
    reminders: boolean;
  };
}

// ============================================================
// Scheduling & Booking Types
// ============================================================
export interface BookableSlot {
  id: string;
  programId: string;
  instructorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBookings: number;
  isAvailable: boolean;
  type: 'regular' | 'trial' | 'makeup';
}

export interface Booking {
  id: string;
  slotId: string;
  childId: string;
  parentId: string;
  programId: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
  type: 'regular' | 'trial' | 'makeup';
  notes?: string;
  reminderSent: boolean;
  createdAt: Date;
}

export interface WaitlistEntry {
  id: string;
  childId: string;
  parentId: string;
  programId: string;
  position: number;
  status: 'waiting' | 'offered' | 'enrolled' | 'expired';
  createdAt: Date;
  notifiedAt?: Date;
}

// ============================================================
// Code Playground Types
// ============================================================
export type PlaygroundLanguage = 'scratch' | 'python' | 'javascript' | 'html';

export interface CodeProject {
  id: string;
  childId: string;
  title: string;
  description: string;
  language: PlaygroundLanguage;
  code: string;
  isPublic: boolean;
  likes: number;
  comments: ProjectComment[];
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl?: string;
}

export interface ProjectComment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: Date;
}

export interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: PlaygroundLanguage;
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  xpReward: number;
  hints: string[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
}

// ============================================================
// LMS / Video Lessons Types
// ============================================================
export interface VideoLesson {
  id: string;
  programId: string;
  moduleIndex: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // seconds
  thumbnailUrl: string;
  order: number;
  resources: LessonResource[];
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'download' | 'worksheet';
  url: string;
}

export interface LessonProgress {
  id: string;
  childId: string;
  lessonId: string;
  watchedDuration: number; // seconds
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // minutes
  xpReward: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  childId: string;
  quizId: string;
  answers: { questionId: string; answer: string; correct: boolean }[];
  score: number;
  maxScore: number;
  passed: boolean;
  completedAt: Date;
}

// ============================================================
// Analytics Dashboard Types
// ============================================================
export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: { month: string; amount: number }[];
  revenueByProgram: { programName: string; amount: number }[];
  outstandingPayments: number;
  averageRevenuePerStudent: number;
}

export interface EnrollmentAnalytics {
  totalEnrollments: number;
  activeEnrollments: number;
  enrollmentsByProgram: { programName: string; count: number }[];
  enrollmentTrend: { month: string; count: number }[];
  conversionRate: number;
  churnRate: number;
}

export interface PerformanceAnalytics {
  averageScore: number;
  attendanceRate: number;
  completionRate: number;
  topPerformers: { childName: string; score: number }[];
  scoreDistribution: { range: string; count: number }[];
  progressByProgram: { programName: string; avgProgress: number }[];
}

export interface InstructorAnalytics {
  instructorId: string;
  instructorName: string;
  classesCount: number;
  totalStudents: number;
  averageRating: number;
  attendanceRate: number;
  averageStudentScore: number;
}

// ============================================================
// Community / Social Types
// ============================================================
export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  title: string;
  content: string;
  category: 'general' | 'help' | 'showcase' | 'events' | 'feedback';
  tags: string[];
  likes: number;
  replies: ForumReply[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  likes: number;
  createdAt: Date;
}

// ============================================================
// Student Portfolio Types
// ============================================================
export interface Portfolio {
  id: string;
  childId: string;
  childName: string;
  bio: string;
  avatar?: string;
  projects: PortfolioProject[];
  certificates: Certificate[];
  achievements: StudentAchievement[];
  totalXP: number;
  level: number;
  isPublic: boolean;
  slug: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  mediaUrls: string[];
  tags: string[];
  programName: string;
  likes: number;
  featured: boolean;
  createdAt: Date;
}
