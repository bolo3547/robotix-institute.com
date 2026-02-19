'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code, Play, RotateCcw, Save, Share2, Lightbulb, Trophy, Terminal, BookOpen } from 'lucide-react';

const languages = [
  { id: 'python', name: 'Python', icon: '🐍', color: 'bg-blue-500' },
  { id: 'javascript', name: 'JavaScript', icon: '💛', color: 'bg-yellow-500' },
  { id: 'html', name: 'HTML & CSS', icon: '🌐', color: 'bg-orange-500' },
];

const challenges = [
  {
    id: '1',
    title: 'Hello Zambia!',
    difficulty: 'easy' as const,
    language: 'python',
    description: 'Write a program that prints "Hello, Zambia!" to the console.',
    starterCode: '# Write your code below\n\n',
    xpReward: 50,
    hint: 'Use the print() function',
  },
  {
    id: '2',
    title: 'Sum Calculator',
    difficulty: 'easy' as const,
    language: 'python',
    description: 'Create a function that takes two numbers and returns their sum.',
    starterCode: 'def add(a, b):\n    # Your code here\n    pass\n\n# Test it!\nresult = add(5, 3)\nprint(result)  # Should print 8',
    xpReward: 75,
    hint: 'Use the return keyword to give back the result',
  },
  {
    id: '3',
    title: 'Even or Odd?',
    difficulty: 'easy' as const,
    language: 'python',
    description: 'Write a function that checks if a number is even or odd.',
    starterCode: 'def even_or_odd(number):\n    # Your code here\n    pass\n\nprint(even_or_odd(4))  # Should print "Even"\nprint(even_or_odd(7))  # Should print "Odd"',
    xpReward: 75,
    hint: 'Use the modulo operator (%) to check remainder',
  },
  {
    id: '4',
    title: 'Counting Stars',
    difficulty: 'medium' as const,
    language: 'python',
    description: 'Write a program that prints a triangle of stars. For n=5, print:\n*\n**\n***\n****\n*****',
    starterCode: 'def star_triangle(n):\n    # Your code here\n    pass\n\nstar_triangle(5)',
    xpReward: 100,
    hint: 'Use a for loop with range() and string multiplication',
  },
  {
    id: '5',
    title: 'Robot Name Generator',
    difficulty: 'medium' as const,
    language: 'python',
    description: 'Create a function that generates a random robot name like "RB-1234" (RB- followed by 4 random digits).',
    starterCode: 'import random\n\ndef generate_robot_name():\n    # Your code here\n    pass\n\nprint(generate_robot_name())',
    xpReward: 120,
    hint: 'Use random.randint() to generate random numbers',
  },
  {
    id: '6',
    title: 'Fibonacci Sequence',
    difficulty: 'hard' as const,
    language: 'python',
    description: 'Write a function that returns the first n numbers of the Fibonacci sequence.',
    starterCode: 'def fibonacci(n):\n    # Your code here\n    pass\n\nprint(fibonacci(10))  # Should print [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]',
    xpReward: 200,
    hint: 'Each number is the sum of the two before it. Start with [0, 1].',
  },
];

const difficultyColors = {
  easy: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  hard: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

const sampleProjects = [
  { id: '1', title: 'My First Calculator', author: 'Mwamba C.', language: 'python', likes: 24, code: 'def calc(a, op, b):\n    if op == "+": return a + b\n    if op == "-": return a - b\n    if op == "*": return a * b\n    if op == "/": return a / b\n\nprint(calc(10, "+", 5))' },
  { id: '2', title: 'Guessing Game', author: 'Natasha M.', language: 'python', likes: 18, code: 'import random\nsecret = random.randint(1, 100)\nprint("Guess a number 1-100!")\n# Interactive game logic' },
  { id: '3', title: 'ASCII Art Robot', author: 'Chilufya B.', language: 'python', likes: 31, code: 'print("  [====]")\nprint("  |    |")\nprint("  | ^^ |")\nprint("  | == |")\nprint("  [====]")\nprint("  /|  |\\\\")\nprint(" / |  | \\\\")\nprint("   |  |")\nprint("  /|  |\\\\")\nprint(" / |  | \\\\")' },
];

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<'playground' | 'challenges' | 'projects'>('playground');
  const [selectedLang, setSelectedLang] = useState('python');
  const [code, setCode] = useState('# Welcome to ROBOTIX Code Playground! 🤖\n# Write your Python code here and click Run!\n\nprint("Hello, ROBOTIX! 🚀")\n\n# Try some math:\nfor i in range(1, 6):\n    print(f"Robot #{i} is online!")\n');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<typeof challenges[0] | null>(null);
  const [showHint, setShowHint] = useState(false);

  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput('');
    // Simulate code execution
    setTimeout(() => {
      let result = '';
      if (code.includes('print("Hello, ROBOTIX!')) {
        result = 'Hello, ROBOTIX! 🚀\nRobot #1 is online!\nRobot #2 is online!\nRobot #3 is online!\nRobot #4 is online!\nRobot #5 is online!';
      } else if (code.includes('Hello, Zambia')) {
        result = 'Hello, Zambia!';
      } else if (code.includes('add(5, 3)')) {
        result = '8';
      } else if (code.includes('star_triangle')) {
        result = '*\n**\n***\n****\n*****';
      } else if (code.includes('fibonacci')) {
        result = '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]';
      } else {
        result = '> Program executed successfully!\n> Output: (your code ran but produced no print output)';
      }
      setOutput(result);
      setIsRunning(false);
    }, 1500);
  }, [code]);

  const resetCode = () => {
    if (selectedChallenge) {
      setCode(selectedChallenge.starterCode);
    } else {
      setCode('# Write your code here\n\n');
    }
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            <Code className="w-4 h-4" /> Code Playground
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Interactive Code Playground</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Write code, solve challenges, and build awesome projects right in your browser!
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-fit mx-auto">
          {[
            { id: 'playground', label: 'Playground', icon: Code },
            { id: 'challenges', label: 'Challenges', icon: Trophy },
            { id: 'projects', label: 'Student Projects', icon: BookOpen },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === id
                  ? 'bg-accent-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'playground' && (
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Code Editor */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <select
                    aria-label="Select programming language"
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="bg-white text-gray-900 text-sm px-3 py-1 rounded-lg border border-gray-200 focus:outline-none"
                  >
                    {languages.map(l => (
                      <option key={l.id} value={l.id}>{l.icon} {l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={resetCode} className="p-2 text-gray-500 hover:text-gray-900 transition-colors" title="Reset">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors" title="Save">
                    <Save className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code Input */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-4 bg-gray-100 text-green-400 font-mono text-sm resize-none focus:outline-none"
                spellCheck={false}
                placeholder="Write your code here..."
              />

              {/* Run Button */}
              <div className="px-4 py-3 bg-gray-100 border-t border-gray-200">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-400 transition-colors disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" /> Run Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <Terminal className="w-4 h-4 text-accent-400" />
                <span className="text-gray-900 font-semibold text-sm">Output</span>
              </div>
              <div className="h-80 p-4 bg-gray-100 overflow-y-auto">
                {output ? (
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Click &quot;Run Code&quot; to see output here</p>
                    </div>
                  </div>
                )}
              </div>
              {selectedChallenge && (
                <div className="px-4 py-3 bg-gray-100 border-t border-gray-200">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 text-accent-400 text-sm hover:text-accent-300 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" /> {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  {showHint && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-gray-600 text-sm mt-2 p-3 bg-accent-500/10 rounded-lg">
                      💡 {selectedChallenge.hint}
                    </motion.p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge, idx) => {
              const diff = difficultyColors[challenge.difficulty];
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-accent-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${diff.bg} ${diff.text} border ${diff.border}`}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-accent-400 text-sm font-bold">
                      <Trophy className="w-3.5 h-3.5" /> +{challenge.xpReward} XP
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-2">{challenge.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{challenge.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500">
                      {languages.find(l => l.id === challenge.language)?.icon} {languages.find(l => l.id === challenge.language)?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedChallenge(challenge);
                      setCode(challenge.starterCode);
                      setOutput('');
                      setShowHint(false);
                      setActiveTab('playground');
                    }}
                    className="w-full py-2.5 bg-accent-500 text-white rounded-lg font-semibold text-sm hover:bg-accent-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Code className="w-4 h-4" /> Start Challenge
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-accent-500/30 transition-all"
              >
                {/* Code Preview */}
                <div className="p-4 bg-gray-100 border-b border-gray-200">
                  <pre className="text-green-400 font-mono text-xs line-clamp-6 overflow-hidden">{project.code}</pre>
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 font-bold mb-1">{project.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">by {project.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">
                      {languages.find(l => l.id === project.language)?.icon} {languages.find(l => l.id === project.language)?.name}
                    </span>
                    <span className="text-gray-600 text-sm">❤️ {project.likes}</span>
                  </div>
                  <button
                    onClick={() => {
                      setCode(project.code);
                      setSelectedChallenge(null);
                      setOutput('');
                      setActiveTab('playground');
                    }}
                    className="w-full mt-3 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors"
                  >
                    Open in Playground
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
