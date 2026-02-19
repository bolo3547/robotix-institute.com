'use client';

import React, { useState } from 'react';
import { Shield, Flag, Terminal, ChevronRight, Lock, Eye, Search } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  description: string;
  hint: string;
  type: 'decode' | 'inspect' | 'command' | 'crypto';
  flag: string;
  validator: (input: string) => boolean;
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Stage 1: Hidden in Plain Sight',
    description: 'The first flag is encoded in Base64. Decode the following string:',
    hint: 'Use a Base64 decoder. The alphabet is A-Z, a-z, 0-9, +, /',
    type: 'decode',
    flag: 'RkxBR3tiYXNlNjRfZDNjMGQzZH0=', // FLAG{base64_d3c0d3d}
    validator: (input) => input.trim().toLowerCase() === 'flag{base64_d3c0d3d}',
  },
  {
    id: 2,
    title: 'Stage 2: Inspect the Source',
    description: 'Sometimes secrets hide in HTML comments. Look at the page source below:',
    hint: 'Check between <!-- and --> tags',
    type: 'inspect',
    flag: '',
    validator: (input) => input.trim().toLowerCase() === 'flag{s0urc3_c0de_r3v34l}',
  },
  {
    id: 3,
    title: 'Stage 3: Command Challenge',
    description: 'You have a simulated terminal. Find the flag hidden in the filesystem.',
    hint: 'Try: ls, then cat the suspicious file',
    type: 'command',
    flag: '',
    validator: (input) => input.trim().toLowerCase() === 'flag{t3rm1nal_m4st3r}',
  },
  {
    id: 4,
    title: 'Stage 4: Caesar Strikes Back',
    description: 'Decrypt this Caesar cipher (shift=7): MSHN{jyfwav_punsslu}',
    hint: 'Shift each letter back by 7 positions in the alphabet',
    type: 'crypto',
    flag: 'MSHN{jyfwav_punsslu}',
    validator: (input) => input.trim().toLowerCase() === 'flag{crypto_install}' || input.trim().toLowerCase() === 'flag{crypto_ch4ll3n}',
  },
  {
    id: 5,
    title: 'Stage 5: The Final Gate',
    description: 'Combine the first letter of each previous flag (excluding FLAG{}) to form a keyword, then wrap it in FLAG{}.',
    hint: 'b + s + t + c = ?',
    type: 'decode',
    flag: '',
    validator: (input) => input.trim().toLowerCase() === 'flag{bstc}',
  },
];

// Simulated filesystem for terminal stage
const FILESYSTEM: Record<string, string> = {
  'ls': 'README.txt  .hidden_dir  notes.txt  server.log',
  'cat README.txt': 'Welcome to the CTF challenge server. Nothing to see here.',
  'cat notes.txt': 'TODO: Delete secret files before audit',
  'cat server.log': '[INFO] Server started\n[WARN] Unauthorized access attempt\n[INFO] All systems normal',
  'ls .hidden_dir': 'flag.txt  decoy.txt',
  'ls -la': 'total 4\ndrwxr-xr-x  README.txt\ndrwxr-xr-x  .hidden_dir\n-rw-r--r--  notes.txt\n-rw-r--r--  server.log',
  'cat .hidden_dir/flag.txt': '🚩 FLAG{t3rm1nal_m4st3r}',
  'cat .hidden_dir/decoy.txt': 'Nice try! This is not the flag.',
  'pwd': '/home/ctf/challenge',
  'whoami': 'ctf-player',
  'help': 'Available commands: ls, cat, pwd, whoami, help',
};

function base64Decode(str: string): string {
  try { return atob(str); } catch { return '[Invalid Base64]'; }
}

export default function CtfLab() {
  const [currentStage, setCurrentStage] = useState(0);
  const [flagInput, setFlagInput] = useState('');
  const [solvedStages, setSolvedStages] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [termCmd, setTermCmd] = useState('');
  const [decodedB64, setDecodedB64] = useState('');
  const [error, setError] = useState('');

  const stage = STAGES[currentStage];
  const completed = solvedStages.size === STAGES.length;

  function submitFlag() {
    if (stage.validator(flagInput)) {
      setSolvedStages((prev) => new Set(prev).add(stage.id));
      setFlagInput('');
      setError('');
      setShowHint(false);
      if (currentStage < STAGES.length - 1) {
        setTimeout(() => setCurrentStage(currentStage + 1), 500);
      }
    } else {
      setError('Incorrect flag. Try again.');
    }
  }

  function runTerminalCmd() {
    if (!termCmd.trim()) return;
    const output = FILESYSTEM[termCmd.trim()] || `bash: ${termCmd}: command not found or no such file`;
    setTerminalHistory((prev) => [...prev, { cmd: termCmd, output }]);
    setTermCmd('');
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 CTF — Capture The Flag</h3>
        <p className="text-xs text-gray-400">
          Complete 5 stages to capture all flags. Each stage requires a different cybersecurity skill.
        </p>
      </div>

      {/* Stage Progress */}
      <div className="flex gap-1">
        {STAGES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setCurrentStage(i); setShowHint(false); setError(''); }}
            className={`flex-1 h-2 rounded-full transition-all ${
              solvedStages.has(s.id) ? 'bg-emerald-500' : i === currentStage ? 'bg-cyan-500' : 'bg-gray-800'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>Stage {currentStage + 1} of {STAGES.length}</span>
        <span>{solvedStages.size}/{STAGES.length} solved</span>
      </div>

      {/* Current Stage */}
      <div className="bg-black/40 border border-gray-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          {solvedStages.has(stage.id) ? (
            <Flag className="w-4 h-4 text-emerald-400" />
          ) : (
            <Lock className="w-4 h-4 text-cyan-400" />
          )}
          <h4 className="text-sm font-semibold text-gray-200 font-mono">{stage.title}</h4>
          {solvedStages.has(stage.id) && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">SOLVED</span>}
        </div>

        <p className="text-xs text-gray-400 mb-4">{stage.description}</p>

        {/* Stage-specific content */}
        {stage.type === 'decode' && stage.id === 1 && (
          <div className="space-y-3">
            <div className="bg-black/50 border border-gray-700 rounded p-3">
              <code className="text-sm text-yellow-400 font-mono break-all">{stage.flag}</code>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDecodedB64(base64Decode(stage.flag))}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors flex items-center gap-1"
              >
                <Search className="w-3 h-3" /> Decode Base64
              </button>
              {decodedB64 && <span className="text-xs text-emerald-400 font-mono self-center">{decodedB64}</span>}
            </div>
          </div>
        )}

        {stage.type === 'inspect' && (
          <div className="bg-black/60 border border-gray-700 rounded p-3 font-mono text-[11px] text-gray-500 overflow-x-auto">
            <pre>{`<html>
  <head><title>Cyber Corp Portal</title></head>
  <body>
    <h1>Welcome to Cyber Corp</h1>
    <p>Nothing suspicious here.</p>
    <!-- TODO: Remove before production -->
    <!-- FLAG{s0urc3_c0de_r3v34l} -->
    <footer>&copy; 2024 Cyber Corp</footer>
  </body>
</html>`}</pre>
          </div>
        )}

        {stage.type === 'command' && (
          <div className="bg-black border border-gray-700 rounded overflow-hidden">
            <div className="p-2 border-b border-gray-800 flex items-center gap-2">
              <Terminal className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] text-gray-500 font-mono">Terminal — /home/ctf/challenge</span>
            </div>
            <div className="p-3 max-h-40 overflow-y-auto space-y-1">
              {terminalHistory.map((h, i) => (
                <div key={i}>
                  <div className="text-xs font-mono"><span className="text-emerald-400">ctf@lab:~$</span> <span className="text-gray-300">{h.cmd}</span></div>
                  <pre className="text-[11px] text-gray-500 font-mono whitespace-pre-wrap">{h.output}</pre>
                </div>
              ))}
            </div>
            <div className="flex border-t border-gray-800">
              <span className="text-xs text-emerald-400 font-mono px-3 py-2">$</span>
              <input
                type="text"
                value={termCmd}
                onChange={(e) => setTermCmd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runTerminalCmd()}
                className="flex-1 bg-transparent text-xs text-gray-200 font-mono py-2 focus:outline-none"
                placeholder="Type a command…"
              />
            </div>
          </div>
        )}

        {stage.type === 'crypto' && (
          <div className="bg-black/50 border border-gray-700 rounded p-3">
            <code className="text-sm text-yellow-400 font-mono">{stage.flag}</code>
            <p className="text-[10px] text-gray-500 mt-2">Shift: 7 | A→T, B→U, … F→Y, L→E, etc.</p>
          </div>
        )}

        {stage.type === 'decode' && stage.id === 5 && (
          <div className="bg-black/50 border border-gray-700 rounded p-3 text-xs text-gray-400">
            <p>Previous flags started with:</p>
            <ul className="mt-1 space-y-0.5 text-cyan-400 font-mono">
              <li>Stage 1: b (from base64…)</li>
              <li>Stage 2: s (from s0urc3…)</li>
              <li>Stage 3: t (from t3rm1nal…)</li>
              <li>Stage 4: c (from crypto…)</li>
            </ul>
          </div>
        )}

        {/* Hint */}
        <div className="mt-4">
          <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300">
            <Eye className="w-3 h-3" /> {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && <p className="text-[11px] text-yellow-400/60 mt-1 pl-4">💡 {stage.hint}</p>}
        </div>

        {/* Flag Input */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={flagInput}
            onChange={(e) => { setFlagInput(e.target.value); setError(''); }}
            placeholder="FLAG{...}"
            className="flex-1 px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-emerald-400 font-mono placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
            onKeyDown={(e) => e.key === 'Enter' && submitFlag()}
          />
          <button onClick={submitFlag} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5" /> Submit
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">CTF Complete! +300 XP</p>
            <p className="text-xs text-gray-400">All 5 flags captured. You completed a multi-stage CTF challenge!</p>
          </div>
        </div>
      )}
    </div>
  );
}
