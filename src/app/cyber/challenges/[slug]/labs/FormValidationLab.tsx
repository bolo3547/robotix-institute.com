'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ValidationRule {
  id: string;
  label: string;
  description: string;
  test: (value: string) => boolean;
  enabled: boolean;
}

interface FormField {
  name: string;
  label: string;
  type: string;
  value: string;
  rules: ValidationRule[];
  errors: string[];
}

const createRules = (field: string): ValidationRule[] => {
  switch (field) {
    case 'username':
      return [
        { id: 'req', label: 'Required', description: 'Field must not be empty', test: (v) => v.trim().length > 0, enabled: false },
        { id: 'len', label: 'Min Length', description: 'Minimum 3 characters', test: (v) => v.length >= 3, enabled: false },
        { id: 'alpha', label: 'Alphanumeric', description: 'Only letters, numbers, underscores', test: (v) => /^[a-zA-Z0-9_]+$/.test(v), enabled: false },
        { id: 'noscript', label: 'No HTML/Script', description: 'Block <script>, <img>, etc.', test: (v) => !/<[^>]*>/i.test(v), enabled: false },
      ];
    case 'email':
      return [
        { id: 'req', label: 'Required', description: 'Field must not be empty', test: (v) => v.trim().length > 0, enabled: false },
        { id: 'format', label: 'Email Format', description: 'Must be valid email format', test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), enabled: false },
        { id: 'noscript', label: 'No HTML/Script', description: 'Block injection attempts', test: (v) => !/<[^>]*>/i.test(v), enabled: false },
      ];
    case 'password':
      return [
        { id: 'req', label: 'Required', description: 'Field must not be empty', test: (v) => v.trim().length > 0, enabled: false },
        { id: 'len', label: 'Min Length 8', description: 'At least 8 characters', test: (v) => v.length >= 8, enabled: false },
        { id: 'upper', label: 'Uppercase', description: 'At least one uppercase letter', test: (v) => /[A-Z]/.test(v), enabled: false },
        { id: 'special', label: 'Special Char', description: 'At least one special character', test: (v) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v), enabled: false },
      ];
    case 'age':
      return [
        { id: 'req', label: 'Required', description: 'Field must not be empty', test: (v) => v.trim().length > 0, enabled: false },
        { id: 'number', label: 'Numeric', description: 'Must be a number', test: (v) => /^\d+$/.test(v), enabled: false },
        { id: 'range', label: 'Range 13-120', description: 'Must be between 13 and 120', test: (v) => { const n = parseInt(v); return n >= 13 && n <= 120; }, enabled: false },
      ];
    default:
      return [];
  }
};

export default function FormValidationLab() {
  const [fields, setFields] = useState<FormField[]>([
    { name: 'username', label: 'Username', type: 'text', value: '', rules: createRules('username'), errors: [] },
    { name: 'email', label: 'Email', type: 'email', value: '', rules: createRules('email'), errors: [] },
    { name: 'password', label: 'Password', type: 'password', value: '', rules: createRules('password'), errors: [] },
    { name: 'age', label: 'Age', type: 'text', value: '', rules: createRules('age'), errors: [] },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [attackResults, setAttackResults] = useState<{ input: string; field: string; blocked: boolean }[]>([]);
  const [phase, setPhase] = useState<'build' | 'test'>('build');
  const [completed, setCompleted] = useState(false);

  const totalRules = fields.reduce((sum, f) => sum + f.rules.length, 0);
  const enabledRules = fields.reduce((sum, f) => sum + f.rules.filter((r) => r.enabled).length, 0);

  function toggleRule(fieldIdx: number, ruleId: string) {
    setFields((prev) => prev.map((f, i) => {
      if (i !== fieldIdx) return f;
      return { ...f, rules: f.rules.map((r) => r.id === ruleId ? { ...r, enabled: !r.enabled } : r) };
    }));
  }

  function updateFieldValue(fieldIdx: number, value: string) {
    setFields((prev) => prev.map((f, i) => i === fieldIdx ? { ...f, value } : f));
  }

  function validateForm(): boolean {
    let allValid = true;
    setFields((prev) => prev.map((f) => {
      const errors: string[] = [];
      f.rules.forEach((r) => {
        if (r.enabled && !r.test(f.value)) {
          errors.push(r.label);
          allValid = false;
        }
      });
      return { ...f, errors };
    }));
    return allValid;
  }

  function handleSubmit() {
    const valid = validateForm();
    setSubmitted(true);
    if (valid && enabledRules >= totalRules * 0.7) {
      // Good enough
    }
  }

  const ATTACKS = [
    { field: 'username', input: '<script>alert("XSS")</script>', label: 'XSS in username' },
    { field: 'email', input: 'not-an-email', label: 'Invalid email format' },
    { field: 'password', input: '123', label: 'Weak password' },
    { field: 'age', input: '-5', label: 'Negative age' },
    { field: 'username', input: '', label: 'Empty username' },
    { field: 'age', input: 'abc', label: 'Non-numeric age' },
  ];

  function runAttacks() {
    const results = ATTACKS.map((atk) => {
      const field = fields.find((f) => f.name === atk.field);
      if (!field) return { ...atk, blocked: false };
      const blocked = field.rules.some((r) => r.enabled && !r.test(atk.input));
      return { ...atk, blocked };
    });
    setAttackResults(results);

    const blockedCount = results.filter((r) => r.blocked).length;
    if (blockedCount >= 5) setCompleted(true);
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          <span className="text-white">Phase 1:</span> Enable validation rules to build a secure form.<br />
          <span className="text-white">Phase 2:</span> Test your form against common attack inputs. Block at least 5/6 attacks.
        </p>
      </div>

      {/* Phase Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setPhase('build')}
          className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
            phase === 'build' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'border-gray-800 text-gray-500'
          }`}
        >
          Phase 1: Build Validation
        </button>
        <button
          onClick={() => setPhase('test')}
          className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
            phase === 'test' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-gray-800 text-gray-500'
          }`}
        >
          Phase 2: Test Attacks
        </button>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>Rules enabled: {enabledRules}/{totalRules}</span>
          <span>{Math.round((enabledRules / totalRules) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all" style={{ width: `${(enabledRules / totalRules) * 100}%` }} />
        </div>
      </div>

      {phase === 'build' && (
        <div className="space-y-4">
          {fields.map((field, fIdx) => (
            <div key={field.name} className="bg-black/30 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-200 font-mono">{field.label}</span>
                <span className="text-[10px] text-gray-500">{field.rules.filter((r) => r.enabled).length}/{field.rules.length} rules active</span>
              </div>

              {/* Rules */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {field.rules.map((rule) => (
                  <button
                    key={rule.id}
                    onClick={() => toggleRule(fIdx, rule.id)}
                    className={`text-left p-2 rounded border text-[11px] transition-all ${
                      rule.enabled
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-gray-900/30 border-gray-800 text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <span className="font-medium">{rule.enabled ? '✓' : '○'} {rule.label}</span>
                    <br />
                    <span className="text-[10px] opacity-70">{rule.description}</span>
                  </button>
                ))}
              </div>

              {/* Test Input */}
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => updateFieldValue(fIdx, e.target.value)}
                placeholder={`Test ${field.label.toLowerCase()}…`}
                className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-sm text-emerald-400 font-mono placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
              />
              {submitted && field.errors.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {field.errors.map((e) => (
                    <span key={e} className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
                      ✗ {e}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded transition-colors">
            Test Submit
          </button>
        </div>
      )}

      {phase === 'test' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Click below to test your validation rules against common attack inputs:</p>

          <button onClick={runAttacks} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Run Attack Suite
          </button>

          {attackResults.length > 0 && (
            <div className="space-y-2">
              {attackResults.map((r, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded border text-xs ${
                  r.blocked ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
                }`}>
                  <div className="flex items-center gap-2">
                    {r.blocked ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className="text-gray-300">{r.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] text-gray-500 font-mono">{r.input || '(empty)'}</code>
                    <span className={`text-[10px] font-medium ${r.blocked ? 'text-emerald-400' : 'text-red-400'}`}>
                      {r.blocked ? 'BLOCKED' : 'PASSED THROUGH'}
                    </span>
                  </div>
                </div>
              ))}
              <div className="text-xs text-gray-400 mt-2">
                Blocked: {attackResults.filter((r) => r.blocked).length}/{attackResults.length}
                {attackResults.filter((r) => r.blocked).length < 5 && ' — Enable more rules to block at least 5 attacks.'}
              </div>
            </div>
          )}
        </div>
      )}

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Challenge Complete! +200 XP</p>
            <p className="text-xs text-gray-400">You built a secure form with proper input validation.</p>
          </div>
        </div>
      )}
    </div>
  );
}
