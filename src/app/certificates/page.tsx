'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Download, Search, Filter, Eye, X,
  CheckCircle, Star, Shield, Copy, Check, Loader2, Printer,
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/* ═══════════════════════════════════════════════════════════════
   GOOGLE-STYLE CERTIFICATE DESIGN — Robotix Institute
   
   Inspired by Google Career Certificates & Coursera:
   - Clean white canvas with subtle gray tones
   - Modern sans-serif typography  
   - Bold purple accent (brand color)
   - Generous white space
   - Minimal ornamentation — confidence through simplicity
   - Professional seal and signature lines
   ═══════════════════════════════════════════════════════════════ */

/* ─── Brand Colors ─── */
const C = {
  purple: '#4F2D7F',
  purpleLight: '#7B5EA7',
  purpleDark: '#331f53',
  accent: '#6C3FA0',
  gold: '#C4A35A',
  bg: '#FAFAFA',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

/* ─── Types ─── */
interface CertificateData {
  id: string;
  childName: string;
  courseName: string;
  grade: string;
  issueDate: string;
  certNumber: string;
  skills: string | null;
  instructorName: string | null;
  directorName: string;
  cohort: string | null;
  completionHours: number;
  status: string;
}

type Grade = 'distinction' | 'merit' | 'pass';

const gradeDisplay: Record<string, { label: string; tagColor: string; tagBg: string; sealColor: string }> = {
  distinction: { label: 'With Distinction', tagColor: '#4F2D7F', tagBg: '#F3EEFA', sealColor: '#4F2D7F' },
  merit: { label: 'With Merit', tagColor: '#6C3FA0', tagBg: '#F5F0FF', sealColor: '#6C3FA0' },
  pass: { label: 'Completed', tagColor: '#6B7280', tagBg: '#F3F4F6', sealColor: '#6B7280' },
};

/* ═══════════════════════════════════════════════════
   CERTIFICATE ARTWORK (Google-inspired, Robotix branded)
   ═══════════════════════════════════════════════════ */

/* Subtle geometric pattern: light grid + circles */
function SubtlePattern() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" viewBox="0 0 800 565" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="grid-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.8" fill={C.purple} />
        </pattern>
      </defs>
      <rect width="800" height="565" fill="url(#grid-dots)" />
    </svg>
  );
}

/* Corner accent — thin geometric L-bracket */
function CornerAccent({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotations = { tl: 0, tr: 90, bl: 270, br: 180 };
  const positions = {
    tl: 'top-4 left-4',
    tr: 'top-4 right-4',
    bl: 'bottom-4 left-4',
    br: 'bottom-4 right-4',
  };
  return (
    <div className={`absolute ${positions[position]}`} style={{ transform: `rotate(${rotations[position]}deg)` }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M0 0 L0 40" stroke={C.purple} strokeWidth="1.5" opacity="0.15" />
        <path d="M0 0 L40 0" stroke={C.purple} strokeWidth="1.5" opacity="0.15" />
        <circle cx="0" cy="0" r="2" fill={C.purple} opacity="0.2" />
      </svg>
    </div>
  );
}

/* Institutional Seal — modern circular badge */
function InstitutionalSeal({ grade, size = 90 }: { grade: Grade; size?: number }) {
  const config = gradeDisplay[grade] || gradeDisplay.pass;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={`seal-g-${grade}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.sealColor} />
          <stop offset="100%" stopColor={C.purpleLight} />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={config.sealColor} strokeWidth="2" opacity="0.2" />
      <circle cx={cx} cy={cy} r={r - 3} fill="none" stroke={config.sealColor} strokeWidth="0.5" opacity="0.15" />
      {/* Inner filled circle */}
      <circle cx={cx} cy={cy} r={r - 6} fill={`url(#seal-g-${grade})`} />
      {/* Inner border */}
      <circle cx={cx} cy={cy} r={r - 8} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      {/* Text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="8" fontWeight="800" letterSpacing="1.5"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        ROBOTIX
      </text>
      <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="6" fontWeight="600" letterSpacing="1" opacity="0.85"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        INSTITUTE
      </text>
      <line x1={cx - 10} y1={cy + 8} x2={cx + 10} y2={cy + 8} stroke="white" strokeWidth="0.4" opacity="0.4" />
      <text x={cx} y={cy + 15} textAnchor="middle" fill="white" fontSize="5" fontWeight="700" opacity="0.7" letterSpacing="0.8"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {grade === 'distinction' ? '\u2605 DISTINCTION' : grade === 'merit' ? '\u2605 MERIT' : 'CERTIFIED'}
      </text>
    </svg>
  );
}

/* Thin decorative divider */
function Divider({ width = 120 }: { width?: number }) {
  return (
    <svg width={width} height="6" viewBox={`0 0 ${width} 6`} className="mx-auto">
      <line x1="0" y1="3" x2={width} y2="3" stroke={C.gray300} strokeWidth="0.5" />
      <circle cx={width / 2} r="2" cy="3" fill={C.purple} opacity="0.3" />
      <circle cx={width / 2 - 12} r="1" cy="3" fill={C.purple} opacity="0.15" />
      <circle cx={width / 2 + 12} r="1" cy="3" fill={C.purple} opacity="0.15" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   THE CERTIFICATE — Full render (used for preview + PDF)
   ═══════════════════════════════════════════════════ */

function CertificateRender({
  cert,
  innerRef,
}: {
  cert: CertificateData;
  innerRef?: React.RefObject<HTMLDivElement>;
}) {
  const grade = (cert.grade as Grade) || 'pass';
  const gd = gradeDisplay[grade] || gradeDisplay.pass;
  const parsedSkills: string[] = cert.skills ? (() => { try { return JSON.parse(cert.skills); } catch { return []; } })() : [];
  const date = new Date(cert.issueDate).toLocaleDateString('en-ZM', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div
      ref={innerRef}
      className="relative overflow-hidden bg-white"
      style={{
        aspectRatio: '1.414 / 1',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top accent bar - bold purple strip */}
      <div className="h-[6px]" style={{ background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple}, ${C.purpleLight})` }} />

      {/* Subtle background pattern */}
      <SubtlePattern />

      {/* Corner accents */}
      <CornerAccent position="tl" />
      <CornerAccent position="tr" />
      <CornerAccent position="bl" />
      <CornerAccent position="br" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-[calc(100%-6px)] px-8 sm:px-14 py-6 sm:py-8">

        {/* HEADER */}
        <div className="text-center w-full">
          <div className="flex items-center justify-center gap-3 mb-3">
            {/* Logo mark */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: C.purple }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-base sm:text-lg font-extrabold tracking-wide" style={{ color: C.purple }}>
                ROBOTIX INSTITUTE
              </h1>
              <p className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-medium" style={{ color: C.gray500 }}>
                Zambia &middot; Robotics &amp; Coding for Children
              </p>
            </div>
          </div>

          <div className="mt-3 mb-1">
            <Divider width={200} />
          </div>

          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase font-semibold mt-3" style={{ color: C.gray500 }}>
            Certificate of Achievement
          </p>
        </div>

        {/* BODY */}
        <div className="text-center flex-1 flex flex-col items-center justify-center w-full max-w-lg -mt-2">
          <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: C.gray400 }}>
            This is to certify that
          </p>

          {/* Student name - the hero element */}
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight"
            style={{ color: C.gray900 }}
          >
            {cert.childName}
          </h2>

          {/* Underline */}
          <div className="w-48 sm:w-64 h-[1.5px] rounded-full mb-3"
            style={{ background: `linear-gradient(90deg, transparent, ${C.purple}40, transparent)` }} />

          <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: C.gray400 }}>
            has successfully completed
          </p>

          {/* Course name */}
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2" style={{ color: C.purple }}>
            {cert.courseName}
          </h3>

          {/* Grade badge */}
          <span
            className="inline-block px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider border"
            style={{ background: gd.tagBg, color: gd.tagColor, borderColor: `${gd.tagColor}25` }}
          >
            {gd.label}
          </span>

          {/* Completion hours */}
          {cert.completionHours > 0 && (
            <p className="text-[9px] mt-2" style={{ color: C.gray400 }}>
              {cert.completionHours} hours of coursework completed
            </p>
          )}

          {/* Skills chips */}
          {parsedSkills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {parsedSkills.slice(0, 6).map(s => (
                <span
                  key={s}
                  className="px-2 py-0.5 text-[8px] sm:text-[9px] font-medium rounded-md"
                  style={{ background: C.gray100, color: C.gray600, border: `1px solid ${C.gray200}` }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SEAL + SIGNATURES */}
        <div className="w-full">
          {/* Seal centered above signatures */}
          <div className="flex justify-center mb-3">
            <InstitutionalSeal grade={grade} size={80} />
          </div>

          <div className="flex justify-between items-end w-full max-w-md mx-auto">
            {/* Instructor signature */}
            <div className="text-center flex-1">
              <div className="h-8 border-b mx-3" style={{ borderColor: C.gray300 }} />
              <p className="text-[9px] font-semibold mt-1.5" style={{ color: C.gray700 }}>
                {cert.instructorName || 'Instructor'}
              </p>
              <p className="text-[7px] tracking-wider uppercase" style={{ color: C.gray400 }}>
                Program Instructor
              </p>
            </div>

            {/* Date & cert number */}
            <div className="text-center flex-1 px-4">
              <p className="text-[9px] font-medium" style={{ color: C.gray600 }}>{date}</p>
              <p className="text-[8px] font-mono tracking-wider mt-0.5" style={{ color: C.gray400 }}>
                {cert.certNumber}
              </p>
              {cert.cohort && (
                <p className="text-[7px] mt-0.5" style={{ color: C.gray400 }}>Cohort: {cert.cohort}</p>
              )}
            </div>

            {/* Director signature */}
            <div className="text-center flex-1">
              <div className="h-8 border-b mx-3" style={{ borderColor: C.gray300 }} />
              <p className="text-[9px] font-semibold mt-1.5" style={{ color: C.gray700 }}>
                {cert.directorName}
              </p>
              <p className="text-[7px] tracking-wider uppercase" style={{ color: C.gray400 }}>
                Director
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[4px]"
        style={{ background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple}, ${C.purpleLight})` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CERTIFICATE CARD — Grid overview
   ═══════════════════════════════════════════════════ */

function CertificateCard({ cert, onView, index }: {
  cert: CertificateData;
  onView: () => void;
  index: number;
}) {
  const gd = gradeDisplay[cert.grade] || gradeDisplay.pass;
  const date = new Date(cert.issueDate).toLocaleDateString('en-ZM', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={onView}
    >
      {/* Mini certificate preview */}
      <div className="relative p-4 bg-gradient-to-br from-gray-50 to-white border-b">
        <div className="h-1 rounded-full mb-3" style={{ background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple}, ${C.purpleLight})` }} />
        <div className="text-center py-3">
          <p className="text-[9px] text-gray-400 tracking-widest uppercase mb-1">Certificate of Achievement</p>
          <h3 className="text-lg font-bold text-gray-900 mb-0.5">{cert.childName}</h3>
          <p className="text-xs font-medium" style={{ color: C.purple }}>{cert.courseName}</p>
          <span
            className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
            style={{ background: gd.tagBg, color: gd.tagColor }}
          >
            {gd.label}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-xs">
          <span className="font-mono text-gray-400">{cert.certNumber}</span>
          <span className="text-gray-300 mx-1.5">{'\u2022'}</span>
          <span className="text-gray-500">{date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" title="View certificate" aria-label="View certificate" className="p-2 rounded-lg bg-gray-100 hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-colors">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Download certificate" aria-label="Download certificate" className="p-2 rounded-lg bg-gray-100 hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-colors">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   CERTIFICATE MODAL — Full view + download/print
   ═══════════════════════════════════════════════════ */

function CertificateModal({
  cert,
  onClose,
  autoDownload,
  onAutoDownloadComplete,
}: {
  cert: CertificateData;
  onClose: () => void;
  autoDownload?: boolean;
  onAutoDownloadComplete?: () => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = useCallback(async () => {
    if (!certRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true,
      });

      const pdfWidth = 297;
      const pdfHeight = 210;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const canvasAspect = canvas.width / canvas.height;
      const pdfAspect = pdfWidth / pdfHeight;

      let imgW = pdfWidth;
      let imgH = pdfHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasAspect > pdfAspect) {
        imgH = pdfWidth / canvasAspect;
        offsetY = (pdfHeight - imgH) / 2;
      } else {
        imgW = pdfHeight * canvasAspect;
        offsetX = (pdfWidth - imgW) / 2;
      }

      pdf.addImage(imgData, 'JPEG', offsetX, offsetY, imgW, imgH);
      pdf.setProperties({
        title: `Certificate - ${cert.childName} - ${cert.courseName}`,
        subject: 'Robotix Institute Certificate of Achievement',
        author: 'Robotix Institute Zambia',
        creator: 'Robotix Institute Platform',
      });

      pdf.save(`${cert.certNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [cert, downloading]);

  const handlePrint = useCallback(() => {
    if (!certRef.current) return;
    const printContent = certRef.current.innerHTML;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Certificate - ${cert.childName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
        .cert-wrapper { width: 297mm; height: 210mm; }
      </style></head>
      <body><div class="cert-wrapper">${printContent}</div></body></html>
    `);
    win.document.close();
    win.onload = () => { win.print(); win.close(); };
  }, [cert]);

  // Auto-download trigger
  useEffect(() => {
    if (autoDownload && certRef.current && !downloading) {
      const timer = setTimeout(() => {
        handleDownloadPDF();
        onAutoDownloadComplete?.();
      }, 700);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [autoDownload]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyVerifyLink = () => {
    navigator.clipboard.writeText(`https://robotix.co.zm/verify/${cert.certNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-4xl w-full my-4"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xl bg-gray-800 hover:bg-gray-700 transition-colors"
          aria-label="Close certificate preview"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate render */}
        <div className="rounded-xl overflow-hidden shadow-2xl">
          <CertificateRender cert={cert} innerRef={certRef as React.RefObject<HTMLDivElement>} />

          {/* Download overlay */}
          {downloading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: C.purple }} />
                <p className="text-sm font-semibold" style={{ color: C.purple }}>Generating PDF...</p>
              </div>
            </div>
          )}
        </div>

        {/* Action bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 bg-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border"
        >
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500">Verify:</span>
            <button onClick={copyVerifyLink} className="flex items-center gap-1.5 text-purple-600 hover:text-purple-800 font-mono text-[11px] transition-colors">
              <span className="truncate max-w-[200px]">robotix.co.zm/verify/{cert.certNumber}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-[0.97] disabled:opacity-50 text-white"
              style={{ background: C.purple }}
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all active:scale-[0.97]"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   STATS BAR
   ═══════════════════════════════════════════════════ */

function StatsBar({ certificates }: { certificates: CertificateData[] }) {
  const distinctions = certificates.filter(c => c.grade === 'distinction').length;
  const merits = certificates.filter(c => c.grade === 'merit').length;
  const totalHours = certificates.reduce((sum, c) => sum + c.completionHours, 0);

  const stats = [
    { label: 'Total Certificates', value: certificates.length, icon: Award, color: C.purple },
    { label: 'Distinctions', value: distinctions, icon: Star, color: '#C4A35A' },
    { label: 'Merits', value: merits, icon: Shield, color: C.purpleLight },
    { label: 'Learning Hours', value: totalHours, icon: CheckCircle, color: C.accent },
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
          className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm"
        >
          <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-[10px] uppercase tracking-wider mt-0.5 text-gray-500">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN CERTIFICATES PAGE
   ═══════════════════════════════════════════════════ */

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [autoDownload, setAutoDownload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  // Fetch published certificates from API
  useEffect(() => {
    const fetchCerts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/certificates');
        const data = await res.json();
        setCertificates(Array.isArray(data) ? data : []);
      } catch {
        // Fallback: empty
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const filtered = certificates.filter(c => {
    const matchesSearch =
      c.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = filterGrade === 'all' || c.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 bg-purple-50 border border-purple-200"
            style={{ color: C.purple }}
          >
            <Award className="w-4 h-4" />
            Student Achievements
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Certificates of Achievement
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-gray-500">
            View, download, and print your child&apos;s digitally verified certificates
            from Robotix Institute Zambia.
          </p>
        </motion.div>

        {!loading && certificates.length > 0 && <StatsBar certificates={certificates} />}

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student, program, or certificate number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search certificates"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border border-gray-200 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterGrade}
              onChange={e => setFilterGrade(e.target.value)}
              aria-label="Filter by grade"
              className="px-4 py-3 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border border-gray-200 shadow-sm"
            >
              <option value="all">All Grades</option>
              <option value="distinction">Distinction</option>
              <option value="merit">Merit</option>
              <option value="pass">Completed</option>
            </select>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.purple }} />
          </div>
        )}

        {/* Certificate Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((cert, i) => (
              <CertificateCard key={cert.id} cert={cert} index={i} onView={() => setSelectedCert(cert)} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gray-100">
              <Award className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates found</h3>
            <p className="text-sm text-gray-500">
              {certificates.length === 0
                ? 'Published certificates will appear here once issued by the instructor.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
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
