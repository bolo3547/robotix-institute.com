'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';

const QUIZ = [
  {
    id: 1,
    question: 'Which layer of the OSI model is responsible for routing packets?',
    options: ['Data Link', 'Network', 'Transport', 'Application'],
    correct: 1,
    explanation: 'The Network layer (Layer 3) handles logical addressing and routing. IP operates here.',
  },
  {
    id: 2,
    question: 'What does DNS stand for?',
    options: ['Digital Network Service', 'Domain Name System', 'Data Node Syntax', 'Dynamic Naming Standard'],
    correct: 1,
    explanation: 'DNS translates human-readable domain names (like google.com) into IP addresses.',
  },
  {
    id: 3,
    question: 'Which port does HTTPS typically use?',
    options: ['80', '443', '22', '3306'],
    correct: 1,
    explanation: 'HTTPS uses port 443. HTTP uses 80, SSH uses 22, and MySQL uses 3306.',
  },
  {
    id: 4,
    question: 'What is the purpose of a firewall?',
    options: [
      'Speed up internet',
      'Filter network traffic based on security rules',
      'Encrypt all data',
      'Store passwords',
    ],
    correct: 1,
    explanation: 'Firewalls monitor and control incoming/outgoing network traffic based on predetermined security rules.',
  },
  {
    id: 5,
    question: 'Which protocol provides reliable, ordered delivery of data?',
    options: ['UDP', 'TCP', 'ICMP', 'ARP'],
    correct: 1,
    explanation: 'TCP (Transmission Control Protocol) ensures reliable, ordered data delivery with error checking and flow control.',
  },
  {
    id: 6,
    question: 'What is a MAC address?',
    options: [
      'An Apple computer ID',
      "A hardware identifier unique to each network interface",
      'A website URL format',
      'A type of encryption',
    ],
    correct: 1,
    explanation: "A MAC (Media Access Control) address is a unique hardware identifier assigned to a network interface card (NIC). It's a 48-bit address written as six pairs of hex digits.",
  },
  {
    id: 7,
    question: 'What type of attack floods a server with traffic to make it unavailable?',
    options: ['Phishing', 'DDoS', 'SQL Injection', 'Man-in-the-Middle'],
    correct: 1,
    explanation: 'A DDoS (Distributed Denial of Service) attack overwhelms a target with traffic from multiple sources.',
  },
  {
    id: 8,
    question: 'What does a VPN do?',
    options: [
      'Makes your computer faster',
      'Creates an encrypted tunnel for your internet traffic',
      'Blocks all cookies',
      'Provides free internet',
    ],
    correct: 1,
    explanation: 'A VPN (Virtual Private Network) encrypts your internet connection and routes it through a secure server.',
  },
];

export default function NetworkingQuizLab() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZ.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  const question = QUIZ[current];
  const selectedAnswer = answers[current];
  const isAnswered = selectedAnswer !== null;

  function selectAnswer(idx: number) {
    if (isAnswered) return;
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  }

  function nextQuestion() {
    if (current < QUIZ.length - 1) setCurrent(current + 1);
    else {
      setShowResult(true);
      if (answers.filter((a, i) => a === QUIZ[i].correct).length >= 6) setCompleted(true);
    }
  }

  const score = answers.filter((a, i) => a === QUIZ[i].correct).length;

  if (showResult) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">{score >= 7 ? '🌐' : score >= 5 ? '📡' : '📚'}</div>
          <h3 className="text-xl font-bold text-white">Quiz Complete!</h3>
          <p className="text-lg text-gray-300 mt-2">Score: <span className={score >= 6 ? 'text-emerald-400' : 'text-yellow-400'}>{score}/{QUIZ.length}</span></p>
        </div>
        <div className="space-y-3">
          {QUIZ.map((q, i) => (
            <div key={q.id} className={`p-3 rounded-lg border text-xs ${answers[i] === q.correct ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <p className="font-medium text-gray-300 mb-1">{q.question}</p>
              <p className="text-gray-500">{q.explanation}</p>
            </div>
          ))}
        </div>
        {completed && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-400">Challenge Complete! +75 XP</p>
              <p className="text-xs text-gray-400">Solid networking knowledge!</p>
            </div>
          </div>
        )}
        <button onClick={() => { setCurrent(0); setAnswers(new Array(QUIZ.length).fill(null)); setShowResult(false); setCompleted(false); }} className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">Score at least <span className="text-white font-medium">6/8</span> to complete.</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Q {current + 1}/{QUIZ.length}</span>
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((current + 1) / QUIZ.length) * 100}%` }} /></div>
      </div>
      <div>
        <h3 className="text-base font-medium text-white mb-4">{question.question}</h3>
        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            let style = 'border-gray-800 hover:border-gray-700 text-gray-300';
            if (isAnswered) {
              if (idx === question.correct) style = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
              else if (selectedAnswer === idx) style = 'border-red-500/40 bg-red-500/10 text-red-400';
            }
            return (
              <button key={idx} onClick={() => selectAnswer(idx)} className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono shrink-0">{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                  {isAnswered && idx === question.correct && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
                  {isAnswered && selectedAnswer === idx && idx !== question.correct && <XCircle className="w-4 h-4 ml-auto text-red-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {isAnswered && <div className="bg-gray-900/30 border border-gray-800/40 rounded-lg p-3"><p className="text-xs text-gray-400">{question.explanation}</p></div>}
      {isAnswered && <button onClick={nextQuestion} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">{current < QUIZ.length - 1 ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}
