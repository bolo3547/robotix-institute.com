'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  Send
} from 'lucide-react';

const programs = [
  { id: 'little-einsteins', name: 'Little Einsteins', ageGroup: 'Pre-Elementary (Ages 4-6)', price: 2500 },
  { id: 'byte-buddies', name: 'Byte Buddies', ageGroup: 'Ages 7-10', price: 3000 },
  { id: 'imagineering', name: 'Imagineering', ageGroup: 'Ages 11-14', price: 3500 },
  { id: 'code-quest', name: 'Code Quest (Python)', ageGroup: 'Ages 15-18', price: 4000 },
  { id: 'summer-camps', name: 'Summer Camps', ageGroup: 'All Ages', price: 2000 },
  { id: 'community', name: 'Community Programs', ageGroup: 'All Ages', price: 0 },
];

const scheduleOptions = [
  'Weekday Afternoons (3PM - 6PM)',
  'Saturday Mornings (9AM - 12PM)',
  'Saturday Afternoons (2PM - 5PM)',
  'Sunday Mornings (9AM - 12PM)',
  'Sunday Afternoons (2PM - 5PM)',
  'Flexible / To be discussed',
];

export default function RequestQuotePage() {
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: '',
    programs: [] as string[],
    preferredSchedule: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProgramToggle = (programId: string) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.includes(programId)
        ? prev.programs.filter(p => p !== programId)
        : [...prev.programs, programId]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.parentName.trim()) newErrors.parentName = 'Your name is required';
    if (!formData.parentEmail.trim()) newErrors.parentEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.parentEmail)) newErrors.parentEmail = 'Invalid email format';
    if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Phone number is required';
    if (!formData.childName.trim()) newErrors.childName = "Child's name is required";
    if (!formData.childAge) newErrors.childAge = "Child's age is required";
    if (formData.programs.length === 0) newErrors.programs = 'Please select at least one program';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          childAge: parseInt(formData.childAge),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return formData.programs.reduce((sum, programId) => {
      const program = programs.find(p => p.id === programId);
      return sum + (program?.price || 0);
    }, 0);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in ROBOTIX Institute. We&apos;ve received your quotation request 
              and will send you a detailed quote within 24 hours.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Our team will review your request
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  You&apos;ll receive a PDF quotation via email
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  We may call to discuss your child&apos;s needs
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button variant="primary" className="w-full">
                  Return to Home
                </Button>
              </Link>
              <Link href="/programs">
                <Button variant="outline" className="w-full">
                  Explore Programs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Request a Quote</h1>
              <p className="text-sm text-gray-500">Get a personalized quotation for your child&apos;s programs</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Parent Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-500" />
                    Parent/Guardian Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.parentName}
                        onChange={e => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500 ${
                          errors.parentName ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Your full name"
                      />
                      {errors.parentName && (
                        <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.parentEmail}
                          onChange={e => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500 ${
                            errors.parentEmail ? 'border-red-300' : 'border-gray-200'
                          }`}
                          placeholder="email@example.com"
                        />
                      </div>
                      {errors.parentEmail && (
                        <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.parentPhone}
                          onChange={e => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500 ${
                            errors.parentPhone ? 'border-red-300' : 'border-gray-200'
                          }`}
                          placeholder="+260 97 1234567"
                        />
                      </div>
                      {errors.parentPhone && (
                        <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Child Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-500" />
                    Child Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Child&apos;s Name *
                      </label>
                      <input
                        type="text"
                        value={formData.childName}
                        onChange={e => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500 ${
                          errors.childName ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Child's full name"
                      />
                      {errors.childName && (
                        <p className="text-red-500 text-xs mt-1">{errors.childName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Child&apos;s Age *
                      </label>
                      <select
                        value={formData.childAge}
                        onChange={e => setFormData(prev => ({ ...prev, childAge: e.target.value }))}
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500 ${
                          errors.childAge ? 'border-red-300' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select age</option>
                        {Array.from({ length: 14 }, (_, i) => i + 5).map(age => (
                          <option key={age} value={age}>{age} years old</option>
                        ))}
                      </select>
                      {errors.childAge && (
                        <p className="text-red-500 text-xs mt-1">{errors.childAge}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Program Selection */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    Select Programs *
                  </h2>
                  {errors.programs && (
                    <p className="text-red-500 text-sm mb-4">{errors.programs}</p>
                  )}
                  <div className="grid md:grid-cols-2 gap-3">
                    {programs.map(program => (
                      <label
                        key={program.id}
                        className={`relative flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.programs.includes(program.id)
                            ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.programs.includes(program.id)}
                          onChange={() => handleProgramToggle(program.id)}
                          className="mt-1 w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{program.name}</p>
                          <p className="text-sm text-gray-500">{program.ageGroup}</p>
                          <p className="text-sm font-medium text-brand-600 mt-1">
                            K{program.price.toLocaleString()}/month
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Preference */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    Schedule Preference
                  </h2>
                  <select
                    value={formData.preferredSchedule}
                    onChange={e => setFormData(prev => ({ ...prev, preferredSchedule: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Select preferred time</option>
                    {scheduleOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              {/* Additional Message */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Information (Optional)
                  </h2>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    placeholder="Tell us about your child's interests, any previous experience with coding/robotics, or any questions you have..."
                  />
                </CardContent>
              </Card>

              {/* Submit Button - Mobile */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Quote Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quote Summary</h3>
                  
                  {formData.programs.length === 0 ? (
                    <p className="text-sm text-gray-500 mb-4">
                      Select programs to see pricing
                    </p>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {formData.programs.map(programId => {
                        const program = programs.find(p => p.id === programId);
                        return program ? (
                          <div key={programId} className="flex justify-between text-sm">
                            <span className="text-gray-600">{program.name}</span>
                            <span className="font-medium">K{program.price.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })}
                      <div className="pt-3 border-t border-gray-100 flex justify-between">
                        <span className="font-medium text-gray-900">Total/month</span>
                        <span className="font-bold text-brand-600">
                          K{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    You&apos;ll receive a detailed PDF quote within 24 hours
                  </p>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="mt-4">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      +260 956 355 117
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      info@robotixinstitute.io
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
