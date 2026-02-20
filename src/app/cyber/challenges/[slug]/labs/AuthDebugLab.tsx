'use client';

import { useState } from 'react';
import { Shield, Bug, CheckCircle, XCircle, Code, Eye, EyeOff } from 'lucide-react';

interface AuthBug {
  id: string;
  title: string;
  category: string;
  codeSnippet: string;
  fixedSnippet: string;
  hint: string;
  explanation: string;
  options: string[];
  correctOption: number;
}

const AUTH_BUGS: AuthBug[] = [
  {
    id: 'bug-1',
    title: 'Plaintext Password Storage',
    category: 'Credential Storage',
    codeSnippet: `async function registerUser(username, password) {
  const user = await db.user.create({
    data: {
      username,
      password: password,  // Store directly
    },
  });
  return user;
}`,
    fixedSnippet: `async function registerUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  return user;
}`,
    hint: 'What happens if the database is breached?',
    explanation: 'Passwords must be hashed with bcrypt/scrypt/argon2 before storage. Plaintext passwords can be read directly if the DB is compromised.',
    options: ['Add encryption to the database', 'Hash the password with bcrypt before storing', 'Encode password in Base64', 'Use a shorter password'],
    correctOption: 1,
  },
  {
    id: 'bug-2',
    title: 'Missing Rate Limiting',
    category: 'Brute Force Protection',
    codeSnippet: `app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser(email);
  if (!user) return res.status(401).json({ error: 'Invalid' });
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid' });
  
  const token = jwt.sign({ id: user.id }, SECRET);
  return res.json({ token });
});`,
    fixedSnippet: `const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts'
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser(email);
  if (!user) return res.status(401).json({ error: 'Invalid' });
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid' });
  
  const token = jwt.sign({ id: user.id }, SECRET);
  return res.json({ token });
});`,
    hint: 'An attacker could try millions of passwords. How do you slow them down?',
    explanation: 'Without rate limiting, attackers can brute-force credentials. Add rate limiting (e.g., 5 attempts per 15 minutes) and account lockout.',
    options: ['Use a longer JWT secret', 'Add rate limiting middleware', 'Change to GET requests', 'Add CAPTCHA only'],
    correctOption: 1,
  },
  {
    id: 'bug-3',
    title: 'JWT Without Expiration',
    category: 'Session Management',
    codeSnippet: `function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );
}`,
    fixedSnippet: `function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }  // Token expires in 1 hour
  );
}`,
    hint: 'What if a token is stolen? Will it ever become invalid?',
    explanation: 'JWTs without expiration never expire — a stolen token gives permanent access. Always set expiresIn.',
    options: ['Add expiresIn to jwt.sign options', 'Use a random secret each time', 'Store tokens in the database', 'Use longer secrets'],
    correctOption: 0,
  },
  {
    id: 'bug-4',
    title: 'Insecure Password Reset',
    category: 'Account Recovery',
    codeSnippet: `app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await findUser(email);
  if (!user) return res.status(404).json({ error: 'Not found' });
  
  // Reset password directly — no verification!
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  return res.json({ message: 'Password reset!' });
});`,
    fixedSnippet: `app.post('/api/reset-password', async (req, res) => {
  const { email } = req.body;
  const user = await findUser(email);
  if (!user) return res.json({ message: 'If email exists, reset link sent' });
  
  const token = crypto.randomBytes(32).toString('hex');
  await saveResetToken(user.id, token, Date.now() + 3600000);
  await sendEmail(email, \`Reset link: .../reset?token=\${token}\`);
  return res.json({ message: 'If email exists, reset link sent' });
});`,
    hint: 'Anyone can change any password without proving they own the email!',
    explanation: 'This allows any attacker to reset anyone\'s password. Implement email verification with a time-limited token.',
    options: ['Send a verification token via email first', 'Use HTTPS', 'Add a CAPTCHA', 'Check password strength'],
    correctOption: 0,
  },
  {
    id: 'bug-5',
    title: 'Verbose Error Messages',
    category: 'Information Leakage',
    codeSnippet: `app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser(email);
  
  if (!user) {
    return res.status(401).json({ error: 'Email not found' });
  }
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  
  return res.json({ token: generateToken(user) });
});`,
    fixedSnippet: `app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser(email);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  return res.json({ token: generateToken(user) });
});`,
    hint: 'The error messages tell the attacker whether the email exists in the system.',
    explanation: 'Different error messages for "email not found" vs "wrong password" let attackers enumerate valid emails. Use a generic error message.',
    options: ['Use the same generic error for both cases', 'Remove error messages entirely', 'Add more specific error codes', 'Log the email attempt'],
    correctOption: 0,
  },
];

export default function AuthDebugLab() {
  const [currentBug, setCurrentBug] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showHints, setShowHints] = useState<Set<string>>(new Set());
  const [showFix, setShowFix] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());

  const bug = AUTH_BUGS[currentBug];
  const correctCount = Object.entries(answers).filter(([id, opt]) => {
    const b = AUTH_BUGS.find((x) => x.id === id);
    return b && b.correctOption === opt;
  }).length;
  const completed = correctCount >= 4;

  function selectOption(optIdx: number) {
    setAnswers((prev) => ({ ...prev, [bug.id]: optIdx }));
  }

  function submitAnswer() {
    setSubmitted((prev) => new Set(prev).add(bug.id));
    setShowFix((prev) => new Set(prev).add(bug.id));
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          Review 5 authentication code snippets and identify the security vulnerability in each. Answer correctly for at least 4 to complete.
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {AUTH_BUGS.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setCurrentBug(i)}
            className={`flex-1 h-8 rounded flex items-center justify-center text-[10px] font-mono transition-all border ${
              submitted.has(b.id)
                ? answers[b.id] === b.correctOption
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
                : i === currentBug
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-gray-900/30 border-gray-800 text-gray-600'
            }`}
          >
            {submitted.has(b.id) ? (answers[b.id] === b.correctOption ? '✓' : '✗') : i + 1}
          </button>
        ))}
      </div>

      {/* Bug Card */}
      <div className="bg-black/40 border border-gray-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-red-400" />
            <h4 className="text-sm font-semibold text-gray-200 font-mono">{bug.title}</h4>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">{bug.category}</span>
        </div>

        {/* Vulnerable Code */}
        <div className="bg-black border border-gray-700 rounded overflow-hidden mb-4">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-1.5">
              <Code className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] text-gray-500 font-mono">Vulnerable Code</span>
            </div>
            <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">BUG</span>
          </div>
          <pre className="p-3 text-[11px] text-gray-300 font-mono overflow-x-auto leading-relaxed">{bug.codeSnippet}</pre>
        </div>

        {/* Hint */}
        <div className="mb-4">
          <button
            onClick={() => setShowHints((prev) => { const n = new Set(prev); showHints.has(bug.id) ? n.delete(bug.id) : n.add(bug.id); return n; })}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300"
          >
            {showHints.has(bug.id) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showHints.has(bug.id) ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHints.has(bug.id) && <p className="text-[11px] text-yellow-400/70 mt-1 ml-4">💡 {bug.hint}</p>}
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-400 font-medium">What is the best fix?</p>
          {bug.options.map((opt, i) => {
            const isSelected = answers[bug.id] === i;
            const isSubmitted = submitted.has(bug.id);
            const isCorrect = i === bug.correctOption;

            return (
              <button
                key={i}
                onClick={() => !isSubmitted && selectOption(i)}
                disabled={isSubmitted}
                className={`w-full text-left p-3 rounded border text-xs transition-all flex items-center gap-2 ${
                  isSubmitted && isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : isSubmitted && isSelected && !isCorrect
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-gray-900/20 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                {isSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                {!isSubmitted && <span className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center flex-shrink-0 text-[10px]">{isSelected ? '●' : ''}</span>}
                {opt}
              </button>
            );
          })}
        </div>

        {!submitted.has(bug.id) && (
          <button
            onClick={submitAnswer}
            disabled={answers[bug.id] === undefined}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white text-xs font-medium rounded transition-colors"
          >
            Submit Answer
          </button>
        )}

        {/* Fixed Code */}
        {showFix.has(bug.id) && (
          <div className="mt-4">
            <div className="bg-black border border-emerald-500/20 rounded overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-gray-800 bg-emerald-500/5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-mono">Fixed Code</span>
              </div>
              <pre className="p-3 text-[11px] text-gray-300 font-mono overflow-x-auto leading-relaxed">{bug.fixedSnippet}</pre>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">📖 {bug.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentBug(Math.max(0, currentBug - 1))}
          disabled={currentBug === 0}
          className="px-3 py-1.5 border border-gray-800 text-gray-400 text-xs rounded disabled:opacity-30"
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentBug(Math.min(AUTH_BUGS.length - 1, currentBug + 1))}
          disabled={currentBug === AUTH_BUGS.length - 1}
          className="px-3 py-1.5 border border-gray-800 text-gray-400 text-xs rounded disabled:opacity-30"
        >
          Next →
        </button>
      </div>

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Challenge Complete! +300 XP</p>
            <p className="text-xs text-gray-400">You identified and fixed {correctCount}/5 authentication vulnerabilities.</p>
          </div>
        </div>
      )}
    </div>
  );
}
