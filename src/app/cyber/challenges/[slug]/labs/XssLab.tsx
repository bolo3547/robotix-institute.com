'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const MOCK_COMMENTS = [
  { id: 1, user: 'alice', text: 'Great article on network security!', time: '2 min ago' },
  { id: 2, user: 'bob', text: 'Does anyone know a good firewall tool?', time: '5 min ago' },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const XSS_FLAGS: Record<string, string> = {
  'alert': 'FLAG{xss_alert_triggered}',
  'script': 'FLAG{xss_script_injected}',
  'onerror': 'FLAG{xss_event_handler}',
  'img': 'FLAG{xss_img_tag_payload}',
};

export default function XssLab() {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'vulnerable' | 'safe'>('vulnerable');
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [showSource, setShowSource] = useState(false);
  const nextId = comments.length + 1;

  function postComment() {
    if (!input.trim()) return;
    setComments((prev) => [...prev, { id: nextId, user: 'you', text: input, time: 'just now' }]);

    // Check for XSS payloads
    const lower = input.toLowerCase();
    Object.entries(XSS_FLAGS).forEach(([keyword, flag]) => {
      if (lower.includes(keyword)) setFlags((prev) => new Set(prev).add(flag));
    });

    setInput('');
  }

  const [fixAnswer, setFixAnswer] = useState('');
  const completed = flags.size >= 2 && flags.has('fix');

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          <span className="text-white">Flag 1:</span> Inject at least 2 different XSS payloads in Vulnerable Mode.<br />
          <span className="text-white">Flag 2:</span> Answer the prevention question below.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('vulnerable')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
            mode === 'vulnerable' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-gray-800 text-gray-500 hover:text-gray-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Vulnerable Mode
        </button>
        <button
          onClick={() => setMode('safe')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
            mode === 'safe' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-gray-800 text-gray-500 hover:text-gray-300'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Safe Mode (Escaped)
        </button>
      </div>

      {/* Comment Feed */}
      <div className="bg-black/30 border border-gray-800 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <span className="text-xs font-semibold text-gray-400 font-mono">💬 Comment Feed — Cyber Blog</span>
          <button onClick={() => setShowSource(!showSource)} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300">
            {showSource ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showSource ? 'Hide Source' : 'View Source'}
          </button>
        </div>

        <div className="divide-y divide-gray-800/50 max-h-64 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-cyan-400 font-mono">{c.user}</span>
                <span className="text-[10px] text-gray-600">{c.time}</span>
              </div>
              {showSource ? (
                <pre className="text-[11px] text-yellow-400/70 font-mono bg-black/40 p-2 rounded overflow-x-auto">{c.text}</pre>
              ) : mode === 'vulnerable' ? (
                <div className="text-xs text-gray-300" dangerouslySetInnerHTML={{ __html: c.text }} />
              ) : (
                <p className="text-xs text-gray-300">{escapeHtml(c.text)}</p>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 pt-2 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'vulnerable' ? 'Try: <script>alert("XSS")</script>' : 'HTML will be escaped…'}
              className="flex-1 px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-emerald-400 font-mono placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
              onKeyDown={(e) => e.key === 'Enter' && postComment()}
            />
            <button onClick={postComment} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded transition-colors">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Flags Found */}
      {flags.size > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-mono">Flags found ({flags.size - (flags.has('fix') ? 1 : 0)}/2):</p>
          {[...flags].filter((f) => f !== 'fix').map((f) => (
            <div key={f} className="text-xs font-mono text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded border border-yellow-500/20">
              🚩 {f}
            </div>
          ))}
        </div>
      )}

      {/* Hints */}
      <div className="bg-gray-900/30 border border-gray-800/40 rounded-lg p-4 space-y-2 text-xs text-gray-400">
        <p className="text-white font-medium">💡 Common XSS Payloads:</p>
        <code className="block text-cyan-400 font-mono text-[11px]">{'<script>alert("XSS")</script>'}</code>
        <code className="block text-cyan-400 font-mono text-[11px]">{'<img src=x onerror=alert(1)>'}</code>
        <code className="block text-cyan-400 font-mono text-[11px]">{'<b onmouseover=alert(1)>hover me</b>'}</code>
        <p className="mt-2">XSS occurs when user input is rendered as HTML without sanitization. Toggle to Safe Mode to see the difference.</p>
      </div>

      {/* Prevention Q */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold text-yellow-400 font-mono">🚩 Flag 3: Prevention Knowledge</h4>
        <p className="text-xs text-gray-400">Name a key defense against XSS attacks:</p>
        <input
          type="text"
          value={fixAnswer}
          onChange={(e) => setFixAnswer(e.target.value)}
          placeholder="Enter your answer…"
          className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-gray-200 font-mono focus:outline-none focus:border-yellow-500/50"
        />
        <button
          onClick={() => {
            const a = fixAnswer.toLowerCase();
            if (a.includes('escap') || a.includes('sanitiz') || a.includes('encod') || a.includes('csp') || a.includes('content security'))
              setFlags((prev) => new Set(prev).add('fix'));
          }}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded transition-colors"
        >
          Submit
        </button>
        {flags.has('fix') && <p className="text-xs text-emerald-400">✓ Correct! Output encoding/escaping, CSP headers, and input sanitization are key defenses.</p>}
      </div>

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Challenge Complete! +200 XP</p>
            <p className="text-xs text-gray-400">You exploited and mitigated a Cross-Site Scripting vulnerability.</p>
          </div>
        </div>
      )}
    </div>
  );
}
