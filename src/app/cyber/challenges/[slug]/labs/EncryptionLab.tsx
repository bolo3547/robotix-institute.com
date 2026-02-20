'use client';

import { useState } from 'react';
import { Shield, ArrowRightLeft, Lock, Unlock } from 'lucide-react';

function caesarCipher(text: string, shift: number, decrypt = false): string {
  const s = decrypt ? (26 - shift) % 26 : shift % 26;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
  });
}

function rot13(text: string): string {
  return caesarCipher(text, 13);
}

function xorCipher(text: string, key: string): string {
  return Array.from(text)
    .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
    .join('');
}

function toHex(text: string): string {
  return Array.from(text).map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

export default function EncryptionLab() {
  const [method, setMethod] = useState<'caesar' | 'rot13' | 'xor'>('caesar');
  const [input, setInput] = useState('');
  const [shift, setShift] = useState(3);
  const [xorKey, setXorKey] = useState('key');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [completed, setCompleted] = useState(false);

  const secretMessage = 'PHOHU LV QR VKRUUFXW';
  const [decryptAnswer, setDecryptAnswer] = useState('');

  function getOutput(): string {
    if (!input) return '';
    if (method === 'caesar') return caesarCipher(input, shift, mode === 'decrypt');
    if (method === 'rot13') return rot13(input);
    return toHex(xorCipher(input, xorKey));
  }

  const output = getOutput();

  function checkAnswer() {
    if (decryptAnswer.trim().toLowerCase() === 'there is no shortcut') {
      setCompleted(true);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          Explore classical encryption methods. Then decrypt the hidden message at the bottom to complete the challenge.
        </p>
      </div>

      {/* Method Selector */}
      <div className="flex gap-2">
        {(['caesar', 'rot13', 'xor'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
              method === m
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-transparent border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            {m === 'caesar' ? 'Caesar Cipher' : m === 'rot13' ? 'ROT13' : 'XOR Cipher'}
          </button>
        ))}
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMode('encrypt')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs ${mode === 'encrypt' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-gray-500'}`}
        >
          <Lock className="w-3 h-3" /> Encrypt
        </button>
        <ArrowRightLeft className="w-3.5 h-3.5 text-gray-600" />
        <button
          onClick={() => setMode('decrypt')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs ${mode === 'decrypt' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'text-gray-500'}`}
        >
          <Unlock className="w-3 h-3" /> Decrypt
        </button>
      </div>

      {/* Controls */}
      {method === 'caesar' && (
        <div>
          <label className="text-xs text-gray-400">Shift: {shift}</label>
          <input
            type="range"
            min={1}
            max={25}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="w-full mt-1 accent-emerald-500"
          />
        </div>
      )}
      {method === 'xor' && (
        <div>
          <label className="text-xs text-gray-400">XOR Key:</label>
          <input
            type="text"
            value={xorKey}
            onChange={(e) => setXorKey(e.target.value || 'k')}
            className="mt-1 w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      )}

      {/* Input / Output */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Input:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-sm text-gray-200 font-mono focus:outline-none focus:border-emerald-500/50 resize-none"
            placeholder="Type your message…"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Output:</label>
          <div className="w-full px-3 py-2 bg-black/50 border border-gray-800 rounded-lg text-sm text-cyan-400 font-mono min-h-[96px] whitespace-pre-wrap break-all">
            {output || <span className="text-gray-600">Result will appear here…</span>}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-900/30 border border-gray-800/60 rounded-lg p-4 text-xs text-gray-400 space-y-2">
        {method === 'caesar' && (
          <>
            <p><span className="text-white">Caesar Cipher:</span> Each letter is shifted by a fixed number. With shift=3: A→D, B→E, etc.</p>
            <p>Used by Julius Caesar. Easily broken by frequency analysis or trying all 25 shifts (brute force).</p>
          </>
        )}
        {method === 'rot13' && (
          <>
            <p><span className="text-white">ROT13:</span> A special case of Caesar cipher with shift=13. Applying it twice returns the original text.</p>
            <p>Often used to hide spoilers online. Not security — just obfuscation!</p>
          </>
        )}
        {method === 'xor' && (
          <>
            <p><span className="text-white">XOR Cipher:</span> Each byte is XOR&apos;d with a repeating key. XOR is reversible: encrypt and decrypt use the same operation.</p>
            <p>Foundation of modern stream ciphers. Output shown in hex.</p>
          </>
        )}
      </div>

      {/* Flag Challenge */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold text-yellow-400 font-mono">🚩 Decode This</h4>
        <p className="text-xs text-gray-400">
          This message was encrypted with a Caesar cipher. Shift value = <span className="text-white font-mono">3</span>.
        </p>
        <code className="block text-sm text-cyan-400 font-mono bg-black/40 px-3 py-2 rounded">{secretMessage}</code>
        <input
          type="text"
          value={decryptAnswer}
          onChange={(e) => setDecryptAnswer(e.target.value)}
          placeholder="Enter the decrypted message…"
          className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-gray-200 font-mono focus:outline-none focus:border-yellow-500/50"
        />
        <button
          onClick={checkAnswer}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded transition-colors"
        >
          Submit Flag
        </button>
      </div>

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Challenge Complete! +100 XP</p>
            <p className="text-xs text-gray-400">You decrypted the hidden message correctly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
