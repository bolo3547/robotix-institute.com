'use client';

import { useState } from 'react';
import { Shield, Hash, Zap, Eye } from 'lucide-react';

// Simple hash implementations for educational purposes
function simpleHash(str: string, algo: string): string {
  let hash = 0;
  const seed = algo === 'md5' ? 31 : algo === 'sha1' ? 37 : 53;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char * seed) | 0;
  }

  const repeat = algo === 'md5' ? 4 : algo === 'sha1' ? 5 : 8;
  let result = '';
  for (let i = 0; i < repeat; i++) {
    const variant = Math.abs(hash * (i + 1) * seed).toString(16).padStart(8, '0');
    result += variant;
  }
  return result.slice(0, algo === 'md5' ? 32 : algo === 'sha1' ? 40 : 64);
}

// Rainbow table for common passwords
const RAINBOW_TABLE: Record<string, Record<string, string>> = {};

['password', '123456', 'admin', 'letmein', 'qwerty', 'abc123', 'monkey', 'dragon'].forEach((pw) => {
  RAINBOW_TABLE[pw] = {
    md5: simpleHash(pw, 'md5'),
    sha1: simpleHash(pw, 'sha1'),
    sha256: simpleHash(pw, 'sha256'),
  };
});

export default function HashAnalysisLab() {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState<'md5' | 'sha1' | 'sha256'>('sha256');
  const [output, setOutput] = useState('');
  const [salt, setSalt] = useState('');

  // Rainbow attack section
  const [hashTocrack, setHashToCrack] = useState('');
  const [crackedResult, setCrackedResult] = useState<string | null>(null);

  // Progress
  const [flags, setFlags] = useState<Set<string>>(new Set());

  function generateHash() {
    if (!input) return;
    const prefix = salt ? simpleHash(salt + input, algo) : simpleHash(input, algo);
    setOutput(prefix);
    if (!salt && RAINBOW_TABLE[input]?.[algo]) {
      setFlags((prev) => new Set(prev).add('hash-generated'));
    } else if (salt) {
      setFlags((prev) => new Set(prev).add('salt-used'));
    }
  }

  function attemptCrack() {
    const target = hashTocrack.trim().toLowerCase();
    let found: string | null = null;

    for (const [pw, hashes] of Object.entries(RAINBOW_TABLE)) {
      for (const [, h] of Object.entries(hashes)) {
        if (h === target) {
          found = pw;
          break;
        }
      }
      if (found) break;
    }

    setCrackedResult(found);
    if (found) setFlags((prev) => new Set(prev).add('rainbow-crack'));
  }

  const completed = flags.has('rainbow-crack') && flags.has('salt-used');

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          <span className="text-white">Task 1:</span> Generate hashes and crack one using the rainbow table.<br />
          <span className="text-white">Task 2:</span> Add a salt to a hash to see why salting prevents rainbow attacks.
        </p>
      </div>

      {/* Hash Generator */}
      <div className="bg-black/30 border border-gray-800 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-semibold text-gray-200 font-mono">Hash Generator</h4>
        </div>

        <div className="flex gap-2">
          {(['md5', 'sha1', 'sha256'] as const).map((a) => (
            <button
              key={a}
              onClick={() => { setAlgo(a); setOutput(''); }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium border transition-all ${
                algo === a ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'border-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              {a.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-gray-500 mb-1 block">Input Text</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash…"
              className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-emerald-400 font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 mb-1 block">Salt (optional)</label>
            <input
              type="text"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              placeholder="Add a salt…"
              className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-purple-400 font-mono placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        <button onClick={generateHash} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Generate Hash
        </button>

        {output && (
          <div className="bg-black/50 border border-gray-800 rounded p-3">
            <p className="text-[10px] text-gray-500 mb-1">{algo.toUpperCase()} {salt ? `(salted: "${salt}")` : '(unsalted)'}:</p>
            <code className="text-xs text-yellow-400 font-mono break-all">{output}</code>
            <div className="mt-2 text-[10px] text-gray-600">
              Length: {output.length} characters ({output.length * 4} bits)
            </div>
          </div>
        )}
      </div>

      {/* Rainbow Table */}
      <div className="bg-black/30 border border-gray-800 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-red-400" />
          <h4 className="text-sm font-semibold text-gray-200 font-mono">Rainbow Table Attack</h4>
        </div>

        <p className="text-xs text-gray-400">
          Below is a pre-computed rainbow table of common passwords. Try hashing one of the common passwords above (unsalted), then paste the hash here to crack it.
        </p>

        <div className="overflow-x-auto max-h-32 overflow-y-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-1.5 text-gray-500 font-mono">Password</th>
                <th className="text-left py-1.5 text-gray-500 font-mono">MD5</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(RAINBOW_TABLE).map(([pw, hashes]) => (
                <tr key={pw} className="border-b border-gray-800/30">
                  <td className="py-1.5 text-gray-300 font-mono">{pw}</td>
                  <td className="py-1.5 text-gray-500 font-mono truncate max-w-[200px]">{hashes.md5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={hashTocrack}
            onChange={(e) => setHashToCrack(e.target.value)}
            placeholder="Paste a hash to crack…"
            className="flex-1 px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-red-400 font-mono placeholder-gray-600 focus:outline-none focus:border-red-500/50"
          />
          <button onClick={attemptCrack} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors">
            Crack
          </button>
        </div>

        {crackedResult !== null && (
          <div className={`p-3 rounded border text-xs font-mono ${
            crackedResult ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-gray-800/50 border-gray-700 text-gray-400'
          }`}>
            {crackedResult
              ? `🚩 Cracked! Password: "${crackedResult}" — FLAG{rainbow_t4ble_att4ck}`
              : 'Hash not found in rainbow table. It may be salted or not a common password.'}
          </div>
        )}
      </div>

      {/* Educational Info */}
      <div className="bg-gray-900/30 border border-gray-800/40 rounded-lg p-4 space-y-3 text-xs text-gray-400">
        <p className="text-white font-medium">💡 Key Concepts:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><span className="text-cyan-400">Hash Function</span>: One-way function that maps data to a fixed-size output.</li>
          <li><span className="text-red-400">Rainbow Table</span>: Pre-computed lookup of password→hash pairs for cracking.</li>
          <li><span className="text-purple-400">Salt</span>: Random data added before hashing — makes rainbow tables useless.</li>
          <li><span className="text-yellow-400">bcrypt/scrypt</span>: Modern password hashing algorithms with built-in salting and cost factors.</li>
        </ul>
      </div>

      {/* Flags */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500 font-mono">Progress:</p>
        <div className="flex flex-wrap gap-2">
          <span className={`text-[10px] px-2 py-1 rounded font-mono ${flags.has('rainbow-crack') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800/50 text-gray-600 border border-gray-800'}`}>
            {flags.has('rainbow-crack') ? '✓' : '○'} Rainbow Crack
          </span>
          <span className={`text-[10px] px-2 py-1 rounded font-mono ${flags.has('salt-used') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800/50 text-gray-600 border border-gray-800'}`}>
            {flags.has('salt-used') ? '✓' : '○'} Salt Used
          </span>
        </div>
      </div>

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Challenge Complete! +200 XP</p>
            <p className="text-xs text-gray-400">You understand hashing, rainbow tables, and the importance of salting.</p>
          </div>
        </div>
      )}
    </div>
  );
}
