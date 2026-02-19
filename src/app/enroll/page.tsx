'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, CheckCircle, GraduationCap, User, BookOpen,
  Calendar, CreditCard, Heart, MapPin, Phone, Mail, Shield,
  Users, Clock, Star, Award, FileText
} from 'lucide-react';

const programs = [
  { id: 'robotics_foundations', name: 'Robotics Foundations', ages: '6-12 years', level: 'Beginner', emoji: '🤖', price: 'K650', duration: 'Per Cohort', color: 'from-blue-500 to-cyan-500' },
  { id: 'coding_basics', name: 'Coding Basics', ages: '6-12 years', level: 'Beginner', emoji: '💻', price: 'K550', duration: 'Per Cohort', color: 'from-green-500 to-emerald-500' },
  { id: 'python', name: 'Python Programming', ages: '13-18 years', level: 'Intermediate', emoji: '🐍', price: 'K750', duration: 'Per Cohort', color: 'from-yellow-500 to-amber-500' },
  { id: 'advanced_robotics', name: 'Advanced Robotics', ages: '13-18 years', level: 'Advanced', emoji: '⚙️', price: 'K850', duration: 'Per Cohort', color: 'from-purple-500 to-violet-500' },
  { id: 'ai_ml', name: 'AI & Machine Learning', ages: '13-18 years', level: 'Advanced', emoji: '🧠', price: 'K950', duration: 'Per Cohort', color: 'from-pink-500 to-rose-500' },
  { id: 'digital_skills', name: 'Digital Skills', ages: '6-12 years', level: 'Beginner', emoji: '🖥️', price: 'K450', duration: 'Per Cohort', color: 'from-teal-500 to-cyan-500' },
];

const scheduleOptions = ['Saturday Morning (9am-12pm)', 'Saturday Afternoon (1pm-4pm)', 'Sunday Morning (9am-12pm)', 'After School (Mon-Fri 3pm-5pm)', 'Holiday Camp (Full Day)'];

export default function EnrollPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    // Step 1: Program
    program: '',
    preferredSchedule: '',
    // Step 2: Student Info
    studentFirstName: '',
    studentLastName: '',
    studentDOB: '',
    studentGender: '',
    studentGrade: '',
    previousExperience: '',
    learningGoals: '',
    // Step 3: Parent/Guardian
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
    parentAltPhone: '',
    parentRelation: '',
    parentAddress: '',
    parentCity: '',
    // Step 4: Medical & Emergency
    medicalConditions: '',
    allergies: '',
    medications: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    // Step 5: Additional
    howHeard: '',
    specialNeeds: '',
    photoConsent: false,
    termsAccepted: false,
    paymentMethod: '',
  });

  const update = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const selectedProgram = programs.find(p => p.id === form.program);

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!form.program) { setError('Please select a program'); return false; }
        if (!form.preferredSchedule) { setError('Please select a preferred schedule'); return false; }
        break;
      case 2:
        if (!form.studentFirstName.trim()) { setError('Student first name is required'); return false; }
        if (!form.studentLastName.trim()) { setError('Student last name is required'); return false; }
        if (!form.studentDOB) { setError('Date of birth is required'); return false; }
        break;
      case 3:
        if (!form.parentFirstName.trim()) { setError('Parent/guardian first name is required'); return false; }
        if (!form.parentLastName.trim()) { setError('Parent/guardian last name is required'); return false; }
        if (!form.parentEmail.includes('@')) { setError('Valid email address is required'); return false; }
        if (!form.parentPhone.trim()) { setError('Phone number is required'); return false; }
        if (!form.parentRelation) { setError('Relationship to student is required'); return false; }
        break;
      case 4:
        if (!form.emergencyName.trim()) { setError('Emergency contact name is required'); return false; }
        if (!form.emergencyPhone.trim()) { setError('Emergency contact phone is required'); return false; }
        break;
      case 5:
        if (!form.termsAccepted) { setError('You must accept the terms and conditions'); return false; }
        break;
    }
    setError('');
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => Math.min(s + 1, 6)); };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Enrollment failed');
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-7xl mb-6"
          >
            🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-4">Enrollment Submitted!</h1>
          <p className="text-indigo-200 mb-2">
            <strong>{form.studentFirstName}</strong> has been enrolled in <strong>{selectedProgram?.name}</strong>!
          </p>
          <p className="text-indigo-300 text-sm mb-8">
            A confirmation email will be sent to <strong>{form.parentEmail}</strong> with payment instructions and class details.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-lg font-bold text-white mb-3">📋 Enrollment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Student:</span><span className="text-white">{form.studentFirstName} {form.studentLastName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Program:</span><span className="text-white">{selectedProgram?.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Schedule:</span><span className="text-white">{form.preferredSchedule}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Fee:</span><span className="text-cyan-400 font-bold">{selectedProgram?.price}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Payment:</span><span className="text-white">{form.paymentMethod || 'To be arranged'}</span></div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition">
              Back Home
            </Link>
            <Link href="/programs" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition">
              View Programs
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition";
  const selectClass = "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-indigo-400 outline-none transition";
  const labelClass = "block text-sm font-medium text-indigo-300 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Hero */}
      <section className="pt-28 pb-6 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold">📚 2025/2026 Cohort</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">✅ Open for Enrollment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 mb-3">
            Enroll Your Child 🎓
          </h1>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">
            Start their journey in robotics, coding & STEM at BongoHive, Lusaka
          </p>
        </motion.div>
      </section>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-1">
          {['Program', 'Student', 'Parent', 'Medical', 'Confirm', 'Review'].map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-2 rounded-full transition-all duration-500 ${
                i + 1 <= step ? 'bg-gradient-to-r from-indigo-500 to-cyan-500' : 'bg-white/10'
              }`} />
              <p className={`text-[10px] mt-1 text-center hidden sm:block ${i + 1 <= step ? 'text-indigo-400' : 'text-slate-600'}`}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8"
        >
          {/* Step 1: Program Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Choose a Program</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {programs.map(prog => (
                  <motion.button
                    key={prog.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => update('program', prog.id)}
                    className={`p-4 rounded-xl text-left border-2 transition-all ${
                      form.program === prog.id
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{prog.emoji}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${prog.color} text-white`}>
                        {prog.level}
                      </span>
                    </div>
                    <div className="font-semibold text-white mt-2">{prog.name}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>📅 {prog.ages}</span>
                      <span>💰 {prog.price}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div>
                <label className={labelClass}>Preferred Schedule *</label>
                <select value={form.preferredSchedule} onChange={e => update('preferredSchedule', e.target.value)} className={selectClass}>
                  <option value="" className="bg-slate-900">Select a time slot</option>
                  {scheduleOptions.map(s => (
                    <option key={s} value={s} className="bg-slate-900">{s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Student Information */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Student Information</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input type="text" value={form.studentFirstName} onChange={e => update('studentFirstName', e.target.value)}
                    className={inputClass} placeholder="Child's first name" />
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input type="text" value={form.studentLastName} onChange={e => update('studentLastName', e.target.value)}
                    className={inputClass} placeholder="Child's last name" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input type="date" value={form.studentDOB} onChange={e => update('studentDOB', e.target.value)}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select value={form.studentGender} onChange={e => update('studentGender', e.target.value)} className={selectClass}>
                    <option value="" className="bg-slate-900">Select</option>
                    <option value="male" className="bg-slate-900">Male</option>
                    <option value="female" className="bg-slate-900">Female</option>
                    <option value="other" className="bg-slate-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Current Grade/Class</label>
                  <input type="text" value={form.studentGrade} onChange={e => update('studentGrade', e.target.value)}
                    className={inputClass} placeholder="e.g. Grade 5" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Previous Coding/Robotics Experience</label>
                <select value={form.previousExperience} onChange={e => update('previousExperience', e.target.value)} className={selectClass}>
                  <option value="" className="bg-slate-900">Select experience level</option>
                  <option value="none" className="bg-slate-900">No experience (complete beginner)</option>
                  <option value="some" className="bg-slate-900">Some experience (used Scratch, etc.)</option>
                  <option value="intermediate" className="bg-slate-900">Intermediate (built projects before)</option>
                  <option value="advanced" className="bg-slate-900">Advanced (competed or built complex projects)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Learning Goals (what do you hope your child will gain?)</label>
                <textarea value={form.learningGoals} onChange={e => update('learningGoals', e.target.value)} rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="e.g., I want my child to develop problem-solving skills, learn to code, prepare for competitions..." />
              </div>
            </div>
          )}

          {/* Step 3: Parent/Guardian */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Parent / Guardian Details</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input type="text" value={form.parentFirstName} onChange={e => update('parentFirstName', e.target.value)}
                    className={inputClass} placeholder="Parent first name" />
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input type="text" value={form.parentLastName} onChange={e => update('parentLastName', e.target.value)}
                    className={inputClass} placeholder="Parent last name" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Relationship to Student *</label>
                <select value={form.parentRelation} onChange={e => update('parentRelation', e.target.value)} className={selectClass}>
                  <option value="" className="bg-slate-900">Select relationship</option>
                  <option value="mother" className="bg-slate-900">Mother</option>
                  <option value="father" className="bg-slate-900">Father</option>
                  <option value="guardian" className="bg-slate-900">Legal Guardian</option>
                  <option value="grandparent" className="bg-slate-900">Grandparent</option>
                  <option value="sibling" className="bg-slate-900">Older Sibling (18+)</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input type="email" value={form.parentEmail} onChange={e => update('parentEmail', e.target.value)}
                      className={`${inputClass} pl-10`} placeholder="parent@email.com" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input type="tel" value={form.parentPhone} onChange={e => update('parentPhone', e.target.value)}
                      className={`${inputClass} pl-10`} placeholder="+260 97X XXX XXX" />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Alternative Phone Number</label>
                <input type="tel" value={form.parentAltPhone} onChange={e => update('parentAltPhone', e.target.value)}
                  className={inputClass} placeholder="Second contact number (optional)" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Residential Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.parentAddress} onChange={e => update('parentAddress', e.target.value)}
                      className={`${inputClass} pl-10`} placeholder="Street address" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>City / Town</label>
                  <input type="text" value={form.parentCity} onChange={e => update('parentCity', e.target.value)}
                    className={inputClass} placeholder="e.g. Lusaka" />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Medical & Emergency */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Medical & Emergency Info</h2>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-300">
                ⚠️ This information helps us ensure your child&apos;s safety. Leave fields blank if not applicable.
              </div>

              <div>
                <label className={labelClass}>Known Medical Conditions</label>
                <textarea value={form.medicalConditions} onChange={e => update('medicalConditions', e.target.value)} rows={2}
                  className={`${inputClass} resize-none`}
                  placeholder="e.g., Asthma, Epilepsy, Diabetes — or 'None'" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Allergies</label>
                  <input type="text" value={form.allergies} onChange={e => update('allergies', e.target.value)}
                    className={inputClass} placeholder="e.g., Peanuts, Penicillin — or 'None'" />
                </div>
                <div>
                  <label className={labelClass}>Current Medications</label>
                  <input type="text" value={form.medications} onChange={e => update('medications', e.target.value)}
                    className={inputClass} placeholder="e.g., Inhaler — or 'None'" />
                </div>
              </div>

              <hr className="border-white/10" />

              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" /> Emergency Contact (other than parent)
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Contact Name *</label>
                  <input type="text" value={form.emergencyName} onChange={e => update('emergencyName', e.target.value)}
                    className={inputClass} placeholder="Full name" />
                </div>
                <div>
                  <label className={labelClass}>Contact Phone *</label>
                  <input type="tel" value={form.emergencyPhone} onChange={e => update('emergencyPhone', e.target.value)}
                    className={inputClass} placeholder="+260 97X XXX XXX" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Relationship to Student</label>
                <input type="text" value={form.emergencyRelation} onChange={e => update('emergencyRelation', e.target.value)}
                  className={inputClass} placeholder="e.g., Uncle, Aunt, Neighbor" />
              </div>
            </div>
          )}

          {/* Step 5: Confirm & Consent */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Additional Info & Consent</h2>
              </div>

              <div>
                <label className={labelClass}>How did you hear about ROBOTIX?</label>
                <select value={form.howHeard} onChange={e => update('howHeard', e.target.value)} className={selectClass}>
                  <option value="" className="bg-slate-900">Select</option>
                  <option value="social_media" className="bg-slate-900">Social Media (TikTok, Facebook, Instagram)</option>
                  <option value="friend" className="bg-slate-900">Friend / Word of Mouth</option>
                  <option value="school" className="bg-slate-900">School Announcement</option>
                  <option value="event" className="bg-slate-900">ROBOTIX Event / Workshop</option>
                  <option value="website" className="bg-slate-900">Google / Website</option>
                  <option value="flyer" className="bg-slate-900">Flyer / Poster</option>
                  <option value="stanbic" className="bg-slate-900">Stanbic Bank Partnership</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Special Needs or Accommodations</label>
                <textarea value={form.specialNeeds} onChange={e => update('specialNeeds', e.target.value)} rows={2}
                  className={`${inputClass} resize-none`}
                  placeholder="Any learning needs, physical accommodations, or other requirements we should know about" />
              </div>

              <div>
                <label className={labelClass}>Preferred Payment Method</label>
                <select value={form.paymentMethod} onChange={e => update('paymentMethod', e.target.value)} className={selectClass}>
                  <option value="" className="bg-slate-900">Select</option>
                  <option value="mobile_money" className="bg-slate-900">Mobile Money (MTN / Airtel)</option>
                  <option value="bank_transfer" className="bg-slate-900">Bank Transfer</option>
                  <option value="cash" className="bg-slate-900">Cash (at BongoHive)</option>
                  <option value="installment" className="bg-slate-900">Installment Plan (2 payments)</option>
                </select>
              </div>

              <div className="space-y-3 bg-white/5 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.photoConsent} onChange={e => update('photoConsent', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/30 bg-white/10 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-300">
                    I give permission for ROBOTIX to take and use photographs/videos of my child for educational and promotional purposes (social media, website, etc.)
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.termsAccepted} onChange={e => update('termsAccepted', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/30 bg-white/10 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-300">
                    I have read and agree to the <Link href="/terms" className="text-indigo-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>. I understand the fee structure and cancellation policy. *
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Review Enrollment</h2>
              </div>

              {/* Program */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedProgram?.emoji}</span>
                  <div>
                    <h3 className="font-bold text-white">{selectedProgram?.name}</h3>
                    <p className="text-sm text-slate-400">{form.preferredSchedule} • {selectedProgram?.price}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Student */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-1"><GraduationCap className="w-4 h-4" /> Student</h3>
                  <div className="text-sm space-y-1">
                    <p className="text-white font-medium">{form.studentFirstName} {form.studentLastName}</p>
                    <p className="text-slate-400">DOB: {form.studentDOB}</p>
                    {form.studentGrade && <p className="text-slate-400">Grade: {form.studentGrade}</p>}
                    {form.previousExperience && <p className="text-slate-400">Exp: {form.previousExperience}</p>}
                  </div>
                </div>

                {/* Parent */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-1"><Users className="w-4 h-4" /> Parent/Guardian</h3>
                  <div className="text-sm space-y-1">
                    <p className="text-white font-medium">{form.parentFirstName} {form.parentLastName}</p>
                    <p className="text-slate-400">{form.parentEmail}</p>
                    <p className="text-slate-400">{form.parentPhone}</p>
                    <p className="text-slate-400">{form.parentRelation}</p>
                  </div>
                </div>
              </div>

              {/* Medical */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1"><Heart className="w-4 h-4" /> Emergency</h3>
                <div className="text-sm space-y-1">
                  <p className="text-white">{form.emergencyName} — {form.emergencyPhone}</p>
                  {form.medicalConditions && <p className="text-slate-400">Medical: {form.medicalConditions}</p>}
                  {form.allergies && <p className="text-slate-400">Allergies: {form.allergies}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 rounded-xl p-3">
                <CheckCircle className="w-4 h-4" />
                All information verified. Ready to submit!
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition">
                <ArrowLeft className="w-4 h-4" /> Back
              </motion.button>
            )}
            <div className="flex-1" />
            {step < 6 ? (
              <motion.button whileTap={{ scale: 0.95 }} onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-400 hover:to-cyan-500 text-white rounded-xl font-semibold transition shadow-lg shadow-indigo-500/20">
                Next <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition shadow-lg shadow-green-500/20 disabled:opacity-50">
                {submitting ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <><Award className="w-4 h-4" /> Complete Enrollment</>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Trust badges */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-slate-500">
          <span className="flex items-center gap-1">🔒 Secure & Encrypted</span>
          <span className="flex items-center gap-1">📍 BongoHive, Lusaka</span>
          <span className="flex items-center gap-1">📞 +260 97X XXX XXX</span>
        </div>
      </div>
    </div>
  );
}
