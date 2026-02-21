'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, RotateCcw, Share2, ChevronDown, Gamepad2, Zap, Brain } from 'lucide-react';
import { parsePrompt, GameCanvas, type GameConfig } from './GameEngine';

// Example prompts for inspiration
const EXAMPLE_PROMPTS = [
  { text: "A space shooter where I destroy asteroids", emoji: "🚀", category: "Shooter" },
  { text: "Ocean catching game where fish fall from the sky", emoji: "🐠", category: "Catcher" },
  { text: "Ninja running through a dark forest", emoji: "🥷", category: "Runner" },
  { text: "Robot platformer in a cyber factory", emoji: "🤖", category: "Platformer" },
  { text: "Pirate ship dodging sea monsters", emoji: "🏴‍☠️", category: "Racer" },
  { text: "Candy breakout smashing sweet blocks", emoji: "🍬", category: "Breakout" },
  { text: "Dinosaur jumping over lava", emoji: "🦕", category: "Runner" },
  { text: "Superhero flying through the city", emoji: "🦸", category: "Flappy" },
  { text: "Winter pong in the snow", emoji: "❄️", category: "Pong" },
  { text: "Desert racer dodging scorpions", emoji: "🏜️", category: "Racer" },
  { text: "Zombie survival collecting medicine", emoji: "🧟", category: "Catcher" },
  { text: "Easy forest animal catching game for kids", emoji: "🦊", category: "Catcher" },
];

// Typing animation messages
const AI_MESSAGES = [
  "🧠 Analyzing your idea...",
  "🎨 Designing the world...",
  "⚡ Building game mechanics...",
  "🎮 Generating your game...",
  "✨ Adding magic touches...",
];

export default function AIGameCreator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [history, setHistory] = useState<Array<{ prompt: string; config: GameConfig }>>([]);
  const [highScore, setHighScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const generateGame = async (text: string) => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setGeneratingStep(0);
    setGameConfig(null);

    // Animated generation steps
    for (let i = 0; i < AI_MESSAGES.length; i++) {
      setGeneratingStep(i);
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
    }

    // Parse and generate
    const config = parsePrompt(text);
    setGameConfig(config);
    setIsGenerating(false);

    // Add to history
    setHistory(prev => [{ prompt: text, config }, ...prev].slice(0, 10));

    // Scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateGame(prompt);
  };

  const handleExampleClick = (text: string) => {
    setPrompt(text);
    setShowExamples(false);
    generateGame(text);
  };

  const handleNewGame = () => {
    setGameConfig(null);
    setPrompt('');
    setHighScore(0);
    inputRef.current?.focus();
  };

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameConfig) handleNewGame();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gameConfig]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/80 via-purple-900/80 to-indigo-900/80 border border-white/10 backdrop-blur-xl shadow-2xl"
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 mb-4"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-bold">AI-Powered</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 mb-2">
              🎮 AI Game Creator
            </h2>
            <p className="text-purple-200/70 text-sm sm:text-base max-w-xl mx-auto">
              Describe any game you can imagine and watch AI build it <span className="text-cyan-400 font-bold">instantly</span>!
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-focus-within:opacity-60 blur transition-opacity" />
              <div className="relative flex items-center bg-slate-900/90 rounded-2xl border border-white/10">
                <Wand2 className="w-5 h-5 text-purple-400 ml-4 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder='Try "A space shooter destroying aliens" ...'
                  className="flex-1 bg-transparent text-white placeholder-white/30 px-4 py-4 text-base sm:text-lg outline-none"
                  disabled={isGenerating}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isGenerating || !prompt.trim()}
                  className="mr-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-40 disabled:hover:from-cyan-500 disabled:hover:to-purple-500 rounded-xl text-white font-bold text-sm transition-all shrink-0"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="inline-block"
                      >⚡</motion.span>
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Create Game
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </form>

          {/* Example prompts toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center gap-2 mx-auto text-purple-300/60 hover:text-purple-300 text-sm transition-colors"
            >
              <Brain className="w-4 h-4" />
              Need ideas? Try these examples
              <motion.span animate={{ rotate: showExamples ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>

            <AnimatePresence>
              {showExamples && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {EXAMPLE_PROMPTS.map((example, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleExampleClick(example.text)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-left transition-all group"
                      >
                        <span className="text-2xl shrink-0">{example.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-white/80 text-sm truncate group-hover:text-white transition-colors">{example.text}</div>
                          <div className="text-purple-400/50 text-xs">{example.category}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Generating Animation */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <div className="bg-slate-900/60 rounded-2xl p-6 border border-white/5">
                  <div className="flex flex-col items-center gap-4">
                    {/* Animated brain icon */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-6xl"
                    >
                      🧠
                    </motion.div>

                    {/* Step indicators */}
                    <div className="flex items-center gap-2 w-full max-w-sm">
                      {AI_MESSAGES.map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 flex-1 rounded-full overflow-hidden bg-slate-700"
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                            initial={{ width: '0%' }}
                            animate={{ width: i <= generatingStep ? '100%' : '0%' }}
                            transition={{ duration: 0.4 }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Current step text */}
                    <motion.p
                      key={generatingStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-purple-200/80 text-sm"
                    >
                      {AI_MESSAGES[generatingStep]}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Game Result */}
          <AnimatePresence>
            {gameConfig && !isGenerating && (
              <motion.div
                ref={resultRef}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', bounce: 0.3 }}
              >
                {/* Game info bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{gameConfig.player.emoji}</div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">{gameConfig.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          gameConfig.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          gameConfig.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {gameConfig.difficulty.toUpperCase()}
                        </span>
                        <span className="text-xs text-purple-300/50">{gameConfig.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {highScore > 0 && (
                      <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <span className="text-yellow-400 text-sm font-bold">🏆 {highScore}</span>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNewGame}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
                      title="New game"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Canvas Game */}
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                  <GameCanvas
                    config={gameConfig}
                    onScore={(s) => setHighScore(prev => Math.max(prev, s))}
                  />
                </div>

                {/* Controls hint */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-purple-300/40">
                  <span className="hidden sm:inline">⌨️ Arrow keys / WASD</span>
                  <span className="hidden sm:inline">•</span>
                  <span>📱 Tap or use buttons</span>
                  <span>•</span>
                  <span>Space to jump/flap</span>
                </div>

                {/* Try another prompt */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-center text-purple-300/40 text-xs mb-3">Want something different? Try another prompt!</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {EXAMPLE_PROMPTS
                      .filter(e => e.text !== prompt)
                      .sort(() => Math.random() - 0.5)
                      .slice(0, 4)
                      .map((example, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setPrompt(example.text);
                            generateGame(example.text);
                          }}
                          className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 text-xs border border-white/5 transition-all"
                        >
                          {example.emoji} {example.category}
                        </motion.button>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          {history.length > 1 && !isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-4 border-t border-white/5"
            >
              <p className="text-purple-300/40 text-xs mb-3 text-center">Recent creations</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {history.slice(1).map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(item.prompt);
                      setGameConfig(item.config);
                      setHighScore(0);
                    }}
                    className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm text-white/60 hover:text-white/80 transition-all"
                  >
                    <span>{item.config.player.emoji}</span>
                    <span className="max-w-[120px] truncate">{item.config.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {[
          { icon: <Zap className="w-3.5 h-3.5" />, text: "Instant Generation" },
          { icon: <Gamepad2 className="w-3.5 h-3.5" />, text: "8 Game Types" },
          { icon: <Sparkles className="w-3.5 h-3.5" />, text: "12 Themes" },
          { icon: <Share2 className="w-3.5 h-3.5" />, text: "Mobile Ready" },
        ].map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300/60"
          >
            {badge.icon}
            {badge.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
