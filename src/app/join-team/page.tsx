'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, ArrowLeft, CheckCircle, Upload, Briefcase, 
  GraduationCap, Heart, Code, Cpu, Users, MapPin, Clock
} from 'lucide-react';

const positions = [
  { id: 'instructor', title: 'Robotics Instructor', icon: <Cpu className="w-6 h-6" />, desc: 'Teach robotics, coding & STEM to young learners', color: 'from-blue-500 to-cyan-500' },
  { id: 'coding_instructor', title: 'Coding Instructor', icon: <Code className="w-6 h-6" />, desc: 'Teach Python, Scratch & web development', color: 'from-purple-500 to-pink-500' },
  { id: 'assistant', title: 'Teaching Assistant', icon: <Users className="w-6 h-6" />, desc: 'Support instructors and mentor students', color: 'from-green-500 to-emerald-500' },
  { id: 'volunteer', title: 'Volunteer', icon: <Heart className="w-6 h-6" />, desc: 'Help at events, camps & community outreach', color: 'from-pink-500 to-rose-500' },
  { id: 'content', title: 'Content Creator', icon: <GraduationCap className="w-6 h-6" />, desc: 'Create curriculum, videos & educational material', color: 'from-amber-500 to-orange-500' },
  { id: 'operations', title: 'Operations & Admin', icon: <Briefcase className="w-6 h-6" />, desc: 'Help with logistics, coordination & management', color: 'from-slate-500 to-gray-600' },
];

const availability = ['Weekdays', 'Weekday Evenings', 'Saturdays', 'Sundays', 'Flexible / Any'];

export default function JoinTeamPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    position: '',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    gender: '',
    // Experience
    education: '',
    experience: '',
    skills: [] as string[],
    hasTeachingExp: '',
    yearsExperience: '',
    linkedIn: '',
    portfolio: '',
    // Motivation
    whyJoin: '',
    availability: [] as string[],
    startDate: '',
    hearAbout: '',
    additionalInfo: '',
  });

  const allSkills = [
    'Python', 'Scratch', 'JavaScript', 'C/C++', 'Arduino', 'Raspberry Pi',
    'Robotics', '3D Printing', 'AI/ML', 'Web Development', 'Electronics',
    'Teaching', 'Public Speaking', 'Project Management', 'Content Creation',
    'Video Editing', 'Graphic Design', 'Social Media',
  ];

  const update = (field: string, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill],
    }));
  };

  const toggleAvailability = (slot: string) => {
    setForm(prev => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(s => s !== slot)
        : [...prev.availability, slot],
    }));
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!form.position) { setError('Please select a position'); return false; }
        break;
      case 2:
        if (!form.fullName.trim()) { setError('Full name is required'); return false; }
        if (!form.email.includes('@')) { setError('Valid email is required'); return false; }
        if (!form.phone.trim()) { setError('Phone number is required'); return false; }
        if (!form.location.trim()) { setError('Location is required'); return false; }
        break;
      case 3:
        if (!form.education) { setError('Education level is required'); return false; }
        if (!form.hasTeachingExp) { setError('Please indicate teaching experience'); return false; }
        break;
      case 4:
        if (!form.whyJoin.trim()) { setError('Please tell us why you want to join'); return false; }
        if (form.availability.length === 0) { setError('Select at least one availability'); return false; }
        break;
    }
    setError('');
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => Math.min(s + 1, 5)); };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/join-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-4">Application Submitted! 🎉</h1>
          <p className="text-purple-200 mb-3">
            Thank you for your interest in joining the ROBOTIX team, <strong>{form.fullName}</strong>!
          </p>
          <p className="text-purple-300 text-sm mb-8">
            We&apos;ll review your application and get back to you within 5 business days at <strong>{form.email}</strong>.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition">
              Back Home
            </Link>
            <Link href="/about" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition">
              About Us
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedPosition = positions.find(p => p.id === form.position);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Hero */}
      <section className="pt-28 pb-8 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3">
            Join the ROBOTIX Team 🚀
          </h1>
          <p className="text-purple-200 text-lg max-w-xl mx-auto">
            Help us inspire the next generation of innovators in Zambia
          </p>
        </motion.div>
      </section>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-1">
          {['Position', 'Personal', 'Experience', 'Motivation', 'Review'].map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-2 rounded-full transition-all duration-500 ${
                i + 1 <= step ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-white/10'
              }`} />
              <p className={`text-xs mt-1 text-center ${i + 1 <= step ? 'text-cyan-400' : 'text-slate-500'}`}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
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
          exit={{ opacity: 0, x: -30 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8"
        >
          {/* Step 1: Position Selection */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Which role interests you?</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {positions.map(pos => (
                  <motion.button
                    key={pos.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => update('position', pos.id)}
                    className={`p-4 rounded-xl text-left border-2 transition-all ${
                      form.position === pos.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pos.color} flex items-center justify-center text-white mb-2`}>
                      {pos.icon}
                    </div>
                    <div className="font-semibold text-white">{pos.title}</div>
                    <div className="text-sm text-purple-300 mt-1">{pos.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Personal Information</h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">Full Name *</label>
                  <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                    placeholder="Emmanuel Inambao" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                    placeholder="you@email.com" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                    placeholder="+260 97X XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.location} onChange={e => update('location', e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                      placeholder="City, Zambia" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">Gender</label>
                  <select value={form.gender} onChange={e => update('gender', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none">
                    <option value="" className="bg-slate-900">Select</option>
                    <option value="male" className="bg-slate-900">Male</option>
                    <option value="female" className="bg-slate-900">Female</option>
                    <option value="other" className="bg-slate-900">Other</option>
                    <option value="prefer_not" className="bg-slate-900">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Experience & Skills */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Experience & Skills</h2>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Highest Education *</label>
                <select value={form.education} onChange={e => update('education', e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none">
                  <option value="" className="bg-slate-900">Select level</option>
                  <option value="high_school" className="bg-slate-900">High School / GCE</option>
                  <option value="diploma" className="bg-slate-900">Diploma / Certificate</option>
                  <option value="bachelors" className="bg-slate-900">Bachelor&apos;s Degree</option>
                  <option value="masters" className="bg-slate-900">Master&apos;s Degree</option>
                  <option value="phd" className="bg-slate-900">PhD / Doctorate</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Teaching or mentoring experience? *</label>
                <div className="flex gap-3">
                  {['Yes', 'No', 'Some (informal)'].map(opt => (
                    <button key={opt} onClick={() => update('hasTeachingExp', opt)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        form.hasTeachingExp === opt
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                          : 'border-white/20 text-slate-300 hover:border-white/40'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Years of relevant experience</label>
                <select value={form.yearsExperience} onChange={e => update('yearsExperience', e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none">
                  <option value="" className="bg-slate-900">Select</option>
                  <option value="0" className="bg-slate-900">No experience (eager to learn)</option>
                  <option value="1-2" className="bg-slate-900">1-2 years</option>
                  <option value="3-5" className="bg-slate-900">3-5 years</option>
                  <option value="5+" className="bg-slate-900">5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Skills (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <button key={skill} onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${
                        form.skills.includes(skill)
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-white/15 text-slate-400 hover:border-white/30'
                      }`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">LinkedIn Profile</label>
                  <input type="url" value={form.linkedIn} onChange={e => update('linkedIn', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 outline-none"
                    placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">Portfolio / Website</label>
                  <input type="url" value={form.portfolio} onChange={e => update('portfolio', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 outline-none"
                    placeholder="https://yoursite.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Brief work experience summary</label>
                <textarea value={form.experience} onChange={e => update('experience', e.target.value)} rows={3}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 outline-none resize-none"
                  placeholder="Tell us about your relevant experience..." />
              </div>
            </div>
          )}

          {/* Step 4: Motivation & Availability */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Motivation & Availability</h2>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Why do you want to join ROBOTIX? *</label>
                <textarea value={form.whyJoin} onChange={e => update('whyJoin', e.target.value)} rows={4}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 outline-none resize-none"
                  placeholder="Share your passion for education, technology, or community impact..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">When are you available? *</label>
                <div className="flex flex-wrap gap-2">
                  {availability.map(slot => (
                    <button key={slot} onClick={() => toggleAvailability(slot)}
                      className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition ${
                        form.availability.includes(slot)
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-white/20 text-slate-300 hover:border-white/40'
                      }`}>
                      <Clock className="w-4 h-4" />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">When can you start?</label>
                <select value={form.startDate} onChange={e => update('startDate', e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none">
                  <option value="" className="bg-slate-900">Select</option>
                  <option value="immediately" className="bg-slate-900">Immediately</option>
                  <option value="1_week" className="bg-slate-900">Within 1 week</option>
                  <option value="2_weeks" className="bg-slate-900">Within 2 weeks</option>
                  <option value="1_month" className="bg-slate-900">Within 1 month</option>
                  <option value="flexible" className="bg-slate-900">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">How did you hear about us?</label>
                <select value={form.hearAbout} onChange={e => update('hearAbout', e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none">
                  <option value="" className="bg-slate-900">Select</option>
                  <option value="social_media" className="bg-slate-900">Social Media (TikTok, Facebook, etc.)</option>
                  <option value="friend" className="bg-slate-900">Friend or Family</option>
                  <option value="event" className="bg-slate-900">ROBOTIX Event / Workshop</option>
                  <option value="school" className="bg-slate-900">School / University</option>
                  <option value="website" className="bg-slate-900">Website / Google Search</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Anything else we should know?</label>
                <textarea value={form.additionalInfo} onChange={e => update('additionalInfo', e.target.value)} rows={2}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 outline-none resize-none"
                  placeholder="Certifications, special interests, etc." />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Review Your Application</h2>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2">Position</h3>
                  <p className="text-white">{selectedPosition?.title}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2">Personal Info</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-slate-400">Name:</span> <span className="text-white">{form.fullName}</span></div>
                    <div><span className="text-slate-400">Email:</span> <span className="text-white">{form.email}</span></div>
                    <div><span className="text-slate-400">Phone:</span> <span className="text-white">{form.phone}</span></div>
                    <div><span className="text-slate-400">Location:</span> <span className="text-white">{form.location}</span></div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2">Experience</h3>
                  <div className="text-sm space-y-1">
                    <div><span className="text-slate-400">Education:</span> <span className="text-white">{form.education}</span></div>
                    <div><span className="text-slate-400">Teaching exp:</span> <span className="text-white">{form.hasTeachingExp}</span></div>
                    {form.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {form.skills.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2">Motivation</h3>
                  <p className="text-white text-sm">{form.whyJoin}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.availability.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">{a}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">
                ✓ By submitting, you confirm that the information provided is accurate and you agree to our Privacy Policy.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </motion.button>
            )}
            <div className="flex-1" />
            {step < 5 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-semibold transition shadow-lg shadow-purple-500/20"
              >
                Next <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition shadow-lg shadow-green-500/20 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Submit Application
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Help text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Questions? Contact us at{' '}
          <a href="mailto:info@robotixinstitute.com" className="text-cyan-400 hover:underline">info@robotixinstitute.com</a>
          {' '}or{' '}
          <Link href="/contact" className="text-cyan-400 hover:underline">visit our contact page</Link>
        </p>
      </div>
    </div>
  );
}
