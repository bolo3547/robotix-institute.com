'use client';

import { useState } from 'react';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is phishing?',
    options: [
      'A type of firewall',
      'A social engineering attack that tricks users into revealing sensitive info',
      'An encryption method',
      'A type of antivirus software',
    ],
    correct: 1,
    explanation: 'Phishing uses deceptive emails, messages, or websites to trick users into sharing passwords, credit card details, or other sensitive information.',
  },
  {
    id: 2,
    question: 'Which of the following is the safest password?',
    options: ['password123', 'MyDog2024', 'Tr0ub4dor&3', 'correct-horse-battery-staple'],
    correct: 3,
    explanation: 'A long passphrase like "correct-horse-battery-staple" has very high entropy. Length beats complexity!',
  },
  {
    id: 3,
    question: 'What does HTTPS mean?',
    options: [
      'HyperText Transfer Protocol Special',
      'Highly Trusted Protocol System',
      'HyperText Transfer Protocol Secure',
      'Home Transfer Packet Service',
    ],
    correct: 2,
    explanation: 'HTTPS uses TLS/SSL encryption to protect data in transit between your browser and the server.',
  },
  {
    id: 4,
    question: 'What is ransomware?',
    options: [
      'Software that speeds up your computer',
      'Malware that encrypts files and demands payment',
      'A type of firewall',
      'An antivirus tool',
    ],
    correct: 1,
    explanation: 'Ransomware encrypts victim files and demands a ransom (often in cryptocurrency) for the decryption key.',
  },
  {
    id: 5,
    question: 'What should you do when you receive an unexpected email with an attachment from an unknown sender?',
    options: [
      'Open it immediately',
      'Forward it to friends',
      'Delete it or report it as suspicious',
      'Reply asking who they are',
    ],
    correct: 2,
    explanation: 'Never open attachments from unknown senders. Report suspicious emails to your IT department.',
  },
  {
    id: 6,
    question: 'What is two-factor authentication (2FA)?',
    options: [
      'Using two different passwords',
      'Logging in from two devices',
      'A method requiring two forms of verification to access an account',
      'Encrypting data twice',
    ],
    correct: 2,
    explanation: '2FA requires something you know (password) + something you have (phone/token) or something you are (biometrics).',
  },
  {
    id: 7,
    question: 'Which attack uses unsolicited contacts to persuade people to give up information?',
    options: ['DDoS', 'Social Engineering', 'SQL Injection', 'Buffer Overflow'],
    correct: 1,
    explanation: 'Social engineering manipulates people into breaking security procedures. It targets the human element rather than technology.',
  },
  {
    id: 8,
    question: 'What is the best way to protect against malware?',
    options: [
      'Never use the internet',
      'Use strong passwords only',
      'Keep software updated, use antivirus, and avoid suspicious downloads',
      'Use only Apple devices',
    ],
    correct: 2,
    explanation: 'Defense in depth: update software, use antivirus, avoid untrusted downloads, and stay alert to social engineering.',
  },
];

export default function AwarenessQuizLab() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZ_QUESTIONS.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[current];
  const selectedAnswer = answers[current];
  const isAnswered = selectedAnswer !== null;

  function selectAnswer(idx: number) {
    if (isAnswered) return;
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  }

  function nextQuestion() {
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
      const correct = answers.filter((a, i) => a === QUIZ_QUESTIONS[i].correct).length;
      if (correct >= 6) setCompleted(true);
    }
  }

  const score = answers.filter((a, i) => a === QUIZ_QUESTIONS[i].correct).length;

  if (showResult) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">{score >= 7 ? '🏆' : score >= 5 ? '👍' : '📚'}</div>
          <h3 className="text-xl font-bold text-white">Quiz Complete!</h3>
          <p className="text-lg text-gray-300 mt-2">
            Score: <span className={score >= 6 ? 'text-emerald-400' : 'text-yellow-400'}>{score}/{QUIZ_QUESTIONS.length}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{score >= 6 ? 'Great cybersecurity awareness!' : 'Review the explanations and try again.'}</p>
        </div>

        <div className="space-y-3">
          {QUIZ_QUESTIONS.map((q, i) => (
            <div key={q.id} className={`p-3 rounded-lg border text-xs ${answers[i] === q.correct ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <p className="font-medium text-gray-300 mb-1">{q.question}</p>
              <p className="text-gray-500">{q.explanation}</p>
            </div>
          ))}
        </div>

        {completed && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-400">Challenge Complete! +75 XP</p>
              <p className="text-xs text-gray-400">Your cybersecurity awareness is strong.</p>
            </div>
          </div>
        )}

        <button
          onClick={() => { setCurrent(0); setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null)); setShowResult(false); setCompleted(false); }}
          className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
        >
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          Answer at least <span className="text-white font-medium">6 out of 8</span> questions correctly to complete this challenge.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Question {current + 1} of {QUIZ_QUESTIONS.length}</span>
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div>
        <h3 className="text-base font-medium text-white mb-4">{question.question}</h3>
        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === question.correct;
            let style = 'border-gray-800 hover:border-gray-700 text-gray-300';
            if (isAnswered) {
              if (isCorrect) style = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
              else if (isSelected) style = 'border-red-500/40 bg-red-500/10 text-red-400';
            } else if (isSelected) {
              style = 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400';
            }
            return (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-auto text-red-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="bg-gray-900/30 border border-gray-800/40 rounded-lg p-3">
          <p className="text-xs text-gray-400">{question.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button
          onClick={nextQuestion}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {current < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}
