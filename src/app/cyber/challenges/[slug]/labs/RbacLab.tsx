'use client';

import { useState } from 'react';
import { Shield, Users, Lock, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

type Permission = 'read' | 'write' | 'delete' | 'admin';
type Role = 'guest' | 'student' | 'teacher' | 'admin';

interface User {
  id: string;
  name: string;
  role: Role;
}

interface Resource {
  id: string;
  name: string;
  type: string;
  owner: string;
}

const USERS: User[] = [
  { id: 'u1', name: 'Visitor', role: 'guest' },
  { id: 'u2', name: 'Alice (Student)', role: 'student' },
  { id: 'u3', name: 'Mr. Banda (Teacher)', role: 'teacher' },
  { id: 'u4', name: 'Admin', role: 'admin' },
];

const RESOURCES: Resource[] = [
  { id: 'r1', name: 'Public Course', type: 'course', owner: 'u3' },
  { id: 'r2', name: 'Student Grade', type: 'grade', owner: 'u2' },
  { id: 'r3', name: 'System Config', type: 'config', owner: 'u4' },
  { id: 'r4', name: 'Assignment', type: 'assignment', owner: 'u3' },
];

const ROLE_COLORS: Record<Role, string> = {
  guest: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  student: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  teacher: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  admin: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const PERM_COLORS: Record<Permission, string> = {
  read: 'text-emerald-400',
  write: 'text-cyan-400',
  delete: 'text-orange-400',
  admin: 'text-red-400',
};

// Attack scenarios to test
interface AttackScenario {
  id: string;
  title: string;
  description: string;
  attacker: User;
  target: Resource;
  attemptedPermission: Permission;
  shouldBlock: boolean;
  hint: string;
}

const ATTACKS: AttackScenario[] = [
  {
    id: 'atk-1',
    title: 'Guest tries to write',
    description: 'A visitor attempts to modify a public course.',
    attacker: USERS[0],
    target: RESOURCES[0],
    attemptedPermission: 'write',
    shouldBlock: true,
    hint: 'Guests should only have read access.',
  },
  {
    id: 'atk-2',
    title: 'Student tries to delete',
    description: 'A student tries to delete an assignment.',
    attacker: USERS[1],
    target: RESOURCES[3],
    attemptedPermission: 'delete',
    shouldBlock: true,
    hint: 'Students can read and write, but not delete.',
  },
  {
    id: 'atk-3',
    title: 'Teacher reads course',
    description: 'A teacher reads their own course.',
    attacker: USERS[2],
    target: RESOURCES[0],
    attemptedPermission: 'read',
    shouldBlock: false,
    hint: 'Teachers have read/write/delete — this should be allowed.',
  },
  {
    id: 'atk-4',
    title: 'Student accesses admin config',
    description: 'A student tries to access system configuration.',
    attacker: USERS[1],
    target: RESOURCES[2],
    attemptedPermission: 'admin',
    shouldBlock: true,
    hint: 'Only admins should access system config.',
  },
  {
    id: 'atk-5',
    title: 'Teacher modifies grades',
    description: 'A teacher writes to a student grade record.',
    attacker: USERS[2],
    target: RESOURCES[1],
    attemptedPermission: 'write',
    shouldBlock: false,
    hint: 'Teachers have write permission.',
  },
  {
    id: 'atk-6',
    title: 'Privilege escalation',
    description: 'A student tries to grant themselves admin role.',
    attacker: USERS[1],
    target: RESOURCES[2],
    attemptedPermission: 'admin',
    shouldBlock: true,
    hint: 'Only admin can perform admin actions.',
  },
];

export default function RbacLab() {
  // Phase 1: Build RBAC rules
  const [customPermissions, setCustomPermissions] = useState<Record<Role, Set<Permission>>>({
    guest: new Set<Permission>(),
    student: new Set<Permission>(),
    teacher: new Set<Permission>(),
    admin: new Set<Permission>(),
  });

  // Phase 2: Test attacks
  const [phase, setPhase] = useState<'build' | 'test'>('build');
  const [testResults, setTestResults] = useState<{ scenarioId: string; result: boolean; correct: boolean }[]>([]);
  const [showReference, setShowReference] = useState(false);

  function togglePermission(role: Role, perm: Permission) {
    setCustomPermissions((prev) => {
      const next = { ...prev };
      const perms = new Set(prev[role]);
      perms.has(perm) ? perms.delete(perm) : perms.add(perm);
      next[role] = perms;
      return next;
    });
  }

  function checkAccess(userRole: Role, permission: Permission): boolean {
    return customPermissions[userRole].has(permission);
  }

  function runTests() {
    const results = ATTACKS.map((atk) => {
      const granted = checkAccess(atk.attacker.role, atk.attemptedPermission);
      const blocked = !granted;
      const correct = blocked === atk.shouldBlock;
      return { scenarioId: atk.id, result: granted, correct };
    });
    setTestResults(results);
  }

  const correctAnswers = testResults.filter((r) => r.correct).length;
  const completed = correctAnswers >= 5;

  // Auto-fill reference permissions
  function loadReference() {
    setCustomPermissions({
      guest: new Set<Permission>(['read']),
      student: new Set<Permission>(['read', 'write']),
      teacher: new Set<Permission>(['read', 'write', 'delete']),
      admin: new Set<Permission>(['read', 'write', 'delete', 'admin']),
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          <span className="text-white">Phase 1:</span> Design a Role-Based Access Control (RBAC) matrix.<br />
          <span className="text-white">Phase 2:</span> Test your rules against 6 attack scenarios. Block at least 5/6 correctly.
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
          <Settings className="w-3 h-3 inline mr-1" /> Phase 1: Build RBAC
        </button>
        <button
          onClick={() => setPhase('test')}
          className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
            phase === 'test' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-gray-800 text-gray-500'
          }`}
        >
          <AlertTriangle className="w-3 h-3 inline mr-1" /> Phase 2: Test Attacks
        </button>
      </div>

      {phase === 'build' && (
        <div className="space-y-4">
          {/* Reference */}
          <div className="flex items-center gap-3">
            <button onClick={() => setShowReference(!showReference)} className="text-[10px] text-gray-500 hover:text-gray-300 underline">
              {showReference ? 'Hide' : 'Show'} Principle of Least Privilege Reference
            </button>
            <button onClick={loadReference} className="text-[10px] text-cyan-500 hover:text-cyan-300 underline">
              Auto-fill Reference
            </button>
          </div>

          {showReference && (
            <div className="bg-gray-900/30 border border-gray-800/40 rounded-lg p-3 text-xs text-gray-400">
              <p className="text-white font-medium mb-2">💡 Principle of Least Privilege:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li><span className="text-gray-400">Guest</span> → read only</li>
                <li><span className="text-blue-400">Student</span> → read, write</li>
                <li><span className="text-purple-400">Teacher</span> → read, write, delete</li>
                <li><span className="text-red-400">Admin</span> → read, write, delete, admin</li>
              </ul>
            </div>
          )}

          {/* Permission Matrix */}
          <div className="bg-black/30 border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-3 text-xs text-gray-500 font-mono">Role</th>
                  {(['read', 'write', 'delete', 'admin'] as Permission[]).map((p) => (
                    <th key={p} className={`p-3 text-xs font-mono ${PERM_COLORS[p]}`}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(Object.keys(customPermissions) as Role[]).map((role) => (
                  <tr key={role} className="border-b border-gray-800/40">
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded border ${ROLE_COLORS[role]} font-mono`}>{role}</span>
                    </td>
                    {(['read', 'write', 'delete', 'admin'] as Permission[]).map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <button
                          onClick={() => togglePermission(role, perm)}
                          className={`w-8 h-8 rounded border transition-all ${
                            customPermissions[role].has(perm)
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                              : 'bg-gray-900/30 border-gray-800 text-gray-600 hover:border-gray-600'
                          }`}
                        >
                          {customPermissions[role].has(perm) ? '✓' : ''}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Users & Resources Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
              <h5 className="text-[10px] text-gray-500 font-mono mb-2 flex items-center gap-1"><Users className="w-3 h-3" /> Users</h5>
              {USERS.map((u) => (
                <div key={u.id} className="flex items-center gap-2 py-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${ROLE_COLORS[u.role]} font-mono`}>{u.role}</span>
                  <span className="text-[11px] text-gray-400">{u.name}</span>
                </div>
              ))}
            </div>
            <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
              <h5 className="text-[10px] text-gray-500 font-mono mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Resources</h5>
              {RESOURCES.map((r) => (
                <div key={r.id} className="flex items-center gap-2 py-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800/50 text-gray-500 font-mono">{r.type}</span>
                  <span className="text-[11px] text-gray-400">{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === 'test' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">Test your RBAC rules against attack scenarios:</p>
            <button onClick={runTests} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Run Attack Suite
            </button>
          </div>

          <div className="space-y-2">
            {ATTACKS.map((atk) => {
              const result = testResults.find((r) => r.scenarioId === atk.id);
              return (
                <div key={atk.id} className={`p-3 rounded-lg border transition-all ${
                  result
                    ? result.correct
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                    : 'bg-black/20 border-gray-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result ? (
                        result.correct ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-600" />
                      )}
                      <div>
                        <p className="text-xs font-medium text-gray-200">{atk.title}</p>
                        <p className="text-[10px] text-gray-500">{atk.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${ROLE_COLORS[atk.attacker.role]} font-mono`}>{atk.attacker.role}</span>
                      <span className="text-[10px] text-gray-600">→</span>
                      <span className={`text-[10px] font-mono ${PERM_COLORS[atk.attemptedPermission]}`}>{atk.attemptedPermission}</span>
                      {result && (
                        <span className={`text-[10px] font-medium ${result.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                          {result.result ? 'GRANTED' : 'BLOCKED'} {result.correct ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </div>
                  {result && !result.correct && (
                    <p className="text-[10px] text-yellow-400/70 mt-2 ml-6">💡 {atk.hint}</p>
                  )}
                </div>
              );
            })}
          </div>

          {testResults.length > 0 && (
            <div className="text-xs text-gray-400">
              Score: {correctAnswers}/{ATTACKS.length}
              {correctAnswers < 5 && ' — Adjust your RBAC matrix in Phase 1 and re-test.'}
            </div>
          )}
        </div>
      )}

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Challenge Complete! +300 XP</p>
            <p className="text-xs text-gray-400">You designed an RBAC system and defended against privilege escalation attacks.</p>
          </div>
        </div>
      )}
    </div>
  );
}
