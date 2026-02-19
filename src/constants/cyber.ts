// ============================================================
// Cybersecurity Training Platform — Constants & Seed Data
// ============================================================
import { Challenge, Badge, NavItem } from '@/types/cyber';

// ── Navigation ────────────────────────────────────────────────
export const CYBER_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/cyber', icon: 'LayoutDashboard' },
  { label: 'Challenges', href: '/cyber/challenges', icon: 'Shield' },
  { label: 'Progress', href: '/cyber/progress', icon: 'TrendingUp' },
  { label: 'Leaderboard', href: '/cyber/leaderboard', icon: 'Trophy' },
  { label: 'Resources', href: '/cyber/resources', icon: 'BookOpen' },
  { label: 'Admin Panel', href: '/cyber/admin', icon: 'Settings', adminOnly: true },
];

// ── All 12 Challenges ────────────────────────────────────────
export const CHALLENGES: Challenge[] = [
  // ── Beginner ──
  {
    id: 'ch-password-strength',
    title: 'Password Strength Analyzer',
    slug: 'password-strength',
    description: 'Build and test a password strength analyzer. Learn what makes a password secure and how attackers crack weak passwords.',
    objective: 'Understand password entropy, common attack vectors (dictionary, brute-force), and create a strength scoring algorithm.',
    difficulty: 'beginner',
    category: 'password-security',
    estimatedTime: 20,
    points: 100,
    order: 1,
    tags: ['passwords', 'brute-force', 'entropy'],
    prerequisiteIds: [],
    isActive: true,
  },
  {
    id: 'ch-encryption-basics',
    title: 'Basic Encryption / Decryption',
    slug: 'encryption-basics',
    description: 'Explore Caesar cipher, ROT13, and XOR encryption. Encrypt and decrypt messages in a live sandbox.',
    objective: 'Learn symmetric encryption fundamentals, understand how classical ciphers work and why modern encryption is needed.',
    difficulty: 'beginner',
    category: 'encryption',
    estimatedTime: 25,
    points: 100,
    order: 2,
    tags: ['encryption', 'caesar-cipher', 'xor'],
    prerequisiteIds: [],
    isActive: true,
  },
  {
    id: 'ch-awareness-quiz',
    title: 'Cybersecurity Awareness Quiz',
    slug: 'awareness-quiz',
    description: 'Test your knowledge of phishing, social engineering, malware, and safe online practices.',
    objective: 'Identify common cyber threats, understand social engineering tactics, and learn best practices for staying safe online.',
    difficulty: 'beginner',
    category: 'awareness',
    estimatedTime: 15,
    points: 75,
    order: 3,
    tags: ['phishing', 'social-engineering', 'malware'],
    prerequisiteIds: [],
    isActive: true,
  },
  {
    id: 'ch-networking-quiz',
    title: 'Networking Fundamentals Quiz',
    slug: 'networking-quiz',
    description: 'Master the basics of TCP/IP, DNS, HTTP, ports, and network protocols through interactive exercises.',
    objective: 'Understand OSI model, TCP/IP stack, common ports, and how network traffic flows between systems.',
    difficulty: 'beginner',
    category: 'networking',
    estimatedTime: 20,
    points: 75,
    order: 4,
    tags: ['tcp-ip', 'dns', 'ports', 'protocols'],
    prerequisiteIds: [],
    isActive: true,
  },

  // ── Intermediate ──
  {
    id: 'ch-sql-injection',
    title: 'SQL Injection Simulation',
    slug: 'sql-injection',
    description: 'Practice SQL injection attacks in a safe sandbox. Learn how unsanitized inputs allow database manipulation.',
    objective: 'Understand SQL injection vectors, practice exploitation in a controlled environment, and learn prevention techniques.',
    difficulty: 'intermediate',
    category: 'injection',
    estimatedTime: 35,
    points: 200,
    order: 5,
    tags: ['sql', 'injection', 'database', 'sanitization'],
    prerequisiteIds: ['ch-networking-quiz'],
    isActive: true,
  },
  {
    id: 'ch-xss-simulation',
    title: 'Cross-Site Scripting (XSS)',
    slug: 'xss-simulation',
    description: 'Discover how XSS attacks work by injecting scripts into a mock web application, then patch the vulnerabilities.',
    objective: 'Understand stored, reflected, and DOM-based XSS, practice exploitation, and implement proper output encoding.',
    difficulty: 'intermediate',
    category: 'xss',
    estimatedTime: 35,
    points: 200,
    order: 6,
    tags: ['xss', 'javascript', 'sanitization', 'web-security'],
    prerequisiteIds: ['ch-networking-quiz'],
    isActive: true,
  },
  {
    id: 'ch-hash-analysis',
    title: 'Hash Analysis Demo',
    slug: 'hash-analysis',
    description: 'Analyze MD5, SHA-1, SHA-256 hashes. Crack weak hashes using rainbow tables and understand salt + pepper.',
    objective: 'Learn hashing vs encryption, understand hash collisions, rainbow tables, and modern salted hashing best practices.',
    difficulty: 'intermediate',
    category: 'hashing',
    estimatedTime: 30,
    points: 175,
    order: 7,
    tags: ['hashing', 'md5', 'sha256', 'rainbow-tables'],
    prerequisiteIds: ['ch-encryption-basics'],
    isActive: true,
  },
  {
    id: 'ch-form-validation',
    title: 'Secure Form Validation',
    slug: 'form-validation',
    description: 'Build a form with proper server-side validation. Learn to prevent injection, XSS, and bypass attacks.',
    objective: 'Implement input validation, output sanitization, CSRF protection, and understand defense-in-depth for web forms.',
    difficulty: 'intermediate',
    category: 'validation',
    estimatedTime: 30,
    points: 175,
    order: 8,
    tags: ['validation', 'csrf', 'sanitization', 'forms'],
    prerequisiteIds: ['ch-sql-injection', 'ch-xss-simulation'],
    isActive: true,
  },

  // ── Advanced ──
  {
    id: 'ch-ctf',
    title: 'Capture The Flag',
    slug: 'capture-the-flag',
    description: 'Find hidden flags across a mock system. Combine all your skills in this multi-stage CTF challenge.',
    objective: 'Apply reconnaissance, exploitation, and post-exploitation skills in a controlled multi-stage capture-the-flag scenario.',
    difficulty: 'advanced',
    category: 'ctf',
    estimatedTime: 60,
    points: 500,
    order: 9,
    tags: ['ctf', 'recon', 'exploitation', 'flags'],
    prerequisiteIds: ['ch-sql-injection', 'ch-xss-simulation', 'ch-hash-analysis'],
    isActive: true,
  },
  {
    id: 'ch-vuln-scanner',
    title: 'Vulnerability Scanning Demo',
    slug: 'vulnerability-scanner',
    description: 'Run a simulated vulnerability scan against a mock server. Identify OWASP Top 10 vulnerabilities.',
    objective: 'Understand vulnerability scanning methodology, OWASP Top 10 categories, and remediation strategies.',
    difficulty: 'advanced',
    category: 'vulnerability',
    estimatedTime: 45,
    points: 400,
    order: 10,
    tags: ['vulnerability', 'owasp', 'scanning', 'remediation'],
    prerequisiteIds: ['ch-form-validation'],
    isActive: true,
  },
  {
    id: 'ch-auth-debug',
    title: 'Auth Debugging Challenge',
    slug: 'auth-debugging',
    description: 'Find and fix security flaws in a broken authentication system. Bypass weak auth, then secure it.',
    objective: 'Identify authentication vulnerabilities like session fixation, weak tokens, and insecure password storage.',
    difficulty: 'advanced',
    category: 'auth-debug',
    estimatedTime: 45,
    points: 400,
    order: 11,
    tags: ['authentication', 'session', 'tokens', 'debugging'],
    prerequisiteIds: ['ch-hash-analysis'],
    isActive: true,
  },
  {
    id: 'ch-rbac-challenge',
    title: 'Implement RBAC',
    slug: 'rbac-challenge',
    description: 'Design and implement a role-based access control system from scratch. Test privilege escalation defenses.',
    objective: 'Build RBAC with roles, permissions, and guards. Understand horizontal/vertical privilege escalation and mitigation.',
    difficulty: 'advanced',
    category: 'rbac',
    estimatedTime: 50,
    points: 450,
    order: 12,
    tags: ['rbac', 'authorization', 'privilege-escalation', 'access-control'],
    prerequisiteIds: ['ch-auth-debug'],
    isActive: true,
  },
];

// ── Badges ────────────────────────────────────────────────────
export const BADGES: Badge[] = [
  { id: 'b-first-blood', name: 'First Blood', description: 'Complete your first challenge', icon: '🩸', rarity: 'common' },
  { id: 'b-beginner-clear', name: 'Beginner Clear', description: 'Complete all beginner challenges', icon: '🟢', rarity: 'uncommon' },
  { id: 'b-intermediate-clear', name: 'Intermediate Clear', description: 'Complete all intermediate challenges', icon: '🟡', rarity: 'rare' },
  { id: 'b-advanced-clear', name: 'Advanced Clear', description: 'Complete all advanced challenges', icon: '🔴', rarity: 'epic' },
  { id: 'b-full-clear', name: 'Full Clear', description: 'Complete every challenge', icon: '🏆', rarity: 'legendary' },
  { id: 'b-speed-demon', name: 'Speed Demon', description: 'Complete a challenge in under 5 minutes', icon: '⚡', rarity: 'uncommon' },
  { id: 'b-perfect-score', name: 'Perfect Score', description: 'Score 100% on any challenge', icon: '💯', rarity: 'rare' },
  { id: 'b-streak-7', name: 'Week Warrior', description: '7-day streak', icon: '🔥', rarity: 'uncommon' },
  { id: 'b-streak-30', name: 'Cyber Dedicated', description: '30-day streak', icon: '🌟', rarity: 'epic' },
  { id: 'b-ctf-master', name: 'CTF Master', description: 'Find all flags in Capture The Flag', icon: '🚩', rarity: 'legendary' },
  { id: 'b-sql-ninja', name: 'SQL Ninja', description: 'Complete SQL Injection with perfect score', icon: '💉', rarity: 'rare' },
  { id: 'b-xss-hunter', name: 'XSS Hunter', description: 'Complete XSS challenge with perfect score', icon: '🎯', rarity: 'rare' },
];

// ── Resources ─────────────────────────────────────────────────
export interface CyberResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'article' | 'video' | 'tool' | 'reference';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
}

export const RESOURCES: CyberResource[] = [
  { id: 'r-1', title: 'OWASP Top 10', description: 'The definitive guide to the most critical web application security risks.', url: 'https://owasp.org/www-project-top-ten/', category: 'reference', difficulty: 'all' },
  { id: 'r-2', title: 'CyberChef', description: 'The Cyber Swiss Army Knife — a web app for encryption, encoding, compression and more.', url: 'https://gchq.github.io/CyberChef/', category: 'tool', difficulty: 'all' },
  { id: 'r-3', title: 'How HTTPS Works', description: 'A fun comic that explains how HTTPS, TLS, and certificates work together.', url: 'https://howhttps.works/', category: 'article', difficulty: 'beginner' },
  { id: 'r-4', title: 'Hacker101', description: 'Free classes for web security by HackerOne — videos and CTF challenges.', url: 'https://www.hacker101.com/', category: 'video', difficulty: 'intermediate' },
  { id: 'r-5', title: 'OverTheWire Bandit', description: 'Learn Linux and security concepts through a fun war game.', url: 'https://overthewire.org/wargames/bandit/', category: 'tool', difficulty: 'beginner' },
  { id: 'r-6', title: 'PortSwigger Web Security Academy', description: 'Free online web security training from the creators of Burp Suite.', url: 'https://portswigger.net/web-security', category: 'article', difficulty: 'intermediate' },
  { id: 'r-7', title: 'Exploit Education', description: 'Learn about memory corruption, format strings, and more with hands-on VMs.', url: 'https://exploit.education/', category: 'tool', difficulty: 'advanced' },
  { id: 'r-8', title: 'Computerphile - Password Cracking', description: 'How passwords are cracked and why salting matters — explained clearly.', url: 'https://www.youtube.com/watch?v=7U-RbOKanYs', category: 'video', difficulty: 'beginner' },
];

// ── Difficulty config ─────────────────────────────────────────
export const DIFFICULTY_CONFIG = {
  beginner: { label: 'Beginner', color: '#22c55e', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  intermediate: { label: 'Intermediate', color: '#f59e0b', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  advanced: { label: 'Advanced', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  'password-security': 'Password Security',
  encryption: 'Encryption',
  awareness: 'Cyber Awareness',
  networking: 'Networking',
  injection: 'Injection Attacks',
  xss: 'Cross-Site Scripting',
  hashing: 'Hashing & Integrity',
  validation: 'Input Validation',
  ctf: 'Capture The Flag',
  vulnerability: 'Vulnerability Assessment',
  'auth-debug': 'Authentication',
  rbac: 'Access Control',
};
