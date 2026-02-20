'use client';

import { notFound } from 'next/navigation';
import { CHALLENGES, DIFFICULTY_CONFIG, CATEGORY_LABELS } from '@/constants/cyber';
import { Shield, Clock, ArrowLeft, Target, BookOpen, Tag } from 'lucide-react';
import Link from 'next/link';
import PasswordStrengthLab from './labs/PasswordStrengthLab';
import EncryptionLab from './labs/EncryptionLab';
import AwarenessQuizLab from './labs/AwarenessQuizLab';
import NetworkingQuizLab from './labs/NetworkingQuizLab';
import SqlInjectionLab from './labs/SqlInjectionLab';
import XssLab from './labs/XssLab';
import HashAnalysisLab from './labs/HashAnalysisLab';
import FormValidationLab from './labs/FormValidationLab';
import CtfLab from './labs/CtfLab';
import VulnScannerLab from './labs/VulnScannerLab';
import AuthDebugLab from './labs/AuthDebugLab';
import RbacLab from './labs/RbacLab';

const LAB_MAP: Record<string, React.ComponentType> = {
  'password-strength': PasswordStrengthLab,
  'encryption-basics': EncryptionLab,
  'awareness-quiz': AwarenessQuizLab,
  'networking-quiz': NetworkingQuizLab,
  'sql-injection': SqlInjectionLab,
  'xss-simulation': XssLab,
  'hash-analysis': HashAnalysisLab,
  'form-validation': FormValidationLab,
  'capture-the-flag': CtfLab,
  'vulnerability-scanner': VulnScannerLab,
  'auth-debugging': AuthDebugLab,
  'rbac-challenge': RbacLab,
};

export default function ChallengeDetailPage({ params }: { params: { slug: string } }) {
  const challenge = CHALLENGES.find((c) => c.slug === params.slug);
  if (!challenge) return notFound();

  const diff = DIFFICULTY_CONFIG[challenge.difficulty];
  const LabComponent = LAB_MAP[challenge.slug];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/cyber/challenges" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-emerald-400 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Challenges
      </Link>

      {/* Challenge Header */}
      <div className="bg-[#0d1117] border border-gray-800/60 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${diff.bg} ${diff.border} border flex items-center justify-center shrink-0`}>
            <Shield className={`w-6 h-6 ${diff.text}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[10px] font-mono ${diff.text} ${diff.bg} px-2 py-0.5 rounded border ${diff.border}`}>
                {diff.label}
              </span>
              <span className="text-[10px] font-mono text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
                {CATEGORY_LABELS[challenge.category]}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">{challenge.title}</h1>
            <p className="text-sm text-gray-400 mt-2">{challenge.description}</p>

            <div className="flex items-center gap-5 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>{challenge.points} points</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>~{challenge.estimatedTime} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>Objective: {challenge.objective.substring(0, 80)}…</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Tag className="w-3 h-3 text-gray-600" />
              {challenge.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-mono text-gray-500 bg-gray-800/50 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lab Environment */}
      <div className="bg-[#0d1117] border border-gray-800/60 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-800/60 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-mono text-gray-500 ml-2">sandbox://lab/{challenge.slug}</span>
          <span className="ml-auto text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">SANDBOXED</span>
        </div>

        <div className="p-5">
          {LabComponent ? <LabComponent /> : (
            <div className="text-center py-16">
              <Shield className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Lab environment loading…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
