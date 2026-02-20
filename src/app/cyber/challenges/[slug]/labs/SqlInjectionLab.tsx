'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, Play } from 'lucide-react';

// Simulated "database"
const MOCK_DB = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', password_hash: '$2b$10$...(hidden)' },
  { id: 2, username: 'alice', email: 'alice@example.com', role: 'user', password_hash: '$2b$10$...(hidden)' },
  { id: 3, username: 'bob', email: 'bob@example.com', role: 'user', password_hash: '$2b$10$...(hidden)' },
  { id: 4, username: 'flag_user', email: 'FLAG{sql_inj3ction_m4ster}', role: 'hidden', password_hash: '$2b$10$...(hidden)' },
];

function simulateQuery(input: string): { query: string; results: typeof MOCK_DB; vulnerable: boolean; flagFound: boolean } {
  const sanitizedInput = input.trim();
  const query = `SELECT * FROM users WHERE username = '${sanitizedInput}'`;

  // Check for SQL injection patterns
  const injectionPatterns = [
    /'\s*or\s+.*=.*/i,
    /'\s*or\s+1\s*=\s*1/i,
    /'\s*;\s*select/i,
    /'\s*union\s+select/i,
    /'\s*--/i,
    /'\s*or\s+'.*'\s*=\s*'/i,
  ];

  const isInjection = injectionPatterns.some((p) => p.test(sanitizedInput));

  if (isInjection) {
    // Simulate vulnerable response — returns all rows
    return { query, results: MOCK_DB, vulnerable: true, flagFound: true };
  }

  // Normal query — exact match
  const results = MOCK_DB.filter((u) => u.username.toLowerCase() === sanitizedInput.toLowerCase());
  return { query, results, vulnerable: false, flagFound: false };
}

function simulateSafeQuery(input: string): { query: string; results: typeof MOCK_DB; safe: boolean } {
  const query = `SELECT * FROM users WHERE username = $1 -- parameterized`;
  // Parameterized query treats whole input as literal
  const results = MOCK_DB.filter((u) => u.username.toLowerCase() === input.trim().toLowerCase());
  return { query, results, safe: true };
}

export default function SqlInjectionLab() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'vulnerable' | 'safe'>('vulnerable');
  const [result, setResult] = useState<ReturnType<typeof simulateQuery> | null>(null);
  const [safeResult, setSafeResult] = useState<ReturnType<typeof simulateSafeQuery> | null>(null);
  const [flags, setFlags] = useState<Set<string>>(new Set());

  function runQuery() {
    if (mode === 'vulnerable') {
      const r = simulateQuery(input);
      setResult(r);
      setSafeResult(null);
      if (r.flagFound) setFlags((prev) => new Set(prev).add('sqli-dump'));
    } else {
      const r = simulateSafeQuery(input);
      setSafeResult(r);
      setResult(null);
    }
  }

  const [safeAnswer, setSafeAnswer] = useState('');
  const completed = flags.has('sqli-dump') && flags.has('sqli-fix');

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          <span className="text-white">Flag 1:</span> Use SQL injection on the vulnerable form to dump all user data.<br />
          <span className="text-white">Flag 2:</span> Answer how to prevent SQL injection (below).
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('vulnerable'); setResult(null); setSafeResult(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
            mode === 'vulnerable' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-gray-800 text-gray-500 hover:text-gray-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Vulnerable Mode
        </button>
        <button
          onClick={() => { setMode('safe'); setResult(null); setSafeResult(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
            mode === 'safe' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-gray-800 text-gray-500 hover:text-gray-300'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Safe Mode (Parameterized)
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Search by username:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'vulnerable' ? "Try: ' OR 1=1 --" : 'Enter a username…'}
            className="flex-1 px-4 py-2.5 bg-black/50 border border-gray-700 rounded-lg text-sm text-emerald-400 font-mono placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
            onKeyDown={(e) => e.key === 'Enter' && runQuery()}
          />
          <button onClick={runQuery} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5" /> Execute
          </button>
        </div>
      </div>

      {/* Generated SQL */}
      {(result || safeResult) && (
        <div className="bg-black/40 border border-gray-800 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 mb-1 font-mono">Generated SQL:</p>
          <code className="text-xs text-yellow-400 font-mono">{result?.query || safeResult?.query}</code>
        </div>
      )}

      {/* Vulnerable Results */}
      {result && (
        <div className={`border rounded-lg p-4 ${result.vulnerable ? 'border-red-500/30 bg-red-500/5' : 'border-gray-800'}`}>
          {result.vulnerable && (
            <div className="flex items-center gap-2 mb-3 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">⚠️ SQL Injection Detected! Dumping all rows…</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 text-gray-500 font-mono">id</th>
                  <th className="text-left py-2 text-gray-500 font-mono">username</th>
                  <th className="text-left py-2 text-gray-500 font-mono">email</th>
                  <th className="text-left py-2 text-gray-500 font-mono">role</th>
                </tr>
              </thead>
              <tbody>
                {result.results.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-gray-600 text-center">No results</td></tr>
                ) : result.results.map((r) => (
                  <tr key={r.id} className="border-b border-gray-800/40">
                    <td className="py-2 text-gray-400 font-mono">{r.id}</td>
                    <td className="py-2 text-gray-300 font-mono">{r.username}</td>
                    <td className={`py-2 font-mono ${r.email.includes('FLAG') ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>{r.email}</td>
                    <td className="py-2 text-gray-400 font-mono">{r.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.flagFound && (
            <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-400 font-mono">
              🚩 FLAG FOUND: FLAG&#123;sql_inj3ction_m4ster&#125;
            </div>
          )}
        </div>
      )}

      {/* Safe Results */}
      {safeResult && (
        <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3 text-emerald-400">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium">Parameterized query — input treated as literal value</span>
          </div>
          <p className="text-xs text-gray-400">
            Results: {safeResult.results.length > 0 ? safeResult.results.map((r) => r.username).join(', ') : 'No results (injection attempt neutralized)'}
          </p>
        </div>
      )}

      {/* Hints */}
      <div className="bg-gray-900/30 border border-gray-800/40 rounded-lg p-4 space-y-2 text-xs text-gray-400">
        <p className="text-white font-medium">💡 Common SQL Injection Payloads:</p>
        <code className="block text-cyan-400 font-mono text-[11px]">{`' OR 1=1 --`}</code>
        <code className="block text-cyan-400 font-mono text-[11px]">{`' OR '1'='1`}</code>
        <code className="block text-cyan-400 font-mono text-[11px]">{`' UNION SELECT * FROM users --`}</code>
        <p className="mt-2">The single quote ({"'"}) breaks out of the string context. The <code>OR 1=1</code> makes the WHERE clause always true.</p>
      </div>

      {/* Flag 2: Prevention */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold text-yellow-400 font-mono">🚩 Flag 2: Prevention Knowledge</h4>
        <p className="text-xs text-gray-400">What is the primary defense against SQL injection?</p>
        <input
          type="text"
          value={safeAnswer}
          onChange={(e) => setSafeAnswer(e.target.value)}
          placeholder="Enter your answer…"
          className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-gray-200 font-mono focus:outline-none focus:border-yellow-500/50"
        />
        <button
          onClick={() => {
            const answer = safeAnswer.toLowerCase();
            if (answer.includes('parameterized') || answer.includes('prepared statement') || answer.includes('parameter'))
              setFlags((prev) => new Set(prev).add('sqli-fix'));
          }}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded transition-colors"
        >
          Submit
        </button>
        {flags.has('sqli-fix') && <p className="text-xs text-emerald-400">✓ Correct! Parameterized queries / prepared statements are the primary defense.</p>}
      </div>

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Challenge Complete! +200 XP</p>
            <p className="text-xs text-gray-400">You exploited and patched a SQL injection vulnerability.</p>
          </div>
        </div>
      )}
    </div>
  );
}
