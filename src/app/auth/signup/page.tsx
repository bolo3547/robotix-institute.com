'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle, User, Mail, Phone, Lock, Shield } from 'lucide-react';

const roles = [
  { id: 'parent', label: "I'm a Parent", emoji: '👨‍👩‍👧', desc: 'Monitor your child\'s progress, manage enrollment & payments', color: 'from-blue-500 to-indigo-600' },
  { id: 'student', label: "I'm a Student", emoji: '🎓', desc: 'Access learning resources, playground, certificates & more', color: 'from-green-500 to-emerald-600' },
  { id: 'instructor', label: "I'm an Instructor", emoji: '👨‍🏫', desc: 'Manage classes, track student progress & create content', color: 'from-purple-500 to-violet-600' },
];

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    role: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Parent specific
    childAge: '',
    childName: '',
    // Student specific
    school: '',
    gradeLevel: '',
    // Instructor specific
    qualifications: '',
    specialization: '',
  });

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  })();

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!form.role) { setError('Please select your account type'); return false; }
        break;
      case 2:
        if (!form.fullName.trim()) { setError('Full name is required'); return false; }
        if (!form.email.includes('@') || !form.email.includes('.')) { setError('Valid email address is required'); return false; }
        if (!form.phone.trim()) { setError('Phone number is required'); return false; }
        break;
      case 3:
        if (form.password.length < 8) { setError('Password must be at least 8 characters'); return false; }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return false; }
        break;
    }
    setError('');
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => Math.min(s + 1, 4)); };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
          childAge: form.childAge,
          childName: form.childName,
          school: form.school,
          gradeLevel: form.gradeLevel,
          qualifications: form.qualifications,
          specialization: form.specialization,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Signup failed');
      }

      // Auto sign-in
      const { signIn } = await import('next-auth/react');
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push(
          form.role === 'parent' ? '/dashboard/parent'
          : form.role === 'instructor' ? '/dashboard/instructor'
          : '/dashboard'
        );
      } else {
        router.push('/auth/login');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 outline-none transition";
  const selectClass = "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-brand-400 outline-none transition";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-5xl block mb-3"
          >
            🤖
          </motion.span>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-slate-400">
            {step === 1 ? 'Choose your account type' : step === 2 ? 'Tell us about yourself' : step === 3 ? 'Set your password' : 'Review & confirm'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-8">
          {['Account Type', 'Personal Info', 'Password', 'Confirm'].map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${
                i + 1 <= step ? 'bg-gradient-to-r from-brand-500 to-cyan-500' : 'bg-white/10'
              }`} />
            </div>
          ))}
        </div>

        {/* Error */}
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

        {/* Form Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8"
        >
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              {roles.map(role => (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => update('role', role.id)}
                  className={`w-full p-5 rounded-xl text-left border-2 transition-all flex items-start gap-4 ${
                    form.role === role.id
                      ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10'
                      : 'border-white/10 hover:border-white/25 bg-white/5'
                  }`}
                >
                  <span className="text-3xl">{role.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-white text-lg">{role.label}</div>
                    <div className="text-sm text-slate-400 mt-1">{role.desc}</div>
                  </div>
                  {form.role === role.id && (
                    <CheckCircle className="w-6 h-6 text-brand-400 flex-shrink-0 mt-1" />
                  )}
                </motion.button>
              ))}

              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-sm text-slate-400 text-center">
                  Looking for something else?
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/enroll" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition">
                    📝 Enroll a Child →
                  </Link>
                  <Link href="/join-team" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition">
                    🚀 Join Our Team →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
                    className={`${inputClass} pl-10`} placeholder="Your full name" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className={`${inputClass} pl-10`} placeholder="you@email.com" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                    className={`${inputClass} pl-10`} placeholder="+260 97X XXX XXX" />
                </div>
              </div>

              {/* Role-specific fields */}
              {form.role === 'parent' && (
                <>
                  <div>
                    <label className={labelClass}>Child&apos;s Name</label>
                    <input type="text" value={form.childName} onChange={e => update('childName', e.target.value)}
                      className={inputClass} placeholder="Your child's name" />
                  </div>
                  <div>
                    <label className={labelClass}>Child&apos;s Age Group</label>
                    <select value={form.childAge} onChange={e => update('childAge', e.target.value)} className={selectClass}>
                      <option value="" className="bg-slate-900">Select age group</option>
                      <option value="2-5" className="bg-slate-900">2-5 years (Tiny Tots)</option>
                      <option value="6-9" className="bg-slate-900">6-9 years (Explorers)</option>
                      <option value="10-13" className="bg-slate-900">10-13 years (Builders)</option>
                      <option value="14-18" className="bg-slate-900">14-18 years (Coders)</option>
                    </select>
                  </div>
                </>
              )}

              {form.role === 'student' && (
                <>
                  <div>
                    <label className={labelClass}>School</label>
                    <input type="text" value={form.school} onChange={e => update('school', e.target.value)}
                      className={inputClass} placeholder="Your school name" />
                  </div>
                  <div>
                    <label className={labelClass}>Grade Level</label>
                    <select value={form.gradeLevel} onChange={e => update('gradeLevel', e.target.value)} className={selectClass}>
                      <option value="" className="bg-slate-900">Select grade</option>
                      {['Grade 1-3', 'Grade 4-6', 'Grade 7-9', 'Grade 10-12', 'University'].map(g => (
                        <option key={g} value={g} className="bg-slate-900">{g}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {form.role === 'instructor' && (
                <>
                  <div>
                    <label className={labelClass}>Qualifications</label>
                    <input type="text" value={form.qualifications} onChange={e => update('qualifications', e.target.value)}
                      className={inputClass} placeholder="e.g., BSc Computer Science" />
                  </div>
                  <div>
                    <label className={labelClass}>Specialization</label>
                    <select value={form.specialization} onChange={e => update('specialization', e.target.value)} className={selectClass}>
                      <option value="" className="bg-slate-900">Select area</option>
                      <option value="robotics" className="bg-slate-900">Robotics</option>
                      <option value="coding" className="bg-slate-900">Coding & Programming</option>
                      <option value="ai_ml" className="bg-slate-900">AI & Machine Learning</option>
                      <option value="electronics" className="bg-slate-900">Electronics & IoT</option>
                      <option value="general_stem" className="bg-slate-900">General STEM</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    className={`${inputClass} pl-10 pr-10`}
                    placeholder="Create a strong password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength */}
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= passwordStrength.score ? passwordStrength.color : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength.score <= 1 ? 'text-red-400' :
                      passwordStrength.score <= 2 ? 'text-orange-400' :
                      passwordStrength.score <= 3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {passwordStrength.label} — {form.password.length < 8 ? 'Must be 8+ characters' : 'Looks good!'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                    className={`${inputClass} pl-10`} placeholder="Re-enter your password" />
                </div>
                {form.confirmPassword && form.confirmPassword !== form.password && (
                  <p className="text-xs text-red-400 mt-1">Passwords don&apos;t match</p>
                )}
                {form.confirmPassword && form.confirmPassword === form.password && form.password.length >= 8 && (
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300 flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Your password is encrypted and stored securely. We never share your personal information.</span>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-lg">
                  <span>{roles.find(r => r.id === form.role)?.emoji}</span>
                  <span className="font-bold text-white">{roles.find(r => r.id === form.role)?.label}</span>
                </div>
                <div className="grid gap-1 text-sm">
                  <div><span className="text-slate-400">Name:</span> <span className="text-white">{form.fullName}</span></div>
                  <div><span className="text-slate-400">Email:</span> <span className="text-white">{form.email}</span></div>
                  <div><span className="text-slate-400">Phone:</span> <span className="text-white">{form.phone}</span></div>
                  {form.role === 'parent' && form.childName && (
                    <div><span className="text-slate-400">Child:</span> <span className="text-white">{form.childName} ({form.childAge})</span></div>
                  )}
                  {form.role === 'student' && form.school && (
                    <div><span className="text-slate-400">School:</span> <span className="text-white">{form.school}</span></div>
                  )}
                  {form.role === 'instructor' && form.qualifications && (
                    <div><span className="text-slate-400">Qualifications:</span> <span className="text-white">{form.qualifications}</span></div>
                  )}
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-sm text-green-300">
                ✓ By creating an account, you agree to our{' '}
                <Link href="/terms" className="underline">Terms of Service</Link>{' '}and{' '}
                <Link href="/privacy" className="underline">Privacy Policy</Link>.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={prevStep}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition">
                <ArrowLeft className="w-4 h-4" /> Back
              </motion.button>
            )}
            <div className="flex-1" />
            {step < 4 ? (
              <motion.button whileTap={{ scale: 0.95 }} onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white rounded-xl font-semibold transition shadow-lg shadow-brand-500/20">
                Continue <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition shadow-lg shadow-green-500/20 disabled:opacity-50">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Create Account</>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-semibold transition">
              Sign in
            </Link>
          </p>
          <div className="flex justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">🔒 Secure</span>
            <span className="flex items-center gap-1">✔ Verified</span>
            <span className="flex items-center gap-1">🛡️ Safe</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
