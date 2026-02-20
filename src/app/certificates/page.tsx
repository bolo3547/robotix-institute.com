'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Download, Share2, Search, Filter, Eye, X,
  CheckCircle, Star, Shield, ExternalLink, Copy, Check, Loader2,
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/* ─────────────────────────── PURPLE PALETTE ─────────────────────────── */
/*
  World-class color mixing — ONLY purple + white.
  Inspired by Pentagram, Stefan Sagmeister, Apple's premium tier.

  Deep Purple   : #331f53  (brand-500)
  Royal Purple  : #4a2d7a
  Amethyst      : #5c3d8f
  Orchid        : #7b5ea7
  Lavender      : #a78bcc
  Wisteria      : #c4ade0
  Ghost White   : #e8ddf5
  Ice Lavender  : #f3eefa
  Snow Purple   : #f9f6fd
  Pure White    : #ffffff
*/

const P = {
  abyss:    '#0d0719',
  midnight: '#1a0f2e',
  deep:     '#231540',
  brand:    '#331f53',
  royal:    '#4a2d7a',
  amethyst: '#5c3d8f',
  orchid:   '#7b5ea7',
  lavender: '#a78bcc',
  wisteria: '#c4ade0',
  ghost:    '#e8ddf5',
  ice:      '#f3eefa',
  snow:     '#f9f6fd',
  white:    '#ffffff',
} as const;

/* ─────────────────────────── DATA ─────────────────────────── */

const mockCertificates = [
  {
    id: '1',
    childName: 'Mwamba Chisanga',
    programName: 'Robotics Fundamentals',
    certificateNumber: 'RIZ-2026-RF-001',
    issueDate: '2026-01-15',
    grade: 'distinction' as const,
    completionHours: 48,
    skills: ['Arduino Programming', 'Sensor Integration', 'Problem Solving', 'Team Collaboration'],
    instructorName: 'Mr. Banda',
    directorName: 'Dr. Chileshe Mwale',
    cohort: 'January 2026',
    verifyUrl: 'https://robotix.co.zm/verify/RIZ-2026-RF-001',
  },
  {
    id: '2',
    childName: 'Natasha Mulenga',
    programName: 'Python for Kids',
    certificateNumber: 'RIZ-2026-PK-002',
    issueDate: '2026-01-20',
    grade: 'merit' as const,
    completionHours: 36,
    skills: ['Python Basics', 'Logic & Algorithms', 'Game Development', 'Data Types'],
    instructorName: 'Ms. Phiri',
    directorName: 'Dr. Chileshe Mwale',
    cohort: 'January 2026',
    verifyUrl: 'https://robotix.co.zm/verify/RIZ-2026-PK-002',
  },
  {
    id: '3',
    childName: 'Chilufya Bwalya',
    programName: 'Web Development Junior',
    certificateNumber: 'RIZ-2026-WD-003',
    issueDate: '2025-12-10',
    grade: 'pass' as const,
    completionHours: 32,
    skills: ['HTML & CSS', 'JavaScript Basics', 'Responsive Design', 'Creative Thinking'],
    instructorName: 'Mr. Mumba',
    directorName: 'Dr. Chileshe Mwale',
    cohort: 'December 2025',
    verifyUrl: 'https://robotix.co.zm/verify/RIZ-2026-WD-003',
  },
  {
    id: '4',
    childName: 'Bwalya Tembo',
    programName: 'Advanced Robotics & IoT',
    certificateNumber: 'RIZ-2026-AR-004',
    issueDate: '2026-02-01',
    grade: 'distinction' as const,
    completionHours: 64,
    skills: ['3D Design', 'IoT Systems', 'Machine Learning Basics', 'Competition Strategy', 'Leadership'],
    instructorName: 'Mr. Banda',
    directorName: 'Dr. Chileshe Mwale',
    cohort: 'February 2026',
    verifyUrl: 'https://robotix.co.zm/verify/RIZ-2026-AR-004',
  },
];

type Certificate = (typeof mockCertificates)[0];
type Grade = Certificate['grade'];

/* ─── Grade Config: Three shades of purple, no other hues ─── */
const gradeConfig: Record<Grade, {
  label: string;
  sealPrimary: string;
  sealSecondary: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  barGradient: string;
  glowClass: string;
}> = {
  distinction: {
    label: 'With Distinction',
    sealPrimary: P.brand,
    sealSecondary: P.orchid,
    chipBg: 'bg-[#331f53]/25',
    chipText: 'text-[#c4ade0]',
    chipBorder: 'border-[#4a2d7a]/60',
    badgeBg: 'bg-[#f3eefa]',
    badgeBorder: 'border-[#c4ade0]',
    badgeText: 'text-[#331f53]',
    barGradient: `linear-gradient(90deg, ${P.brand}, ${P.amethyst}, ${P.brand})`,
    glowClass: 'hover:shadow-[#4a2d7a]/15',
  },
  merit: {
    label: 'With Merit',
    sealPrimary: P.amethyst,
    sealSecondary: P.lavender,
    chipBg: 'bg-[#5c3d8f]/20',
    chipText: 'text-[#c4ade0]',
    chipBorder: 'border-[#5c3d8f]/50',
    badgeBg: 'bg-[#f3eefa]',
    badgeBorder: 'border-[#a78bcc]',
    badgeText: 'text-[#5c3d8f]',
    barGradient: `linear-gradient(90deg, ${P.amethyst}, ${P.orchid}, ${P.amethyst})`,
    glowClass: 'hover:shadow-[#5c3d8f]/15',
  },
  pass: {
    label: 'Completed',
    sealPrimary: P.orchid,
    sealSecondary: P.wisteria,
    chipBg: 'bg-[#7b5ea7]/18',
    chipText: 'text-[#c4ade0]',
    chipBorder: 'border-[#7b5ea7]/40',
    badgeBg: 'bg-[#f9f6fd]',
    badgeBorder: 'border-[#c4ade0]',
    badgeText: 'text-[#7b5ea7]',
    barGradient: `linear-gradient(90deg, ${P.orchid}, ${P.lavender}, ${P.orchid})`,
    glowClass: 'hover:shadow-[#7b5ea7]/12',
  },
};

/* ════════════════════════════════════════════════════════════
   SVG COMPONENTS — Banknote-grade professional backgrounds
   Inspired by Swiss Federal certificates, Bank of England
   notes, Apple Developer Program, and Pantone's Violet 2685.
   ════════════════════════════════════════════════════════════ */

/* ─── Guilloche Rosette: Currency-grade mathematical spiral ─── */
function GuillocheRosette({ cx: cxp, cy: cyp, r, className = '' }: { cx: number; cy: number; r: number; className?: string }) {
  const paths: string[] = [];
  const layers = 5;
  for (let l = 0; l < layers; l++) {
    const pts: string[] = [];
    const freq = 6 + l * 2;
    const amp = r * (0.12 + l * 0.04);
    const baseR = r * (0.5 + l * 0.1);
    for (let a = 0; a <= 360; a += 2) {
      const rad = (a * Math.PI) / 180;
      const wave = baseR + amp * Math.sin(freq * rad);
      const x = cxp + wave * Math.cos(rad);
      const y = cyp + wave * Math.sin(rad);
      pts.push(`${a === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
    }
    paths.push(pts.join(' ') + 'Z');
  }

  return (
    <g className={className}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={i % 2 === 0 ? P.brand : P.amethyst} strokeWidth={0.3 + i * 0.05} opacity={0.03 + i * 0.008} />
      ))}
      <circle cx={cxp} cy={cyp} r={r * 0.18} fill="none" stroke={P.brand} strokeWidth="0.4" opacity="0.04" />
      <circle cx={cxp} cy={cyp} r={r * 0.08} fill={P.brand} opacity="0.02" />
    </g>
  );
}

/* ─── Lathe-Work Background: Fine concentric spirals like engraved steel plates ─── */
function LatheWorkBg() {
  const rings: JSX.Element[] = [];
  for (let i = 0; i < 24; i++) {
    const r = 50 + i * 30;
    rings.push(
      <circle key={`r${i}`} cx="400" cy="300" r={r} fill="none" stroke={P.brand} strokeWidth="0.2" opacity={0.015 - i * 0.0004} />
    );
    if (i % 3 === 0) {
      rings.push(
        <circle key={`rd${i}`} cx="400" cy="300" r={r - 3} fill="none" stroke={P.amethyst} strokeWidth="0.15" opacity={0.01} strokeDasharray="2 8" />
      );
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      {rings}
      <GuillocheRosette cx={400} cy={300} r={280} />
      <GuillocheRosette cx={400} cy={300} r={180} />
    </svg>
  );
}

/* ─── Paper Linen Texture: Subtle noise for premium paper feel ─── */
function PaperTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#paper-noise)" />
    </svg>
  );
}

/* ─── Radial Sunburst: Subtle rays emanating from center ─── */
function RadialSunburst() {
  const rays: JSX.Element[] = [];
  const count = 72;
  for (let i = 0; i < count; i++) {
    const angle = (i * 360) / count;
    rays.push(
      <line
        key={i}
        x1="400" y1="300"
        x2={400 + 400 * Math.cos((angle * Math.PI) / 180)}
        y2={300 + 400 * Math.sin((angle * Math.PI) / 180)}
        stroke={P.brand}
        strokeWidth={i % 4 === 0 ? '0.3' : '0.15'}
        opacity={i % 4 === 0 ? '0.012' : '0.006'}
      />
    );
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      {rays}
    </svg>
  );
}

/* ─── Microprint Border: Tiny repeating text like security documents ─── */
function MicroprintBorder() {
  const text = 'ROBOTIX INSTITUTE ZAMBIA \u00B7 CERTIFIED AUTHENTIC \u00B7 ';
  const repeat = text.repeat(6);

  return (
    <svg className="absolute inset-[10px] pointer-events-none" viewBox="0 0 780 580" preserveAspectRatio="none">
      <defs>
        <path id="mp-top" d="M20 0 L760 0" />
        <path id="mp-bottom" d="M20 580 L760 580" />
        <path id="mp-left" d="M0 20 L0 560" />
        <path id="mp-right" d="M780 20 L780 560" />
      </defs>
      <text fontSize="3" fill={P.brand} opacity="0.06" letterSpacing="1" fontFamily="monospace">
        <textPath href="#mp-top">{repeat}</textPath>
      </text>
      <text fontSize="3" fill={P.brand} opacity="0.06" letterSpacing="1" fontFamily="monospace">
        <textPath href="#mp-bottom">{repeat}</textPath>
      </text>
      <text fontSize="3" fill={P.brand} opacity="0.04" letterSpacing="1" fontFamily="monospace" writingMode="tb">
        <textPath href="#mp-left">{repeat}</textPath>
      </text>
      <text fontSize="3" fill={P.brand} opacity="0.04" letterSpacing="1" fontFamily="monospace" writingMode="tb">
        <textPath href="#mp-right">{repeat}</textPath>
      </text>
    </svg>
  );
}

/* ─── Filigree Corner Medallion: Ornate engraving-style corner pieces ─── */
function FiligreeCorner({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="120" height="120" viewBox="0 0 120 120" fill="none">
      {/* Main spiral curves */}
      <path d="M4 4 C4 4 40 3 60 12 C80 21 98 48 108 78" stroke={P.orchid} strokeWidth="0.8" opacity="0.18" />
      <path d="M4 4 C4 4 32 3 50 10 C72 18 86 42 94 64" stroke={P.brand} strokeWidth="0.6" opacity="0.25" />
      <path d="M4 4 C4 4 22 3 36 7 C54 13 68 30 76 48" stroke={P.amethyst} strokeWidth="0.45" opacity="0.15" />
      <path d="M4 4 C4 4 14 3 24 5 C38 9 48 20 54 34" stroke={P.lavender} strokeWidth="0.35" opacity="0.2" />

      {/* Scroll curl */}
      <path d="M6 6 Q14 6 14 14 Q14 20 8 20 Q4 20 4 16 Q4 11 8 11 Q11 11 11 14" stroke={P.brand} strokeWidth="0.5" opacity="0.22" fill="none" />

      {/* Leaf flourish */}
      <path d="M18 4 Q22 8 18 14 Q14 10 18 4Z" fill={P.brand} opacity="0.08" />
      <path d="M4 18 Q8 22 14 18 Q10 14 4 18Z" fill={P.brand} opacity="0.08" />

      {/* Decorative dots along curves */}
      <circle cx="10" cy="10" r="3" fill={P.brand} opacity="0.15" />
      <circle cx="10" cy="10" r="1.8" fill={P.white} opacity="0.8" />
      <circle cx="24" cy="5" r="1.8" fill={P.amethyst} opacity="0.12" />
      <circle cx="5" cy="24" r="1.8" fill={P.amethyst} opacity="0.12" />
      <circle cx="38" cy="7" r="1.2" fill={P.orchid} opacity="0.1" />
      <circle cx="7" cy="38" r="1.2" fill={P.orchid} opacity="0.1" />
      <circle cx="54" cy="12" r="0.9" fill={P.lavender} opacity="0.08" />
      <circle cx="12" cy="54" r="0.9" fill={P.lavender} opacity="0.08" />
      <circle cx="70" cy="20" r="0.7" fill={P.wisteria} opacity="0.06" />
      <circle cx="20" cy="70" r="0.7" fill={P.wisteria} opacity="0.06" />

      {/* Fine hash marks */}
      {[16, 28, 40, 52, 64].map((d, i) => (
        <g key={i}>
          <line x1={d + 2} y1={3} x2={d} y2={5 + i} stroke={P.brand} strokeWidth="0.25" opacity={0.08 - i * 0.01} />
          <line x1={3} y1={d + 2} x2={5 + i} y2={d} stroke={P.brand} strokeWidth="0.25" opacity={0.08 - i * 0.01} />
        </g>
      ))}
    </svg>
  );
}

/* ─── Enhanced Guilloche Strip: Multi-wave security band ─── */
function GuillocheStrip() {
  return (
    <svg className="w-full h-6 opacity-[0.08]" viewBox="0 0 800 24" preserveAspectRatio="none">
      <defs>
        <pattern id="guilloche-pro" x="0" y="0" width="60" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 12 Q15 0 30 12 Q45 24 60 12" stroke={P.brand} fill="none" strokeWidth="0.6" />
          <path d="M0 12 Q15 24 30 12 Q45 0 60 12" stroke={P.brand} fill="none" strokeWidth="0.6" />
          <path d="M0 12 Q15 4 30 12 Q45 20 60 12" stroke={P.amethyst} fill="none" strokeWidth="0.35" />
          <path d="M0 12 Q15 20 30 12 Q45 4 60 12" stroke={P.amethyst} fill="none" strokeWidth="0.35" />
          <path d="M0 12 Q15 7 30 12 Q45 17 60 12" stroke={P.orchid} fill="none" strokeWidth="0.2" />
          <line x1="0" y1="1" x2="60" y2="1" stroke={P.brand} strokeWidth="0.15" opacity="0.5" />
          <line x1="0" y1="23" x2="60" y2="23" stroke={P.brand} strokeWidth="0.15" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="800" height="24" fill="url(#guilloche-pro)" />
    </svg>
  );
}

/* ─── Security Cross-Hatch: Fine diagonal lines like anti-counterfeit ─── */
function SecurityHatch() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.008]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="sec-hatch" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke={P.brand} strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sec-hatch)" />
    </svg>
  );
}

/* ─── Ornamental Border Frame: Multi-layered decorative border ─── */
function OrnamentalFrame() {
  return (
    <>
      {/* Outermost: thin solid */}
      <div className="absolute inset-2 rounded-lg pointer-events-none" style={{ border: `1.5px solid ${P.wisteria}30` }} />
      {/* Second: dotted accent */}
      <div className="absolute inset-[14px] rounded-md pointer-events-none" style={{ border: `0.5px dotted ${P.lavender}25` }} />
      {/* Third: stronger frame */}
      <div className="absolute inset-[20px] rounded-md pointer-events-none" style={{ border: `1px solid ${P.ghost}50` }} />
      {/* Fourth: inner accent */}
      <div className="absolute inset-[24px] rounded pointer-events-none" style={{ border: `0.5px solid ${P.wisteria}20` }} />
      {/* Fifth: final inner frame */}
      <div className="absolute inset-[30px] rounded pointer-events-none" style={{ border: `0.5px solid ${P.ice}40` }} />
    </>
  );
}

/* ─── Diamond Divider: Elegant separator ─── */
function DiamondDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-12 sm:w-24" style={{ background: `linear-gradient(90deg, transparent, ${P.lavender})` }} />
      <div className="flex gap-1.5 items-center">
        <div className="w-1 h-1 rotate-45 border opacity-25" style={{ borderColor: P.orchid }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ background: P.brand, opacity: 0.35 }} />
        <div className="w-2 h-2 rotate-45" style={{ background: P.brand, opacity: 0.5 }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ background: P.brand, opacity: 0.35 }} />
        <div className="w-1 h-1 rotate-45 border opacity-25" style={{ borderColor: P.orchid }} />
      </div>
      <div className="h-px w-12 sm:w-24" style={{ background: `linear-gradient(-90deg, transparent, ${P.lavender})` }} />
    </div>
  );
}

/* ─── The Premium Seal: Purple starburst with white text ─── */
function PurpleSeal({ grade, size = 100 }: { grade: Grade; size?: number }) {
  const config = gradeConfig[grade];
  const points = 36;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 2;
  const innerR = outerR * 0.82;

  const sealPath = Array.from({ length: points * 2 }, (_, i) => {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ') + 'Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
      <defs>
        <linearGradient id={`seal-p-${grade}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.sealPrimary} />
          <stop offset="50%" stopColor={config.sealSecondary} />
          <stop offset="100%" stopColor={config.sealPrimary} />
        </linearGradient>
        <radialGradient id={`seal-sh-${grade}`} cx="30%" cy="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={outerR + 1} fill="none" stroke={config.sealSecondary} strokeWidth="0.5" opacity="0.3" />
      <path d={sealPath} fill={`url(#seal-p-${grade})`} />
      <circle cx={cx} cy={cy} r={innerR * 0.95} fill={`url(#seal-sh-${grade})`} />
      <circle cx={cx} cy={cy} r={innerR * 0.92} fill="none" stroke="white" strokeWidth="1" opacity="0.35" />
      <circle cx={cx} cy={cy} r={innerR * 0.84} fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
      <circle cx={cx} cy={cy} r={innerR * 0.76} fill="none" stroke="white" strokeWidth="0.3" opacity="0.12" />
      <text x={cx} y={cy - 10} textAnchor="middle" fill="white" fontSize={size * 0.1} fontWeight="800" letterSpacing="2.5" style={{ fontFamily: 'sans-serif' }}>
        ROBOTIX
      </text>
      <text x={cx} y={cy + 3} textAnchor="middle" fill="white" fontSize={size * 0.075} fontWeight="600" letterSpacing="1.5" opacity="0.85" style={{ fontFamily: 'sans-serif' }}>
        INSTITUTE
      </text>
      <line x1={cx - 14} y1={cy + 8} x2={cx + 14} y2={cy + 8} stroke="white" strokeWidth="0.4" opacity="0.35" />
      <text x={cx} y={cy + 17} textAnchor="middle" fill="white" fontSize={size * 0.065} fontWeight="700" opacity="0.7" letterSpacing="1.2" style={{ fontFamily: 'sans-serif' }}>
        {grade === 'distinction' ? 'EXCELLENCE' : grade === 'merit' ? 'MERIT' : 'CERTIFIED'}
      </text>
    </svg>
  );
}

/* ─── Rich Diagonal Watermark: Repeating institution name ─── */
function WatermarkPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="wm-pro" x="0" y="0" width="300" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
          <text x="150" y="40" textAnchor="middle" dominantBaseline="middle" fill={P.brand} fontSize="11" fontWeight="700" letterSpacing="5" style={{ fontFamily: 'sans-serif' }}>
            ROBOTIX INSTITUTE ZM
          </text>
          <text x="0" y="100" textAnchor="middle" dominantBaseline="middle" fill={P.amethyst} fontSize="7" fontWeight="600" letterSpacing="3" style={{ fontFamily: 'sans-serif' }}>
            CERTIFIED AUTHENTIC
          </text>
          <text x="300" y="100" textAnchor="middle" dominantBaseline="middle" fill={P.amethyst} fontSize="7" fontWeight="600" letterSpacing="3" style={{ fontFamily: 'sans-serif' }}>
            CERTIFIED AUTHENTIC
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wm-pro)" />
    </svg>
  );
}

/* ─── Central Crest Emblem: Large semi-transparent institutional crest ─── */
function CentralCrest() {
  return (
    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" width="320" height="320" viewBox="0 0 320 320" opacity="0.025">
      {/* Shield shape */}
      <path
        d="M160 20 L260 70 L260 180 Q260 260 160 300 Q60 260 60 180 L60 70 Z"
        fill="none" stroke={P.brand} strokeWidth="2"
      />
      <path
        d="M160 30 L250 75 L250 178 Q250 252 160 290 Q70 252 70 178 L70 75 Z"
        fill="none" stroke={P.amethyst} strokeWidth="0.8"
      />

      {/* Inner cross */}
      <line x1="160" y1="60" x2="160" y2="270" stroke={P.brand} strokeWidth="0.5" />
      <line x1="80" y1="160" x2="240" y2="160" stroke={P.brand} strokeWidth="0.5" />

      {/* Gear/cog for robotics */}
      <circle cx="160" cy="140" r="30" fill="none" stroke={P.brand} strokeWidth="1.5" />
      <circle cx="160" cy="140" r="22" fill="none" stroke={P.amethyst} strokeWidth="0.8" />
      <circle cx="160" cy="140" r="8" fill={P.brand} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <rect key={i} x={160 + 26 * Math.cos(a) - 3} y={140 + 26 * Math.sin(a) - 5} width="6" height="10" rx="1"
            fill={P.brand} transform={`rotate(${i * 30} ${160 + 26 * Math.cos(a)} ${140 + 26 * Math.sin(a)})`} />
        );
      })}

      {/* Text arc */}
      <defs>
        <path id="crest-arc-top" d="M80 140 A80 80 0 0 1 240 140" />
        <path id="crest-arc-bot" d="M90 200 A80 80 0 0 0 230 200" />
      </defs>
      <text fill={P.brand} fontSize="11" fontWeight="700" letterSpacing="4" style={{ fontFamily: 'sans-serif' }}>
        <textPath href="#crest-arc-top" textAnchor="middle" startOffset="50%">ROBOTIX INSTITUTE</textPath>
      </text>
      <text fill={P.brand} fontSize="9" fontWeight="600" letterSpacing="3" style={{ fontFamily: 'sans-serif' }}>
        <textPath href="#crest-arc-bot" textAnchor="middle" startOffset="50%">ZAMBIA</textPath>
      </text>

      {/* Stars */}
      {[-20, 0, 20].map((offset, i) => (
        <circle key={i} cx={160 + offset} cy="240" r="4" fill={P.brand} />
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   CERTIFICATE CARD — Grid View
   ════════════════════════════════════════════════════════════ */

function CertificateCard({ cert, onView, onDownload, index }: { cert: Certificate; onView: () => void; onDownload: () => void; index: number }) {
  const grade = gradeConfig[cert.grade];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 group shadow-lg ${grade.glowClass}`}
      style={{ background: `${P.midnight}CC`, border: `1px solid ${P.royal}30` }}
    >
      {/* Top gradient bar */}
      <div className="h-1" style={{ background: grade.barGradient }} />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </div>

      {/* Mini Certificate Preview */}
      <div className="relative p-4 sm:p-7 text-center" style={{ background: `linear-gradient(135deg, ${P.deep}40, ${P.brand}15, ${P.amethyst}10)`, borderBottom: `1px solid ${P.royal}15` }}>
        {/* Grade chip */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${grade.chipBg} ${grade.chipText} border ${grade.chipBorder} backdrop-blur-sm`}>
            {grade.label}
          </span>
        </div>

        {/* Mini seal */}
        <div className="flex justify-center mb-3">
          <PurpleSeal grade={cert.grade} size={56} />
        </div>

        <h3 className="text-base font-bold text-white tracking-[0.12em] uppercase">Certificate</h3>
        <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: P.lavender }}>of Completion</p>

        {/* Student name */}
        <div className="mt-4 inline-block rounded-lg px-5 py-2 backdrop-blur-sm" style={{ border: `1px solid ${P.orchid}30`, background: `${P.brand}20` }}>
          <p className="text-white font-bold text-lg">{cert.childName}</p>
        </div>
        <p className="text-sm mt-2 font-medium" style={{ color: P.lavender }}>{cert.programName}</p>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: P.orchid }}>Certificate #</p>
            <p className="text-white font-mono text-xs mt-0.5">{cert.certificateNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: P.orchid }}>Issued</p>
            <p className="text-white text-xs mt-0.5">
              {new Date(cert.issueDate).toLocaleDateString('en-ZM', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Skills pills */}
        <div className="flex flex-wrap gap-1">
          {cert.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="px-2 py-0.5 text-[10px] rounded-full" style={{ background: `${P.brand}50`, color: P.wisteria }}>
              {skill}
            </span>
          ))}
          {cert.skills.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] rounded-full" style={{ background: `${P.brand}40`, color: P.lavender }}>
              +{cert.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
            style={{ background: P.amethyst, color: P.white }}
          >
            <Eye className="w-4 h-4" /> View
          </button>
          <button
            onClick={onDownload}
            className="flex items-center justify-center px-3 py-2.5 rounded-xl transition-colors"
            style={{ background: `${P.brand}80`, color: P.white }}
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            className="flex items-center justify-center px-3 py-2.5 rounded-xl transition-colors"
            style={{ background: `${P.brand}80`, color: P.white }}
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   FULL CERTIFICATE PREVIEW — The Masterpiece
   Pure purple + white. Zero other hues.
   Swiss typography. Sacred white space.
   ════════════════════════════════════════════════════════════ */

function CertificateModal({ cert, onClose, autoDownload = false, onAutoDownloadComplete }: {
  cert: Certificate;
  onClose: () => void;
  autoDownload?: boolean;
  onAutoDownloadComplete?: () => void;
}) {
  const grade = gradeConfig[cert.grade];
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const copyLink = () => {
    navigator.clipboard.writeText(cert.verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!certRef.current || downloading) return;
    setDownloading(true);
    try {
      // Capture at 3x scale for print-quality output
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        // Ensure full rendering of SVG layers
        removeContainer: true,
      });

      // A4 landscape dimensions in mm
      const pdfWidth = 297;
      const pdfHeight = 210;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Convert canvas to high-quality JPEG (0.98 quality)
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // Calculate dimensions to fit A4 landscape while preserving aspect ratio
      const canvasAspect = canvas.width / canvas.height;
      const pdfAspect = pdfWidth / pdfHeight;

      let imgW = pdfWidth;
      let imgH = pdfHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasAspect > pdfAspect) {
        // Canvas is wider — fit to width, center vertically
        imgH = pdfWidth / canvasAspect;
        offsetY = (pdfHeight - imgH) / 2;
      } else {
        // Canvas is taller — fit to height, center horizontally
        imgW = pdfHeight * canvasAspect;
        offsetX = (pdfWidth - imgW) / 2;
      }

      pdf.addImage(imgData, 'JPEG', offsetX, offsetY, imgW, imgH);

      // PDF metadata
      pdf.setProperties({
        title: `Certificate - ${cert.childName} - ${cert.programName}`,
        subject: `Robotix Institute Certificate of Achievement`,
        author: 'Robotix Institute Zambia',
        creator: 'Robotix Institute Platform',
      });

      pdf.save(`${cert.certificateNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [cert, downloading]);

  // Auto-download when opened from card download button
  useEffect(() => {
    if (autoDownload && certRef.current && !downloading) {
      // Small delay to ensure the certificate is fully rendered
      const timer = setTimeout(() => {
        handleDownloadPDF();
        onAutoDownloadComplete?.();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [autoDownload]); // eslint-disable-line react-hooks/exhaustive-deps

  const formattedDate = new Date(cert.issueDate).toLocaleDateString('en-ZM', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ background: `${P.abyss}E6`, backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full my-4"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xl transition-colors"
          style={{ background: P.brand, border: `1px solid ${P.orchid}50` }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* ═══════════════════ THE CERTIFICATE ═══════════════════ */}
        <div
          ref={certRef}
          className="relative rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: `radial-gradient(ellipse at center, ${P.white} 0%, ${P.snow} 40%, ${P.ice}60 70%, ${P.ghost}30 100%)`,
            aspectRatio: '1.414 / 1',
          }}
        >
          {/* Layer 1: Paper linen texture */}
          <PaperTexture />

          {/* Layer 2: Radial sunburst rays */}
          <RadialSunburst />

          {/* Layer 3: Lathe-work concentric rings + guilloche rosettes */}
          <LatheWorkBg />

          {/* Layer 4: Security cross-hatch */}
          <SecurityHatch />

          {/* Layer 5: Central institutional crest */}
          <CentralCrest />

          {/* Layer 6: Diagonal watermark text */}
          <WatermarkPattern />

          {/* Layer 7: Microprint border */}
          <MicroprintBorder />

          {/* Layer 8: Multi-layered decorative border frame */}
          <OrnamentalFrame />

          {/* Top security band */}
          <div className="relative z-10">
            <div className="h-3" style={{ background: grade.barGradient }} />
            <GuillocheStrip />
          </div>

          <div className="relative px-6 sm:px-14 lg:px-20 py-6 sm:py-10 lg:py-12">

            {/* Filigree Corner Medallions */}
            <FiligreeCorner className="absolute top-2 left-2" style={{ color: P.lavender }} />
            <FiligreeCorner className="absolute top-2 right-2 -scale-x-100" style={{ color: P.lavender }} />
            <FiligreeCorner className="absolute bottom-2 left-2 -scale-y-100" style={{ color: P.lavender }} />
            <FiligreeCorner className="absolute bottom-2 right-2 -scale-x-100 -scale-y-100" style={{ color: P.lavender }} />

            {/* Corner accent dots */}
            <div className="absolute top-[36px] left-[36px] w-2 h-2 rounded-full" style={{ background: P.brand, opacity: 0.12 }} />
            <div className="absolute top-[36px] right-[36px] w-2 h-2 rounded-full" style={{ background: P.brand, opacity: 0.12 }} />
            <div className="absolute bottom-[36px] left-[36px] w-2 h-2 rounded-full" style={{ background: P.brand, opacity: 0.12 }} />
            <div className="absolute bottom-[36px] right-[36px] w-2 h-2 rounded-full" style={{ background: P.brand, opacity: 0.12 }} />

            {/* ═════════════════ CONTENT ═════════════════ */}
            <div className="relative z-10 text-center">

              {/* HEADER — Prestigious Institution Mark */}
              <div className="mb-5 sm:mb-7">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {/* Mini crest logo */}
                  <svg width="48" height="48" viewBox="0 0 48 48" className="sm:w-14 sm:h-14">
                    <defs>
                      <linearGradient id="crest-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={P.brand} />
                        <stop offset="100%" stopColor={P.amethyst} />
                      </linearGradient>
                    </defs>
                    {/* Shield */}
                    <path d="M24 3 L42 12 L42 28 Q42 40 24 46 Q6 40 6 28 L6 12 Z" fill="url(#crest-fill)" />
                    <path d="M24 5 L40 13 L40 27.5 Q40 38.5 24 44 Q8 38.5 8 27.5 L8 13 Z" fill="none" stroke={P.white} strokeWidth="0.5" opacity="0.3" />
                    {/* Gear */}
                    <circle cx="24" cy="22" r="7" fill="none" stroke={P.white} strokeWidth="1.2" opacity="0.8" />
                    <circle cx="24" cy="22" r="3" fill={P.white} opacity="0.7" />
                    {/* R letter */}
                    <text x="24" y="26" textAnchor="middle" fill={P.brand} fontSize="8" fontWeight="800" style={{ fontFamily: 'Georgia, serif' }}>R</text>
                    {/* Stars below gear */}
                    <circle cx="18" cy="36" r="1.5" fill={P.white} opacity="0.6" />
                    <circle cx="24" cy="38" r="1.5" fill={P.white} opacity="0.8" />
                    <circle cx="30" cy="36" r="1.5" fill={P.white} opacity="0.6" />
                  </svg>
                </div>
                <h1
                  className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-[0.2em] uppercase"
                  style={{ color: P.brand }}
                >
                  Robotix Institute
                </h1>
                <p className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase mt-1 font-semibold" style={{ color: P.orchid }}>
                  Zambia&apos;s Premier Robotics &amp; Coding Academy
                </p>
                <DiamondDivider />
              </div>

              {/* TITLE */}
              <div className="mb-4 sm:mb-5">
                <h2 className="text-[9px] sm:text-[11px] tracking-[0.45em] uppercase font-semibold" style={{ color: P.lavender }}>
                  Certificate of
                </h2>
                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.06em] mt-0.5"
                  style={{ color: P.orchid, fontFamily: 'Georgia, serif' }}
                >
                  {cert.grade === 'distinction' ? 'Excellence' : cert.grade === 'merit' ? 'Achievement' : 'Completion'}
                </h3>
              </div>

              {/* Presentation line */}
              <p className="text-xs sm:text-sm tracking-wider mb-2 font-light" style={{ color: P.lavender }}>
                This certificate is proudly presented to
              </p>

              {/* RECIPIENT NAME */}
              <div className="relative inline-block mb-3 sm:mb-4">
                <div className="absolute -left-6 sm:-left-10 top-1/2 w-4 sm:w-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${P.wisteria})` }} />
                <div className="absolute -right-6 sm:-right-10 top-1/2 w-4 sm:w-8 h-px" style={{ background: `linear-gradient(-90deg, transparent, ${P.wisteria})` }} />
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider px-2"
                  style={{ color: P.brand, fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {cert.childName}
                </h2>
                <div className="mt-1.5 sm:mt-2 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${P.amethyst}, transparent)` }} />
                <div className="mt-1 h-px rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${P.wisteria}80, transparent)` }} />
              </div>

              {/* Completion text */}
              <p className="text-xs sm:text-sm max-w-md mx-auto mb-1.5 leading-relaxed font-light" style={{ color: P.lavender }}>
                for the successful completion of{' '}
                <strong className="font-semibold" style={{ color: P.amethyst }}>{cert.completionHours} hours</strong>{' '}
                of immersive learning in
              </p>

              {/* PROGRAM NAME */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide" style={{ color: P.brand }}>
                  {cert.programName}
                </h4>
                <p className="text-[10px] uppercase tracking-[0.2em] mt-0.5" style={{ color: P.lavender }}>
                  {cert.cohort} Cohort
                </p>
              </div>

              {/* GRADE BADGE */}
              <div className="flex justify-center mb-5 sm:mb-7">
                <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 ${grade.badgeBg} ${grade.badgeBorder}`}>
                  <Shield className={`w-4 h-4 ${grade.badgeText}`} />
                  <span className={`font-bold text-xs sm:text-sm tracking-[0.15em] uppercase ${grade.badgeText}`}>
                    {grade.label}
                  </span>
                </div>
              </div>

              {/* SKILLS */}
              <div className="mb-6 sm:mb-8">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] mb-2 font-medium" style={{ color: P.lavender }}>
                  Skills Demonstrated
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-lg mx-auto">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] sm:text-xs rounded-full font-medium"
                      style={{ background: P.ice, border: `1px solid ${P.ghost}`, color: P.amethyst }}
                    >
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ color: P.orchid }} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* SIGNATURES */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 items-end pt-4 sm:pt-6" style={{ borderTop: `1px solid ${P.ghost}` }}>
                <div className="text-center">
                  <div className="h-8 sm:h-10 flex items-end justify-center mb-1">
                    <span className="text-sm sm:text-lg italic" style={{ color: P.orchid, fontFamily: 'Georgia, serif' }}>
                      {cert.instructorName}
                    </span>
                  </div>
                  <div className="h-px mx-2 sm:mx-4" style={{ background: P.wisteria }} />
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] mt-1.5 font-medium" style={{ color: P.lavender }}>
                    Course Instructor
                  </p>
                </div>

                <div className="flex justify-center -mt-2 sm:-mt-4">
                  <PurpleSeal grade={cert.grade} size={60} />
                </div>

                <div className="text-center">
                  <div className="h-8 sm:h-10 flex items-end justify-center mb-1">
                    <span className="text-sm sm:text-lg italic" style={{ color: P.orchid, fontFamily: 'Georgia, serif' }}>
                      {cert.directorName}
                    </span>
                  </div>
                  <div className="h-px mx-2 sm:mx-4" style={{ background: P.wisteria }} />
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] mt-1.5 font-medium" style={{ color: P.lavender }}>
                    Director
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div
                className="mt-5 sm:mt-7 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] sm:text-[10px]"
                style={{ borderTop: `1px solid ${P.ice}`, color: P.lavender }}
              >
                <div className="flex items-center gap-3 sm:gap-5">
                  <span className="flex items-center gap-1">
                    <span className="font-medium" style={{ color: P.orchid }}>Issued:</span> {formattedDate}
                  </span>
                  <span className="font-mono tracking-wider">{cert.certificateNumber}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3" style={{ color: P.amethyst }} />
                  <span className="font-medium" style={{ color: P.amethyst }}>Digitally Verified &amp; Authentic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom security band */}
          <div className="relative z-10">
            <GuillocheStrip />
            <div className="h-3" style={{ background: grade.barGradient }} />
          </div>

          {/* Download overlay */}
          {downloading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl" style={{ background: `${P.white}D0`, backdropFilter: 'blur(2px)' }}>
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: P.brand }} />
                <p className="text-sm font-semibold" style={{ color: P.brand }}>Generating PDF…</p>
              </div>
            </div>
          )}
        </div>

        {/* ACTION BAR */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-3 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ background: `${P.deep}CC`, backdropFilter: 'blur(12px)', border: `1px solid ${P.royal}30` }}
        >
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 shrink-0" style={{ color: P.orchid }} />
            <span className="text-xs" style={{ color: P.lavender }}>Verify:</span>
            <button onClick={copyLink} className="flex items-center gap-1.5 transition-colors font-mono text-[11px]" style={{ color: P.wisteria }}>
              <span className="truncate max-w-[180px] sm:max-w-none">{cert.verifyUrl.replace('https://', '')}</span>
              {copied ? <Check className="w-3.5 h-3.5 shrink-0" style={{ color: P.orchid }} /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-wait"
              style={{ background: P.royal, color: P.white, border: `1px solid ${P.orchid}30` }}
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {downloading ? 'Generating…' : 'PDF'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-[0.97]" style={{ background: P.white, color: P.brand }}>
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors" style={{ background: `${P.brand}60`, color: P.white, border: `1px solid ${P.orchid}20` }} title="Verify online">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   STATS BAR
   ════════════════════════════════════════════════════════════ */

function StatsBar({ certificates }: { certificates: Certificate[] }) {
  const distinctions = certificates.filter((c) => c.grade === 'distinction').length;
  const merits = certificates.filter((c) => c.grade === 'merit').length;
  const totalHours = certificates.reduce((sum, c) => sum + c.completionHours, 0);

  const stats = [
    { label: 'Total Certificates', value: certificates.length, icon: Award, iconColor: P.wisteria },
    { label: 'Distinctions', value: distinctions, icon: Star, iconColor: P.orchid },
    { label: 'Merits', value: merits, icon: Shield, iconColor: P.lavender },
    { label: 'Learning Hours', value: totalHours, icon: CheckCircle, iconColor: P.amethyst },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="rounded-xl p-4 text-center backdrop-blur-sm transition-colors"
          style={{ background: `${P.deep}60`, border: `1px solid ${P.royal}25` }}
        >
          <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.iconColor }} />
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: P.lavender }}>{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════ */

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [autoDownload, setAutoDownload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  const filtered = mockCertificates.filter((c) => {
    const matchesSearch =
      c.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = filterGrade === 'all' || c.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="min-h-screen py-10 sm:py-14" style={{ background: `linear-gradient(180deg, ${P.brand}, ${P.midnight})` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ background: `${P.royal}30`, color: P.wisteria, border: `1px solid ${P.royal}25` }}
          >
            <Award className="w-4 h-4" />
            Student Achievements
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Certificates of Achievement
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: `${P.wisteria}CC` }}>
            Celebrate your child&apos;s accomplishments. View, download, and share their
            digitally verified certificates.
          </p>
        </motion.div>

        <StatsBar certificates={mockCertificates} />

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.lavender }} />
            <input
              type="text"
              placeholder="Search student, program, or certificate number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2 transition-shadow placeholder:text-[#a78bcc80]"
              style={{ background: `${P.deep}80`, border: `1px solid ${P.royal}30` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: P.lavender }} />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2"
              style={{ background: `${P.deep}80`, border: `1px solid ${P.royal}30` }}
            >
              <option value="all">All Grades</option>
              <option value="distinction">Distinction</option>
              <option value="merit">Merit</option>
              <option value="pass">Completed</option>
            </select>
          </div>
        </motion.div>

        {/* Certificate Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((cert, i) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              index={i}
              onView={() => setSelectedCert(cert)}
              onDownload={() => {
                setAutoDownload(true);
                setSelectedCert(cert);
              }}
            />
          ))}
        </div>

        {/* Empty */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${P.deep}60` }}>
              <Award className="w-10 h-10" style={{ color: P.orchid }} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No certificates found</h3>
            <p className="text-sm" style={{ color: P.lavender }}>Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}

        {/* Certificate Modal */}
        <AnimatePresence>
          {selectedCert && (
            <CertificateModal
              cert={selectedCert}
              onClose={() => { setSelectedCert(null); setAutoDownload(false); }}
              autoDownload={autoDownload}
              onAutoDownloadComplete={() => setAutoDownload(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
