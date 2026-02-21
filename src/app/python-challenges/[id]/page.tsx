'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lightbulb,
  Play,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  Trophy,
  Eye,
  EyeOff,
  Zap,
  RotateCcw,
  Code2,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';
import {
  PYTHON_CHALLENGES,
  DIFFICULTY_CONFIG,
  CATEGORY_CONFIG,
  type PythonChallenge,
} from '@/constants/pythonChallenges';

/* ─── localStorage helpers ─── */
interface ChallengeProgress {
  challengeId: string;
  status: 'completed' | 'in-progress';
  xpEarned: number;
  completedAt?: string;
  code?: string;
}

function getProgress(): ChallengeProgress[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('python-challenge-progress') || '[]');
  } catch {
    return [];
  }
}

function saveProgress(prog: ChallengeProgress[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('python-challenge-progress', JSON.stringify(prog));
}

/* ─── Page Component ─── */
export default function ChallengeSolverPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params?.id as string;

  const challenge = useMemo(
    () => PYTHON_CHALLENGES.find((c) => c.id === challengeId),
    [challengeId]
  );

  const [code, setCode] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<
    { passed: boolean; description: string; expected: string; got?: string }[] | null
  >(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showStory, setShowStory] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'solution'>('problem');

  /* Load saved code & progress */
  useEffect(() => {
    if (!challenge) return;
    const saved = getProgress();
    const existing = saved.find((p) => p.challengeId === challenge.id);
    if (existing?.code) {
      setCode(existing.code);
    } else {
      setCode(challenge.starterCode);
    }
    if (existing?.status === 'completed') {
      setIsSolved(true);
    }
  }, [challenge]);

  /* Auto-save code (debounced) */
  useEffect(() => {
    if (!challenge || !code) return;
    const timer = setTimeout(() => {
      const saved = getProgress();
      const idx = saved.findIndex((p) => p.challengeId === challenge.id);
      if (idx >= 0) {
        saved[idx].code = code;
      } else {
        saved.push({
          challengeId: challenge.id,
          status: 'in-progress',
          xpEarned: 0,
          code,
        });
      }
      saveProgress(saved);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code, challenge]);

  /* Simulate running tests (client-side pattern matching) */
  const runTests = useCallback(() => {
    if (!challenge) return;
    setIsRunning(true);
    setTestResults(null);

    // Simulate test execution with a brief delay
    setTimeout(() => {
      const results = challenge.testCases.map((tc) => {
        // Simple heuristic: check if the user's code contains key patterns
        // In a real implementation, this would run code server-side
        const userCode = code.trim();
        const hasContent = userCode.length > challenge.starterCode.trim().length + 10;
        const hasPrint = userCode.includes('print');
        const hasLogic = userCode.includes('if') || userCode.includes('for') || userCode.includes('while') || userCode.includes('def') || userCode.includes('return') || userCode.includes('=');

        // Check for key patterns from the solution
        const solutionWords = challenge.solutionCode
          .split(/[\s(){}[\]:,."'`=+\-*/<>!&|%]+/)
          .filter((w) => w.length > 2);
        const matchCount = solutionWords.filter((w) => userCode.includes(w)).length;
        const matchRatio = solutionWords.length > 0 ? matchCount / solutionWords.length : 0;

        const passed = hasContent && (hasPrint || hasLogic) && matchRatio > 0.3;

        return {
          passed,
          description: tc.explanation || `Input: ${tc.input.substring(0, 40)}...`,
          expected: tc.expected,
          got: passed ? tc.expected : 'Check your code and try again',
        };
      });

      setTestResults(results);

      const allPassed = results.every((r) => r.passed);
      if (allPassed && !isSolved) {
        setIsSolved(true);
        // Save completion
        const saved = getProgress();
        const idx = saved.findIndex((p) => p.challengeId === challenge.id);
        if (idx >= 0) {
          saved[idx].status = 'completed';
          saved[idx].xpEarned = challenge.xp;
          saved[idx].completedAt = new Date().toISOString();
          saved[idx].code = code;
        } else {
          saved.push({
            challengeId: challenge.id,
            status: 'completed',
            xpEarned: challenge.xp,
            completedAt: new Date().toISOString(),
            code,
          });
        }
        saveProgress(saved);
      }

      setIsRunning(false);
    }, 1200);
  }, [challenge, code, isSolved]);

  const resetCode = useCallback(() => {
    if (challenge) {
      setCode(challenge.starterCode);
      setTestResults(null);
      setIsSolved(false);
    }
  }, [challenge]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }, [code]);

  if (!challenge) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Challenge Not Found</h1>
          <p className="text-gray-500 mb-6">This challenge doesn&apos;t exist or has been removed.</p>
          <Link
            href="/python-challenges"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Arena
          </Link>
        </div>
      </main>
    );
  }

  const diff = DIFFICULTY_CONFIG[challenge.difficulty];
  const catCfg = CATEGORY_CONFIG[challenge.category];

  // Find prev/next challenges
  const currentIdx = PYTHON_CHALLENGES.findIndex((c) => c.id === challenge.id);
  const prevChallenge = currentIdx > 0 ? PYTHON_CHALLENGES[currentIdx - 1] : null;
  const nextChallenge = currentIdx < PYTHON_CHALLENGES.length - 1 ? PYTHON_CHALLENGES[currentIdx + 1] : null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/python-challenges"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> All Challenges
          </Link>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded-md ${diff.bg} ${diff.color} border ${diff.border}`}>
              {diff.emoji} {diff.label}
            </span>
            <span className="text-xs text-gray-500">
              {catCfg?.emoji} {catCfg?.label}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Star className="w-3 h-3" /> {challenge.xp} XP
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ═══ LEFT PANEL: Problem Description ═══ */}
          <div className="space-y-4">
            {/* Title */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-start gap-3 mb-3">
                {isSolved && <CheckCircle2 className="w-7 h-7 text-green-500 shrink-0 mt-1" />}
                <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
              </div>
              <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {(
                [
                  { key: 'problem', label: 'Problem', icon: BookOpen },
                  { key: 'hints', label: `Hints (${challenge.hints.length})`, icon: Lightbulb },
                  { key: 'solution', label: 'Solution', icon: Eye },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'problem' && (
                <motion.div
                  key="problem"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  {/* Real-World Story */}
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <button
                      onClick={() => setShowStory(!showStory)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span className="font-semibold text-orange-800 flex items-center gap-2">
                        🌍 Why This Matters
                      </span>
                      {showStory ? (
                        <ChevronUp className="w-4 h-4 text-orange-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-orange-600" />
                      )}
                    </button>
                    {showStory && (
                      <p className="mt-2 text-sm text-orange-700 leading-relaxed">
                        {challenge.realWorldContext}
                      </p>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> Skills You&apos;ll Learn
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {challenge.skillsTaught.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Test Cases Preview */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      📋 Test Cases ({challenge.testCases.length})
                    </h3>
                    <div className="space-y-2">
                      {challenge.testCases.map((tc, i) => (
                        <div
                          key={i}
                          className="bg-white border border-gray-200 rounded-lg p-3 text-sm"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <p className="text-gray-500 text-xs mb-1">Input:</p>
                              <pre className="text-gray-800 font-mono text-xs bg-gray-50 rounded p-2 whitespace-pre-wrap">
                                {tc.input || '(no input)'}
                              </pre>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-500 text-xs mb-1">Expected Output:</p>
                              <pre className="text-gray-800 font-mono text-xs bg-gray-50 rounded p-2 whitespace-pre-wrap">
                                {tc.expected}
                              </pre>
                            </div>
                          </div>
                          {tc.explanation && (
                            <p className="text-xs text-gray-400 mt-2">{tc.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bonus Challenge */}
                  {challenge.bonusChallenge && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <h3 className="font-semibold text-purple-800 flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4" /> Bonus Challenge
                      </h3>
                      <p className="text-sm text-purple-700">{challenge.bonusChallenge}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'hints' && (
                <motion.div
                  key="hints"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-gray-500">
                    Stuck? Reveal hints one at a time. Try to solve it with as few hints as possible!
                  </p>
                  {challenge.hints.map((hint, i) => (
                    <div
                      key={i}
                      className={`border rounded-xl p-4 transition-all ${
                        i < hintsRevealed
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {i < hintsRevealed ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className="text-sm text-gray-700 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{hint}</span>
                          </p>
                        </motion.div>
                      ) : (
                        <button
                          onClick={() => setHintsRevealed(i + 1)}
                          className="text-sm text-gray-400 hover:text-amber-600 transition flex items-center gap-2 w-full"
                        >
                          <EyeOff className="w-4 h-4" />
                          Reveal Hint {i + 1}
                        </button>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'solution' && (
                <motion.div
                  key="solution"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-3"
                >
                  {!showSolution ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                      <EyeOff className="w-10 h-10 text-red-300 mx-auto mb-3" />
                      <h3 className="font-bold text-red-800 mb-2">Solution Hidden</h3>
                      <p className="text-sm text-red-600 mb-4">
                        Try solving it yourself first! Looking at the solution means less learning.
                      </p>
                      <button
                        onClick={() => setShowSolution(true)}
                        className="px-5 py-2.5 bg-red-100 text-red-700 rounded-xl font-semibold text-sm hover:bg-red-200 transition"
                      >
                        I understand — Show Solution
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Reference Solution
                        </h3>
                        <button
                          onClick={() => setShowSolution(false)}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          Hide
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {challenge.solutionCode}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ RIGHT PANEL: Code Editor ═══ */}
          <div className="space-y-4">
            {/* Editor Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-orange-500" /> Your Code
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
                  aria-label="Copy code"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={resetCode}
                  className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
                  aria-label="Reset code"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Editor (textarea) */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-80 bg-gray-900 text-green-300 font-mono text-sm p-4 rounded-xl border-2 border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-y leading-relaxed"
                placeholder="Write your Python code here..."
              />
              {/* Line numbers overlay simulation */}
              <div className="absolute top-0 left-0 w-8 h-full bg-gray-800/50 rounded-l-xl pointer-events-none pt-4 pl-2">
                {Array.from({ length: Math.max(code.split('\n').length, 10) }, (_, i) => (
                  <div key={i} className="text-gray-600 text-xs leading-[1.625rem] font-mono">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex gap-3">
              <button
                onClick={runTests}
                disabled={isRunning}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  isRunning
                    ? 'bg-gray-200 text-gray-500 cursor-wait'
                    : isSolved
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200'
                }`}
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                    Running Tests...
                  </>
                ) : isSolved ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> All Tests Passed! Run Again
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" /> Run Tests
                  </>
                )}
              </button>
            </div>

            {/* Test Results */}
            <AnimatePresence>
              {testResults && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {/* Summary */}
                  {testResults.every((r) => r.passed) ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-green-800">
                          All Tests Passed! 🎉 +{challenge.xp} XP
                        </p>
                        <p className="text-sm text-green-600">
                          Great job! You solved &quot;{challenge.title}&quot;
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-bold text-red-800">Some Tests Failed</p>
                        <p className="text-sm text-red-600">
                          Keep trying! Check the hints tab for help.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Individual Results */}
                  {testResults.map((result, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                        result.passed
                          ? 'bg-green-50/50 border-green-200'
                          : 'bg-red-50/50 border-red-200'
                      }`}
                    >
                      {result.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={result.passed ? 'text-green-700' : 'text-red-700'}>
                          {result.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Expected: <code className="font-mono bg-gray-100 px-1 rounded">{result.expected.substring(0, 80)}{result.expected.length > 80 ? '...' : ''}</code>
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              {prevChallenge ? (
                <Link
                  href={`/python-challenges/${prevChallenge.id}`}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{prevChallenge.title}</span>
                  <span className="sm:hidden">Previous</span>
                </Link>
              ) : (
                <div />
              )}
              {nextChallenge ? (
                <Link
                  href={`/python-challenges/${nextChallenge.id}`}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition"
                >
                  <span className="hidden sm:inline">{nextChallenge.title}</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </Link>
              ) : (
                <Link
                  href="/python-challenges"
                  className="flex items-center gap-2 text-sm text-green-600 font-semibold hover:text-green-700 transition"
                >
                  <Trophy className="w-4 h-4" /> Back to Arena
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
