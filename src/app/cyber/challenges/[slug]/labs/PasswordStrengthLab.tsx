'use client';

import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Shield, Eye, EyeOff } from 'lucide-react';

function analyzePassword(pw: string) {
  let score = 0;
  const checks = {
    length8: pw.length >= 8,
    length12: pw.length >= 12,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    numbers: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
    noCommon: !['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome', 'monkey', 'dragon'].some(
      (w) => pw.toLowerCase().includes(w)
    ),
    noRepeats: !/(.)\1{2,}/.test(pw),
  };
  if (checks.length8) score += 10;
  if (checks.length12) score += 15;
  if (checks.uppercase) score += 15;
  if (checks.lowercase) score += 10;
  if (checks.numbers) score += 15;
  if (checks.special) score += 20;
  if (checks.noCommon) score += 10;
  if (checks.noRepeats) score += 5;

  const entropy = pw.length * Math.log2(
    (checks.lowercase ? 26 : 0) + (checks.uppercase ? 26 : 0) +
    (checks.numbers ? 10 : 0) + (checks.special ? 32 : 0) || 1
  );

  let crackTime = '';
  if (entropy < 28) crackTime = 'Instantly';
  else if (entropy < 36) crackTime = 'A few minutes';
  else if (entropy < 60) crackTime = 'Hours to days';
  else if (entropy < 80) crackTime = 'Years';
  else crackTime = 'Centuries+';

  let strength: 'weak' | 'fair' | 'good' | 'strong' | 'excellent' = 'weak';
  if (score >= 85) strength = 'excellent';
  else if (score >= 65) strength = 'strong';
  else if (score >= 45) strength = 'good';
  else if (score >= 25) strength = 'fair';

  return { score, checks, strength, entropy: Math.round(entropy), crackTime };
}

export default function PasswordStrengthLab() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [, setTested] = useState(0);

  const result = password ? analyzePassword(password) : null;

  const strengthColors = {
    weak: 'bg-red-500', fair: 'bg-orange-500', good: 'bg-yellow-500',
    strong: 'bg-emerald-500', excellent: 'bg-cyan-400',
  };

  const checkLabels: Record<string, string> = {
    length8: 'At least 8 characters',
    length12: 'At least 12 characters (bonus)',
    uppercase: 'Contains uppercase letter',
    lowercase: 'Contains lowercase letter',
    numbers: 'Contains number',
    special: 'Contains special character (!@#$...)',
    noCommon: 'No common words (password, admin…)',
    noRepeats: 'No excessive repeating characters',
  };

  const handleTest = useCallback(() => {
    setTested((prev) => prev + 1);
    if (result && result.strength === 'excellent') setCompleted(true);
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          Create a password that scores <span className="text-white font-medium">&quot;Excellent&quot;</span>.
          Analyze how each factor affects strength and estimated crack time.
        </p>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Enter a password to analyze:</label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a password…"
            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-sm text-emerald-400 font-mono placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
          />
          <button
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {result && (
        <>
          {/* Strength Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Strength:</span>
              <span className={`text-xs font-bold font-mono capitalize ${
                result.strength === 'excellent' ? 'text-cyan-400' :
                result.strength === 'strong' ? 'text-emerald-400' :
                result.strength === 'good' ? 'text-yellow-400' :
                result.strength === 'fair' ? 'text-orange-400' : 'text-red-400'
              }`}>{result.strength}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthColors[result.strength]} rounded-full transition-all duration-500`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/30 border border-gray-800 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-white font-mono">{result.score}%</p>
              <p className="text-[10px] text-gray-500">Score</p>
            </div>
            <div className="bg-black/30 border border-gray-800 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-white font-mono">{result.entropy}</p>
              <p className="text-[10px] text-gray-500">Entropy (bits)</p>
            </div>
            <div className="bg-black/30 border border-gray-800 rounded-lg p-3 text-center">
              <p className="text-sm font-bold text-white font-mono">{result.crackTime}</p>
              <p className="text-[10px] text-gray-500">Crack Time</p>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-400 mb-1">Password Criteria:</h4>
            {Object.entries(result.checks).map(([key, passed]) => (
              <div key={key} className="flex items-center gap-2">
                {passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400/60" />
                )}
                <span className={`text-xs ${passed ? 'text-gray-300' : 'text-gray-500'}`}>
                  {checkLabels[key]}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleTest}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Submit Analysis
          </button>
        </>
      )}

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Challenge Complete! +100 XP</p>
            <p className="text-xs text-gray-400">You created a password with excellent strength.</p>
          </div>
        </div>
      )}
    </div>
  );
}
