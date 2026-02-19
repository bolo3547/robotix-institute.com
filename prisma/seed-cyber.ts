/**
 * Seed script for Cybersecurity Training Platform
 * Seeds challenges and badges into the database.
 * Run: npx tsx prisma/seed-cyber.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Challenge definitions ─────────────────────────────────────
const CHALLENGES = [
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
    displayOrder: 1,
    tags: JSON.stringify(['passwords', 'brute-force', 'entropy']),
    prerequisiteIds: JSON.stringify([]),
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
    displayOrder: 2,
    tags: JSON.stringify(['encryption', 'caesar-cipher', 'xor']),
    prerequisiteIds: JSON.stringify([]),
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
    displayOrder: 3,
    tags: JSON.stringify(['phishing', 'social-engineering', 'malware']),
    prerequisiteIds: JSON.stringify([]),
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
    displayOrder: 4,
    tags: JSON.stringify(['tcp-ip', 'dns', 'ports', 'protocols']),
    prerequisiteIds: JSON.stringify([]),
    isActive: true,
  },
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
    displayOrder: 5,
    tags: JSON.stringify(['sql', 'injection', 'database', 'sanitization']),
    prerequisiteIds: JSON.stringify(['ch-networking-quiz']),
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
    displayOrder: 6,
    tags: JSON.stringify(['xss', 'javascript', 'sanitization', 'web-security']),
    prerequisiteIds: JSON.stringify(['ch-networking-quiz']),
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
    displayOrder: 7,
    tags: JSON.stringify(['hashing', 'md5', 'sha256', 'rainbow-tables']),
    prerequisiteIds: JSON.stringify(['ch-encryption-basics']),
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
    displayOrder: 8,
    tags: JSON.stringify(['validation', 'csrf', 'sanitization', 'forms']),
    prerequisiteIds: JSON.stringify(['ch-sql-injection', 'ch-xss-simulation']),
    isActive: true,
  },
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
    displayOrder: 9,
    tags: JSON.stringify(['ctf', 'recon', 'exploitation', 'flags']),
    prerequisiteIds: JSON.stringify(['ch-sql-injection', 'ch-xss-simulation', 'ch-hash-analysis']),
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
    displayOrder: 10,
    tags: JSON.stringify(['vulnerability', 'owasp', 'scanning', 'remediation']),
    prerequisiteIds: JSON.stringify(['ch-form-validation']),
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
    displayOrder: 11,
    tags: JSON.stringify(['authentication', 'session', 'tokens', 'debugging']),
    prerequisiteIds: JSON.stringify(['ch-hash-analysis']),
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
    displayOrder: 12,
    tags: JSON.stringify(['rbac', 'authorization', 'privilege-escalation', 'access-control']),
    prerequisiteIds: JSON.stringify(['ch-auth-debug']),
    isActive: true,
  },
];

// ── Badge definitions ─────────────────────────────────────────
const BADGES = [
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

async function main() {
  console.log('🔒 Seeding Cybersecurity Training Platform...\n');

  // Use a single transaction to avoid connection pool exhaustion on Neon
  await prisma.$transaction(async (tx) => {
    // Delete existing data first, then bulk create
    await tx.cyberChallenge.deleteMany({});
    await tx.cyberBadge.deleteMany({});

    await tx.cyberChallenge.createMany({ data: CHALLENGES });
    console.log(`✅ Seeded ${CHALLENGES.length} challenges`);

    await tx.cyberBadge.createMany({ data: BADGES });
    console.log(`✅ Seeded ${BADGES.length} badges`);
  }, { timeout: 30000 });

  console.log('\n🎉 Cyber seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
