'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: role selection, 2: personal info, 3: details
  const [role, setRole] = useState<'parent' | 'instructor' | 'student' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Parent specific
    childAge: '',
    // Instructor specific
    qualifications: '',
  });

  const handleRoleSelect = (selectedRole: 'parent' | 'instructor' | 'student') => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep2 = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    return true;
  };

  const handleStep2 = () => {
    if (validateStep2()) {
      setError('');
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // Submit signup request to API
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: role,
          childAge: formData.childAge,
          qualifications: formData.qualifications,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Signup failed');
      }

      // Auto sign-in after successful signup
      const { signIn } = await import('next-auth/react');
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push(
          role === 'parent' ? '/parent-dashboard' 
          : role === 'instructor' ? '/instructor-dashboard' 
          : '/dashboard'
        );
      } else {
        router.push('/auth/login');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-accent-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <span className="text-5xl">🤖</span>
            </div>
            <CardTitle>Join ROBOTIX Today</CardTitle>
            <CardDescription>
              {step === 1
                ? 'Choose your account type'
                : step === 2
                ? 'Tell us about yourself'
                : 'Create your password'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('parent')}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all text-left"
                >
                  <div className="text-2xl mb-2">👨‍👩‍👧</div>
                  <div className="font-bold text-gray-900">I'm a Parent</div>
                  <div className="text-sm text-gray-600">Monitor your child's progress and learning</div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('student')}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all text-left"
                >
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="font-bold text-gray-900">I'm a Student</div>
                  <div className="text-sm text-gray-600">Learn robotics, coding & STEM skills</div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('instructor')}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all text-left"
                >
                  <div className="text-2xl mb-2">👨‍🏫</div>
                  <div className="font-bold text-gray-900">I'm an Instructor</div>
                  <div className="text-sm text-gray-600">Teach and inspire the next generation</div>
                </motion.button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <form className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+260 97X XXX XXX"
                  required
                />

                {role === 'parent' && (
                  <div>
                    <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-2">
                      Child&apos;s Age Group
                    </label>
                    <select
                      id="childAge"
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-brand-600 focus:outline-none"
                    >
                      <option value="">Select age group</option>
                      <option value="5-7">5-7 years</option>
                      <option value="8-10">8-10 years</option>
                      <option value="11-13">11-13 years</option>
                      <option value="14-16">14-16 years</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    onClick={handleStep2}
                  >
                    Continue
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  helperText="At least 8 characters"
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                  ✓ By signing up, you agree to our Terms of Service and Privacy Policy
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                  >
                    Create Account
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="mt-6 flex justify-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-lg">🔒</span> Secure
          </span>
          <span className="flex items-center gap-1">
            <span className="text-lg">✔</span> Verified
          </span>
          <span className="flex items-center gap-1">
            <span className="text-lg">🛡️</span> Safe
          </span>
        </div>
      </motion.div>
    </div>
  );
}
