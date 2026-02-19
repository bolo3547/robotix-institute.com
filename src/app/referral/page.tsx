'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Copy, Check, Users, Star, ArrowRight } from 'lucide-react';

const rewards = [
  { referrals: 1, reward: '10% discount on next month', icon: '🎁' },
  { referrals: 3, reward: 'Free month of classes', icon: '🌟' },
  { referrals: 5, reward: 'Free robot kit + 1 month free', icon: '🤖' },
  { referrals: 10, reward: 'Full term scholarship for your child', icon: '🏆' },
];

const steps = [
  { step: 1, title: 'Share Your Code', desc: 'Get your unique referral code and share it with friends and family.' },
  { step: 2, title: 'Friend Enrolls', desc: 'When your friend signs up using your code, they get 10% off their first month.' },
  { step: 3, title: 'You Get Rewarded', desc: 'You earn rewards for every successful referral. The more you refer, the bigger the reward!' },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'ROBOTIX-FRIEND-2026';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl mb-6"
          >
            🎉
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            Refer a Friend, Get Rewarded
          </motion.h1>
          <p className="text-xl text-gray-600 mb-8">
            Share the gift of STEM education. Earn discounts, free months, and exclusive rewards!
          </p>

          {/* Referral Code */}
          <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Your Referral Code</p>
              <p className="text-xl font-bold text-accent-400 font-mono">{referralCode}</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-3 bg-gray-50 rounded-lg text-gray-900 hover:bg-gray-200 transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          {copied && (
            <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center relative"
              >
                <div className="w-10 h-10 bg-accent-500 text-white font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Tier */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Reward Tiers</h2>
          <div className="space-y-4">
            {rewards.map((tier, i) => (
              <motion.div
                key={tier.referrals}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-accent-500/50 transition-colors"
              >
                <div className="text-4xl">{tier.icon}</div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent-400" />
                    <span className="text-sm font-bold text-accent-400">{tier.referrals} Referral{tier.referrals > 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{tier.reward}</p>
                </div>
                <Star className="w-5 h-5 text-brand-600" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Buttons */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Share With Friends</h2>
          <p className="text-gray-600 mb-6">Spread the word and start earning rewards today!</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out Robotix Institute! Use my code ${referralCode} for 10% off: https://robotixinstitute.io`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://robotixinstitute.io`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My child is learning robotics at @RobotixInstitute! Use code ${referralCode} for 10% off.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors"
            >
              Twitter
            </a>
            <a
              href={`mailto:?subject=Check%20out%20Robotix%20Institute&body=Use%20my%20code%20${referralCode}%20for%2010%25%20off!%20https://robotixinstitute.io`}
              className="px-5 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-accent-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Enrolled Yet?</h2>
          <p className="text-white/80 mb-6">Join Robotix Institute first, then start referring friends!</p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-6 py-3 bg-white text-accent-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Enroll Now <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
