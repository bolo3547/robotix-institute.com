'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, Star, Zap, Trophy, Play, 
  RotateCcw, ChevronRight,
  Palette, Shapes, Music, Gamepad2, Code, Brain
} from 'lucide-react';

// Age groups for the playground
const ageGroups = [
  { id: 'tiny', name: 'Tiny Tots', ages: '2-5', emoji: '🍼', color: 'from-pink-400 to-purple-400' },
  { id: 'explorer', name: 'Explorers', ages: '6-9', emoji: '🚀', color: 'from-blue-400 to-cyan-400' },
  { id: 'builder', name: 'Builders', ages: '10-13', emoji: '🔧', color: 'from-green-400 to-emerald-400' },
  { id: 'coder', name: 'Coders', ages: '14-18', emoji: '💻', color: 'from-orange-400 to-red-400' },
];

// ======================
// TINY TOTS GAMES (2-5)
// ======================

// Color Pop Game
function ColorPopGame() {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA'];
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);
  const [score, setScore] = useState(0);
  const [poppedId, setPoppedId] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bubbles.length < 8) {
        setBubbles(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 40 + 50,
        }]);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [bubbles.length]);

  const popBubble = (id: number) => {
    setPoppedId(id);
    setScore(s => s + 1);
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== id));
      setPoppedId(null);
    }, 200);
  };

  return (
    <div className="relative w-full h-80 bg-gradient-to-b from-sky-200 to-sky-100 rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-4 bg-white/80 rounded-full px-4 py-2 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        <span className="text-2xl font-bold text-purple-600">{score}</span>
      </div>
      {bubbles.map(bubble => (
        <motion.button
          key={bubble.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: poppedId === bubble.id ? 1.5 : 1, 
            opacity: poppedId === bubble.id ? 0 : 1 
          }}
          transition={{ type: 'spring', bounce: 0.6 }}
          onClick={() => popBubble(bubble.id)}
          className="absolute rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: bubble.size,
            height: bubble.size,
            background: `radial-gradient(circle at 30% 30%, white, ${bubble.color})`,
          }}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-lg font-bold text-purple-600">🎈 Pop the bubbles! 🎈</p>
      </div>
    </div>
  );
}

// Shape Matcher Game
function ShapeMatcherGame() {
  const shapes = [
    { name: 'circle', emoji: '🔴', color: 'bg-red-400' },
    { name: 'square', emoji: '🟦', color: 'bg-blue-400' },
    { name: 'triangle', emoji: '🔺', color: 'bg-yellow-400' },
    { name: 'star', emoji: '⭐', color: 'bg-purple-400' },
  ];
  const [target, setTarget] = useState(shapes[0]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const pickNewTarget = useCallback(() => {
    setTarget(shapes[Math.floor(Math.random() * shapes.length)]);
  }, []);

  const handlePick = (shape: typeof shapes[0]) => {
    if (shape.name === target.name) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
      pickNewTarget();
    }, 800);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl">
      <div className="text-center mb-6">
        <p className="text-xl font-bold text-purple-700 mb-2">Find the shape!</p>
        <motion.div 
          key={target.name}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-8xl"
        >
          {target.emoji}
        </motion.div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {shapes.map(shape => (
          <motion.button
            key={shape.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePick(shape)}
            className={`text-5xl p-4 rounded-2xl ${shape.color} shadow-lg`}
          >
            {shape.emoji}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <span className="text-9xl">
              {feedback === 'correct' ? '🎉' : '🤔'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 text-center">
        <span className="text-2xl font-bold text-purple-600">Score: {score} ⭐</span>
      </div>
    </div>
  );
}

// Animal Sounds Game
function AnimalSoundsGame() {
  const animals = [
    { name: 'Dog', emoji: '🐕', sound: 'Woof!', color: 'bg-amber-200' },
    { name: 'Cat', emoji: '🐱', sound: 'Meow!', color: 'bg-orange-200' },
    { name: 'Cow', emoji: '🐄', sound: 'Moo!', color: 'bg-green-200' },
    { name: 'Duck', emoji: '🦆', sound: 'Quack!', color: 'bg-yellow-200' },
    { name: 'Lion', emoji: '🦁', sound: 'Roar!', color: 'bg-orange-300' },
    { name: 'Frog', emoji: '🐸', sound: 'Ribbit!', color: 'bg-green-300' },
  ];
  const [activeAnimal, setActiveAnimal] = useState<string | null>(null);

  const playSound = (animal: typeof animals[0]) => {
    setActiveAnimal(animal.name);
    // In a real app, you'd play actual sounds here
    setTimeout(() => setActiveAnimal(null), 1000);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl">
      <p className="text-xl font-bold text-green-700 text-center mb-4">🎵 Tap an animal! 🎵</p>
      <div className="grid grid-cols-3 gap-4">
        {animals.map(animal => (
          <motion.button
            key={animal.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound(animal)}
            className={`${animal.color} p-4 rounded-2xl shadow-lg text-center relative overflow-hidden`}
          >
            <span className="text-5xl block mb-2">{animal.emoji}</span>
            <span className="font-bold text-gray-700">{animal.name}</span>
            <AnimatePresence>
              {activeAnimal === animal.name && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-2xl"
                >
                  <span className="text-2xl font-bold text-purple-600">{animal.sound}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Piano Keys Game
function PianoKeysGame() {
  const keys = [
    { note: 'C', color: 'bg-red-400', emoji: '🎵' },
    { note: 'D', color: 'bg-orange-400', emoji: '🎶' },
    { note: 'E', color: 'bg-yellow-400', emoji: '🎵' },
    { note: 'F', color: 'bg-green-400', emoji: '🎶' },
    { note: 'G', color: 'bg-blue-400', emoji: '🎵' },
    { note: 'A', color: 'bg-indigo-400', emoji: '🎶' },
    { note: 'B', color: 'bg-purple-400', emoji: '🎵' },
  ];
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [melody, setMelody] = useState<string[]>([]);

  const playKey = (note: string) => {
    setActiveKey(note);
    setMelody(prev => [...prev.slice(-7), note]);
    setTimeout(() => setActiveKey(null), 300);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl">
      <p className="text-xl font-bold text-purple-700 text-center mb-4">🎹 Play the Piano! 🎹</p>
      <div className="flex justify-center gap-1">
        {keys.map(key => (
          <motion.button
            key={key.note}
            whileTap={{ scale: 0.95, y: 5 }}
            onClick={() => playKey(key.note)}
            className={`${key.color} ${activeKey === key.note ? 'brightness-125 scale-105' : ''} w-12 h-32 rounded-b-xl shadow-lg flex flex-col items-center justify-end pb-3 transition-all`}
          >
            <span className="text-2xl">{activeKey === key.note ? key.emoji : ''}</span>
            <span className="font-bold text-white text-lg">{key.note}</span>
          </motion.button>
        ))}
      </div>
      {melody.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-purple-600 font-medium">Your melody:</p>
          <p className="text-2xl">{melody.join(' ')}</p>
        </div>
      )}
    </div>
  );
}

// Counting Stars Game
function CountingStarsGame() {
  const [target, setTarget] = useState(3);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateStars = useCallback(() => {
    const num = Math.floor(Math.random() * 5) + 1;
    setTarget(num);
    const newStars = [...Array(num)].map((_, i) => ({
      id: i,
      x: Math.random() * 70 + 10,
      y: Math.random() * 50 + 20,
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    generateStars();
  }, [generateStars]);

  const checkAnswer = (answer: number) => {
    if (answer === target) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
      generateStars();
    }, 1000);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold text-indigo-700">⭐ Count the Stars! ⭐</p>
        <span className="text-xl font-bold text-indigo-600">Score: {score}</span>
      </div>
      <div className="relative w-full h-40 bg-indigo-900 rounded-2xl overflow-hidden mb-4">
        {stars.map(star => (
          <motion.div
            key={star.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute text-4xl"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
          >
            ⭐
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map(num => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => checkAnswer(num)}
            className="w-14 h-14 bg-yellow-400 hover:bg-yellow-300 rounded-full text-2xl font-bold text-indigo-900 shadow-lg"
          >
            {num}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <span className="text-9xl">{feedback === 'correct' ? '🌟' : '🤔'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Color Painter Game
function ColorPainterGame() {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'];
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [grid, setGrid] = useState<string[][]>(
    Array(6).fill(null).map(() => Array(8).fill('#FFFFFF'))
  );

  const paintCell = (row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col] = selectedColor;
    setGrid(newGrid);
  };

  const clearCanvas = () => {
    setGrid(Array(6).fill(null).map(() => Array(8).fill('#FFFFFF')));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold text-rose-700">🎨 Paint a Picture! 🎨</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="px-4 py-2 bg-rose-500 text-white rounded-full font-bold text-sm"
        >
          Clear
        </motion.button>
      </div>
      <div className="flex justify-center gap-2 mb-4">
        {colors.map(color => (
          <motion.button
            key={color}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedColor(color)}
            className={`w-10 h-10 rounded-full shadow-lg ${selectedColor === color ? 'ring-4 ring-white ring-offset-2' : ''}`}
            style={{ backgroundColor: color }}
            title={`Select ${color}`}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      <div className="bg-white p-2 rounded-xl shadow-inner">
        {grid.map((row, i) => (
          <div key={i} className="flex justify-center">
            {row.map((cell, j) => (
              <motion.button
                key={`${i}-${j}`}
                whileTap={{ scale: 0.9 }}
                onClick={() => paintCell(i, j)}
                className="w-8 h-8 border border-gray-200"
                style={{ backgroundColor: cell }}
                title={`Paint cell ${i},${j}`}
                aria-label={`Paint cell row ${i} column ${j}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================
// EXPLORER GAMES (6-9)
// ======================

// Pattern Memory Game
function PatternMemoryGame() {
  const colors = ['red', 'blue', 'green', 'yellow'];
  const colorClasses: Record<string, string> = {
    red: 'bg-red-500 hover:bg-red-400',
    blue: 'bg-blue-500 hover:bg-blue-400',
    green: 'bg-green-500 hover:bg-green-400',
    yellow: 'bg-yellow-500 hover:bg-yellow-400',
  };
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'input' | 'won' | 'lost'>('idle');
  const [level, setLevel] = useState(0);

  const startGame = () => {
    const newSeq = [colors[Math.floor(Math.random() * 4)]];
    setSequence(newSeq);
    setPlayerSequence([]);
    setLevel(1);
    setGameState('showing');
    playSequence(newSeq);
  };

  const playSequence = async (seq: string[]) => {
    setIsPlaying(true);
    for (const color of seq) {
      await new Promise(r => setTimeout(r, 500));
      setActiveColor(color);
      await new Promise(r => setTimeout(r, 400));
      setActiveColor(null);
    }
    setIsPlaying(false);
    setGameState('input');
  };

  const handleColorClick = (color: string) => {
    if (gameState !== 'input' || isPlaying) return;
    
    const newPlayerSeq = [...playerSequence, color];
    setPlayerSequence(newPlayerSeq);
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setGameState('lost');
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      if (level >= 5) {
        setGameState('won');
      } else {
        const nextSeq = [...sequence, colors[Math.floor(Math.random() * 4)]];
        setSequence(nextSeq);
        setPlayerSequence([]);
        setLevel(l => l + 1);
        setGameState('showing');
        setTimeout(() => playSequence(nextSeq), 1000);
      }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">🧠 Memory Pattern</h3>
        {gameState === 'idle' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold"
          >
            Start Game!
          </motion.button>
        )}
        {gameState === 'showing' && <p className="text-yellow-400 font-bold">Watch carefully...</p>}
        {gameState === 'input' && <p className="text-green-400 font-bold">Your turn! Level {level}/5</p>}
        {gameState === 'won' && (
          <div>
            <p className="text-2xl mb-2">🎉 Amazing! You won! 🎉</p>
            <button onClick={startGame} className="text-white underline">Play again</button>
          </div>
        )}
        {gameState === 'lost' && (
          <div>
            <p className="text-xl mb-2">Oops! Try again! You reached level {level}</p>
            <button onClick={startGame} className="text-white underline">Play again</button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {colors.map(color => (
          <motion.button
            key={color}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleColorClick(color)}
            className={`h-24 rounded-2xl ${colorClasses[color]} ${
              activeColor === color ? 'ring-4 ring-white brightness-125' : ''
            } transition-all shadow-lg`}
            disabled={gameState !== 'input'}
          />
        ))}
      </div>
    </div>
  );
}

// Math Adventure Game
function MathAdventureGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState<'+' | '-'>('+');
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateQuestion = useCallback(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = Math.random() > 0.5 ? '+' : '-';
    const [n1, n2] = op === '-' ? [Math.max(a, b), Math.min(a, b)] : [a, b];
    
    setNum1(n1);
    setNum2(n2);
    setOperation(op);
    
    const correct = op === '+' ? n1 + n2 : n1 - n2;
    const wrongAnswers = [
      correct + Math.floor(Math.random() * 3) + 1,
      correct - Math.floor(Math.random() * 3) - 1,
      correct + Math.floor(Math.random() * 5) + 2,
    ].filter(n => n !== correct && n >= 0);
    
    const allOptions = [correct, ...wrongAnswers.slice(0, 3)];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const checkAnswer = (answer: number) => {
    const correct = operation === '+' ? num1 + num2 : num1 - num2;
    if (answer === correct) {
      setScore(s => s + 10 + streak * 5);
      setStreak(s => s + 1);
      setFeedback('correct');
    } else {
      setStreak(0);
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
      generateQuestion();
    }, 800);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(streak)].map((_, i) => (
            <Zap key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ))}
          {streak > 0 && <span className="text-sm ml-1">x{streak}</span>}
        </div>
      </div>
      
      <div className="text-center mb-6">
        <motion.div
          key={`${num1}${operation}${num2}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-5xl font-bold mb-2"
        >
          {num1} {operation} {num2} = ?
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => checkAnswer(opt)}
            className="p-4 bg-white/20 hover:bg-white/30 rounded-2xl text-3xl font-bold backdrop-blur-sm"
          >
            {opt}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <span className="text-9xl">
              {feedback === 'correct' ? '✨' : '💪'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Word Scramble Game
function WordScrambleGame() {
  const words = [
    { word: 'ROBOT', hint: '🤖' },
    { word: 'CODE', hint: '💻' },
    { word: 'STAR', hint: '⭐' },
    { word: 'GAME', hint: '🎮' },
    { word: 'MUSIC', hint: '🎵' },
    { word: 'SPACE', hint: '🚀' },
  ];
  
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const scrambleWord = useCallback((word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  }, []);

  const newWord = useCallback(() => {
    const word = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(word);
    setScrambled(scrambleWord(word.word));
    setGuess('');
  }, [scrambleWord]);

  useEffect(() => {
    newWord();
  }, []);

  const checkGuess = () => {
    if (guess.toUpperCase() === currentWord.word) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
      newWord();
    }, 1000);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">🔤 Word Scramble</h3>
        <span className="text-xl font-bold">Score: {score}</span>
      </div>
      <div className="text-center mb-6">
        <p className="text-lg mb-2">Hint: {currentWord.hint}</p>
        <motion.p
          key={scrambled}
          initial={{ rotateX: 90 }}
          animate={{ rotateX: 0 }}
          className="text-5xl font-bold tracking-widest"
        >
          {scrambled}
        </motion.p>
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
          placeholder="Type your answer..."
          title="Word guess input"
          className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 font-bold text-xl text-center focus:outline-none focus:ring-2 focus:ring-white"
          maxLength={10}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={checkGuess}
          className="px-6 py-3 bg-yellow-400 text-cyan-900 rounded-xl font-bold"
        >
          Check!
        </motion.button>
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <span className="text-9xl">{feedback === 'correct' ? '🎉' : '❌'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Catch Stars Game
function CatchStarsGame() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      if (stars.length < 6) {
        setStars(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 85 + 5,
          y: -10,
        }]);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [gameActive, stars.length]);

  useEffect(() => {
    if (!gameActive) return;
    const moveInterval = setInterval(() => {
      setStars(prev => prev
        .map(s => ({ ...s, y: s.y + 5 }))
        .filter(s => s.y < 100)
      );
    }, 100);
    return () => clearInterval(moveInterval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) setGameActive(false);
  }, [timeLeft]);

  const catchStar = (id: number) => {
    setStars(prev => prev.filter(s => s.id !== id));
    setScore(s => s + 1);
  };

  const startGame = () => {
    setStars([]);
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">⭐ Catch Stars!</h3>
        <div className="flex gap-4">
          <span className="font-bold">⏱️ {timeLeft}s</span>
          <span className="font-bold">Score: {score}</span>
        </div>
      </div>
      <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden">
        {!gameActive && timeLeft === 30 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={startGame}
              className="px-8 py-4 bg-yellow-400 text-purple-900 rounded-full font-bold text-xl"
            >
              Start Game!
            </motion.button>
          </div>
        )}
        {!gameActive && timeLeft === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold mb-4">Game Over! 🎮</p>
            <p className="text-xl mb-4">You caught {score} stars!</p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={startGame}
              className="px-6 py-3 bg-yellow-400 text-purple-900 rounded-full font-bold"
            >
              Play Again
            </motion.button>
          </div>
        )}
        {gameActive && stars.map(star => (
          <motion.button
            key={star.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => catchStar(star.id)}
            className="absolute text-4xl cursor-pointer hover:scale-125 transition-transform"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            title="Catch this star"
            aria-label="Catch falling star"
          >
            ⭐
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Typing Racer Game
function TypingRacerGame() {
  const words = ['robot', 'code', 'game', 'star', 'play', 'fun', 'learn', 'build', 'make', 'tech'];
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) setGameActive(false);
  }, [timeLeft]);

  const handleInput = (value: string) => {
    setInput(value);
    if (value.toLowerCase() === currentWord) {
      setScore(s => s + currentWord.length);
      setInput('');
      setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setInput('');
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    setGameActive(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">⌨️ Typing Racer</h3>
        <div className="flex gap-4">
          <span className="font-bold">⏱️ {timeLeft}s</span>
          <span className="font-bold">Score: {score}</span>
        </div>
      </div>
      {!gameActive ? (
        <div className="text-center py-8">
          {timeLeft === 0 && <p className="text-2xl font-bold mb-4">Final Score: {score}!</p>}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startGame}
            className="px-8 py-4 bg-white text-emerald-700 rounded-full font-bold text-xl"
          >
            {timeLeft === 0 ? 'Play Again' : 'Start Typing!'}
          </motion.button>
        </div>
      ) : (
        <div className="text-center">
          <motion.p
            key={currentWord}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold mb-6 tracking-wider"
          >
            {currentWord}
          </motion.p>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Type the word..."
            title="Type the word shown above"
            className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 font-bold text-2xl text-center focus:outline-none focus:ring-2 focus:ring-white"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}

// ======================
// BUILDER GAMES (10-13)
// ======================

// Block Code Puzzle
function BlockCodePuzzle() {
  const [blocks, setBlocks] = useState([
    { id: 1, text: 'Start', type: 'start', placed: true },
    { id: 2, text: 'Move Forward', type: 'action', placed: false },
    { id: 3, text: 'Turn Right', type: 'action', placed: false },
    { id: 4, text: 'Move Forward', type: 'action', placed: false },
    { id: 5, text: 'Pick Up Star ⭐', type: 'action', placed: false },
  ]);
  const [sequence, setSequence] = useState<number[]>([1]);
  const [robotPos, setRobotPos] = useState({ x: 0, y: 2, dir: 'right' });
  const [isRunning, setIsRunning] = useState(false);
  const [won, setWon] = useState(false);
  const starPos = { x: 2, y: 2 };

  const addBlock = (id: number) => {
    setSequence(prev => [...prev, id]);
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, placed: true } : b));
  };

  const removeBlock = (index: number) => {
    if (index === 0) return; // Can't remove start
    const blockId = sequence[index];
    setSequence(prev => prev.filter((_, i) => i !== index));
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, placed: false } : b));
  };

  const runCode = async () => {
    setIsRunning(true);
    setRobotPos({ x: 0, y: 2, dir: 'right' });
    setWon(false);
    
    let pos = { x: 0, y: 2, dir: 'right' };
    
    for (const blockId of sequence.slice(1)) {
      await new Promise(r => setTimeout(r, 600));
      const block = blocks.find(b => b.id === blockId);
      if (!block) continue;
      
      if (block.text === 'Move Forward') {
        if (pos.dir === 'right') pos.x = Math.min(3, pos.x + 1);
        else if (pos.dir === 'left') pos.x = Math.max(0, pos.x - 1);
        else if (pos.dir === 'up') pos.y = Math.max(0, pos.y - 1);
        else if (pos.dir === 'down') pos.y = Math.min(3, pos.y + 1);
      } else if (block.text === 'Turn Right') {
        const dirs = ['up', 'right', 'down', 'left'];
        const idx = dirs.indexOf(pos.dir);
        pos.dir = dirs[(idx + 1) % 4];
      } else if (block.text.includes('Star')) {
        if (pos.x === starPos.x && pos.y === starPos.y) {
          setWon(true);
        }
      }
      setRobotPos({ ...pos });
    }
    setIsRunning(false);
  };

  const reset = () => {
    setSequence([1]);
    setBlocks(prev => prev.map(b => b.id === 1 ? b : { ...b, placed: false }));
    setRobotPos({ x: 0, y: 2, dir: 'right' });
    setWon(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-cyan-900 to-blue-900 rounded-3xl">
      <h3 className="text-xl font-bold text-white mb-4 text-center">🤖 Code the Robot!</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Grid */}
        <div className="bg-slate-800 p-2 rounded-xl">
          <div className="grid grid-cols-4 gap-1">
            {[...Array(16)].map((_, i) => {
              const x = i % 4;
              const y = Math.floor(i / 4);
              const isRobot = robotPos.x === x && robotPos.y === y;
              const isStar = starPos.x === x && starPos.y === y && !won;
              
              return (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                    isRobot ? 'bg-green-500' : 'bg-slate-700'
                  }`}
                >
                  {isRobot && (
                    <span style={{ transform: `rotate(${
                      robotPos.dir === 'up' ? -90 : 
                      robotPos.dir === 'down' ? 90 : 
                      robotPos.dir === 'left' ? 180 : 0
                    }deg)` }}>🤖</span>
                  )}
                  {isStar && '⭐'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Code blocks */}
        <div className="space-y-2">
          <p className="text-white text-sm font-medium">Available blocks:</p>
          {blocks.filter(b => !b.placed && b.type !== 'start').map(block => (
            <motion.button
              key={block.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addBlock(block.id)}
              className="w-full p-2 bg-orange-500 hover:bg-orange-400 rounded-lg text-white text-sm font-medium text-left"
            >
              {block.text}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sequence */}
      <div className="mt-4 p-3 bg-slate-800 rounded-xl">
        <p className="text-white text-sm mb-2">Your code:</p>
        <div className="flex flex-wrap gap-2">
          {sequence.map((id, i) => {
            const block = blocks.find(b => b.id === id);
            return (
              <motion.button
                key={i}
                onClick={() => removeBlock(i)}
                className={`px-3 py-1 rounded-lg text-white text-sm ${
                  i === 0 ? 'bg-green-600' : 'bg-orange-500 hover:bg-red-500'
                }`}
                title={i > 0 ? 'Click to remove' : ''}
              >
                {block?.text}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runCode}
          disabled={isRunning}
          className="px-6 py-2 bg-green-500 hover:bg-green-400 rounded-full text-white font-bold flex items-center gap-2"
        >
          <Play className="w-5 h-5" /> Run
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-full text-white font-bold flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Reset
        </motion.button>
      </div>

      {won && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 text-center text-2xl text-yellow-400 font-bold"
        >
          🎉 You did it! The robot got the star! 🎉
        </motion.div>
      )}
    </div>
  );
}

// Pixel Art Creator
function PixelArtCreator() {
  const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
  const [selectedColor, setSelectedColor] = useState(colors[2]);
  const [grid, setGrid] = useState<string[][]>(
    Array(12).fill(null).map(() => Array(12).fill('#EEEEEE'))
  );
  const [isDrawing, setIsDrawing] = useState(false);

  const paintCell = (row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col] = selectedColor;
    setGrid(newGrid);
  };

  const clearCanvas = () => {
    setGrid(Array(12).fill(null).map(() => Array(12).fill('#EEEEEE')));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">🎨 Pixel Art Studio</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm"
        >
          Clear
        </motion.button>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {colors.map(color => (
          <motion.button
            key={color}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-lg shadow-lg ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-purple-700' : ''}`}
            style={{ backgroundColor: color }}
            title={`Select ${color}`}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      <div className="bg-white p-1 rounded-lg shadow-inner inline-block mx-auto">
        {grid.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <motion.div
                key={`${i}-${j}`}
                onMouseDown={() => { setIsDrawing(true); paintCell(i, j); }}
                onMouseEnter={() => isDrawing && paintCell(i, j)}
                onMouseUp={() => setIsDrawing(false)}
                className="w-5 h-5 border border-gray-300 cursor-crosshair"
                style={{ backgroundColor: cell }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Logic Gate Puzzle
function LogicGatePuzzle() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [inputs, setInputs] = useState({ a: false, b: false });

  const puzzles = [
    { gate: 'AND', symbol: '&&', description: 'Both inputs must be TRUE', fn: (a: boolean, b: boolean) => a && b },
    { gate: 'OR', symbol: '||', description: 'At least one input must be TRUE', fn: (a: boolean, b: boolean) => a || b },
    { gate: 'XOR', symbol: '⊕', description: 'Exactly one input must be TRUE', fn: (a: boolean, b: boolean) => (a && !b) || (!a && b) },
    { gate: 'NAND', symbol: '!&', description: 'NOT both inputs TRUE', fn: (a: boolean, b: boolean) => !(a && b) },
  ];

  const puzzle = puzzles[puzzleIndex];
  const output = puzzle.fn(inputs.a, inputs.b);

  const toggleInput = (input: 'a' | 'b') => {
    setInputs(prev => ({ ...prev, [input]: !prev[input] }));
  };

  const nextPuzzle = () => {
    setPuzzleIndex((puzzleIndex + 1) % puzzles.length);
    setInputs({ a: false, b: false });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">🔌 Logic Gates</h3>
        <span className="px-3 py-1 bg-purple-500 rounded-full font-bold">{puzzle.gate}</span>
      </div>
      <p className="text-center text-slate-300 mb-4">{puzzle.description}</p>
      
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">Input A</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleInput('a')}
            className={`w-16 h-16 rounded-xl font-bold text-2xl ${inputs.a ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {inputs.a ? '1' : '0'}
          </motion.button>
        </div>
        
        <div className="text-4xl font-bold text-purple-400">{puzzle.symbol}</div>
        
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">Input B</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleInput('b')}
            className={`w-16 h-16 rounded-xl font-bold text-2xl ${inputs.b ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {inputs.b ? '1' : '0'}
          </motion.button>
        </div>
        
        <div className="text-3xl">=</div>
        
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">Output</p>
          <motion.div
            key={String(output)}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`w-16 h-16 rounded-xl font-bold text-2xl flex items-center justify-center ${output ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {output ? '1' : '0'}
          </motion.div>
        </div>
      </div>
      
      <div className="text-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextPuzzle}
          className="px-6 py-2 bg-purple-500 hover:bg-purple-400 rounded-full font-bold"
        >
          Next Gate →
        </motion.button>
      </div>
    </div>
  );
}

// Bug Hunter Game
function BugHunterGame() {
  const [bugIndex, setBugIndex] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const bugs = [
    {
      code: ['let sum = 0;', 'for (let i = 1; i <= 5; i++) {', '  sum = sum + 1;', '}', 'console.log(sum);'],
      bugLine: 2,
      hint: 'The loop should add i, not 1',
      fix: '  sum = sum + i;'
    },
    {
      code: ['function greet(name) {', '  return "Hello, " + Name;', '}', 'console.log(greet("World"));'],
      bugLine: 1,
      hint: 'JavaScript is case-sensitive!',
      fix: '  return "Hello, " + name;'
    },
    {
      code: ['let numbers = [1, 2, 3];', 'let first = numbers[1];', 'console.log(first);'],
      bugLine: 1,
      hint: 'Arrays start at index 0',
      fix: 'let first = numbers[0];'
    },
  ];

  const bug = bugs[bugIndex];

  const checkLine = (lineIndex: number) => {
    setSelectedLine(lineIndex);
    if (lineIndex === bug.bugLine) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
      if (lineIndex === bug.bugLine) {
        setBugIndex((bugIndex + 1) % bugs.length);
        setSelectedLine(null);
      }
    }, 1500);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-red-900 to-orange-900 rounded-3xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">🐛 Bug Hunter</h3>
        <span className="font-bold">Score: {score}</span>
      </div>
      <p className="text-center text-orange-200 mb-4">Find the bug! Click the line with the error.</p>
      
      <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm mb-4">
        {bug.code.map((line, i) => (
          <motion.button
            key={i}
            whileHover={{ x: 5 }}
            onClick={() => checkLine(i)}
            className={`block w-full text-left px-3 py-1 rounded ${
              selectedLine === i
                ? feedback === 'correct' ? 'bg-green-500/30' : 'bg-red-500/30'
                : 'hover:bg-white/10'
            }`}
          >
            <span className="text-slate-500 mr-3">{i + 1}</span>
            <span className="text-green-400">{line}</span>
          </motion.button>
        ))}
      </div>

      {feedback === 'correct' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-500/20 text-green-400 p-3 rounded-lg text-center"
        >
          ✅ Correct! Fix: <code className="bg-black/30 px-2 rounded">{bug.fix}</code>
        </motion.div>
      )}
      {feedback === 'wrong' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/20 text-red-400 p-3 rounded-lg text-center"
        >
          ❌ Not quite. Hint: {bug.hint}
        </motion.div>
      )}
    </div>
  );
}

// ======================
// CODER GAMES (14-18)
// ======================

// Code Challenge
function CodeChallenge() {
  const challenges = [
    {
      title: 'Hello World',
      description: 'Write a function that returns "Hello, World!"',
      template: 'function greet() {\n  // Your code here\n  \n}',
      solution: 'return "Hello, World!"',
      test: (code: string) => code.includes('return') && code.includes('Hello, World!'),
    },
    {
      title: 'Double It',
      description: 'Write a function that doubles a number',
      template: 'function double(n) {\n  // Your code here\n  \n}',
      solution: 'return n * 2',
      test: (code: string) => code.includes('return') && (code.includes('n * 2') || code.includes('n*2') || code.includes('2 * n') || code.includes('2*n')),
    },
    {
      title: 'Is Even?',
      description: 'Return true if the number is even, false otherwise',
      template: 'function isEven(n) {\n  // Your code here\n  \n}',
      solution: 'return n % 2 === 0',
      test: (code: string) => code.includes('return') && code.includes('%') && code.includes('2'),
    },
  ];

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [code, setCode] = useState(challenges[0].template);
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [completed, setCompleted] = useState<number[]>([]);

  const challenge = challenges[currentChallenge];

  const checkSolution = () => {
    if (challenge.test(code)) {
      setResult('correct');
      if (!completed.includes(currentChallenge)) {
        setCompleted(prev => [...prev, currentChallenge]);
      }
    } else {
      setResult('wrong');
    }
  };

  const nextChallenge = () => {
    const next = (currentChallenge + 1) % challenges.length;
    setCurrentChallenge(next);
    setCode(challenges[next].template);
    setResult('idle');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">💻 Code Challenge</h3>
        <div className="flex gap-1">
          {challenges.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                completed.includes(i) ? 'bg-green-500' : 
                i === currentChallenge ? 'bg-blue-500' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-sm text-blue-400 font-medium">Challenge {currentChallenge + 1}:</span>
        <h4 className="text-lg font-bold text-white">{challenge.title}</h4>
        <p className="text-slate-400">{challenge.description}</p>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 p-4 bg-slate-950 text-green-400 font-mono text-sm rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
        spellCheck={false}
        placeholder="Write your code here..."
        title="Code editor"
        aria-label="Code editor for challenge"
      />

      {result !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 p-3 rounded-lg ${
            result === 'correct' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {result === 'correct' ? (
            <span>✅ Correct! Great job!</span>
          ) : (
            <span>❌ Not quite. Hint: {challenge.solution}</span>
          )}
        </motion.div>
      )}

      <div className="mt-4 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkSolution}
          className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold"
        >
          Check Solution
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextChallenge}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium"
        >
          Next →
        </motion.button>
      </div>
    </div>
  );
}

// Algorithm Sorter Game
function AlgorithmSorterGame() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [sorted, setSorted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);

  const generateNumbers = useCallback(() => {
    const nums = Array.from({ length: 5 }, () => Math.floor(Math.random() * 99) + 1);
    setNumbers(nums);
    setSorted(false);
    setMoves(0);
  }, []);

  useEffect(() => {
    generateNumbers();
  }, [generateNumbers]);

  const swapNumbers = (i: number) => {
    if (i >= numbers.length - 1) return;
    const newNumbers = [...numbers];
    [newNumbers[i], newNumbers[i + 1]] = [newNumbers[i + 1], newNumbers[i]];
    setNumbers(newNumbers);
    setMoves(m => m + 1);

    // Check if sorted
    const isSorted = newNumbers.every((n, idx) => idx === 0 || newNumbers[idx - 1] <= n);
    if (isSorted) {
      setSorted(true);
      setScore(s => s + Math.max(50 - moves * 5, 10));
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-3xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">📊 Sort the Numbers</h3>
        <div className="flex gap-4 text-sm">
          <span>Moves: {moves}</span>
          <span>Score: {score}</span>
        </div>
      </div>
      <p className="text-center text-blue-200 mb-4">Click between numbers to swap them. Sort from smallest to largest!</p>
      
      <div className="flex items-center justify-center gap-1 mb-6">
        {numbers.map((num, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              layout
              className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg"
            >
              {num}
            </motion.div>
            {i < numbers.length - 1 && (
              <motion.button
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => swapNumbers(i)}
                className="w-8 h-8 mx-1 bg-yellow-400 hover:bg-yellow-300 text-blue-900 rounded-full font-bold text-lg"
                disabled={sorted}
                title={`Swap positions ${i} and ${i + 1}`}
                aria-label={`Swap numbers at positions ${i} and ${i + 1}`}
              >
                ⇄
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {sorted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-green-400 mb-4">🎉 Sorted in {moves} moves!</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={generateNumbers}
            className="px-6 py-2 bg-green-500 rounded-full font-bold"
          >
            Next Challenge
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// API Builder Game
function APIBuilderGame() {
  const [endpoint, setEndpoint] = useState('/api/');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState<null | { status: number; data: Record<string, unknown> }>(null);
  const [score, setScore] = useState(0);

  const endpoints = [
    { path: '/api/users', methods: ['GET', 'POST'], data: { users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] } },
    { path: '/api/products', methods: ['GET'], data: { products: [{ id: 1, name: 'Robot Kit', price: 99 }] } },
    { path: '/api/orders', methods: ['GET', 'POST', 'DELETE'], data: { orders: [] } },
  ];

  const sendRequest = () => {
    const ep = endpoints.find(e => endpoint.startsWith(e.path));
    if (ep && ep.methods.includes(method)) {
      setResponse({ status: 200, data: ep.data });
      setScore(s => s + 5);
    } else if (ep) {
      setResponse({ status: 405, data: { error: 'Method not allowed' } });
    } else {
      setResponse({ status: 404, data: { error: 'Not found' } });
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">🔗 API Explorer</h3>
        <span className="font-bold">Score: {score}</span>
      </div>
      
      <div className="bg-slate-900 rounded-xl p-4 mb-4">
        <div className="flex gap-2 mb-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 bg-slate-800 rounded-lg font-mono font-bold text-green-400"
            title="HTTP Method"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/api/..."
            title="API endpoint"
            className="flex-1 px-3 py-2 bg-slate-800 rounded-lg font-mono text-white"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={sendRequest}
            className="px-4 py-2 bg-green-500 rounded-lg font-bold"
          >
            Send
          </motion.button>
        </div>
        
        <p className="text-sm text-slate-400 mb-2">Try: /api/users, /api/products, /api/orders</p>
      </div>

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-sm font-bold ${
              response.status === 200 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {response.status}
            </span>
            <span className="text-slate-400 text-sm">Response</span>
          </div>
          <pre className="text-green-400 text-sm font-mono overflow-x-auto">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </motion.div>
      )}
    </div>
  );
}

// Regex Tester Game
function RegexTesterGame() {
  const challenges = [
    { pattern: '\\d+', description: 'Match any digits', test: '123', noMatch: 'abc' },
    { pattern: '[a-z]+', description: 'Match lowercase letters', test: 'hello', noMatch: '123' },
    { pattern: '^Hello', description: 'Match strings starting with "Hello"', test: 'Hello World', noMatch: 'World Hello' },
    { pattern: '\\w+@\\w+', description: 'Match simple email pattern', test: 'test@email', noMatch: 'no-email' },
  ];

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userPattern, setUserPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const challenge = challenges[challengeIndex];

  const testPattern = () => {
    try {
      const regex = new RegExp(userPattern);
      const matches = regex.test(testString);
      setResult(matches);
      if (matches && userPattern === challenge.pattern) {
        setScore(s => s + 10);
      }
    } catch {
      setResult(false);
    }
  };

  const nextChallenge = () => {
    setChallengeIndex((challengeIndex + 1) % challenges.length);
    setUserPattern('');
    setTestString('');
    setResult(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-800 to-rose-900 rounded-3xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">🎯 Regex Tester</h3>
        <span className="font-bold">Score: {score}</span>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 mb-4">
        <p className="text-sm text-pink-200 mb-2">Challenge: {challenge.description}</p>
        <p className="text-xs text-slate-400 mb-3">
          Try: <code className="bg-black/30 px-1 rounded">{challenge.pattern}</code> with &quot;{challenge.test}&quot;
        </p>
        
        <div className="space-y-3">
          <input
            type="text"
            value={userPattern}
            onChange={(e) => setUserPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            title="Regex pattern"
            className="w-full px-3 py-2 bg-slate-800 rounded-lg font-mono text-pink-400"
          />
          <input
            type="text"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter test string..."
            title="Test string"
            className="w-full px-3 py-2 bg-slate-800 rounded-lg font-mono text-white"
          />
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={testPattern}
              className="flex-1 py-2 bg-pink-500 rounded-lg font-bold"
            >
              Test Pattern
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={nextChallenge}
              className="px-4 py-2 bg-slate-700 rounded-lg font-bold"
            >
              Next →
            </motion.button>
          </div>
        </div>
      </div>

      {result !== null && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`p-3 rounded-lg text-center font-bold ${
            result ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {result ? '✅ Match found!' : '❌ No match'}
        </motion.div>
      )}
    </div>
  );
}

// ======================
// MAIN PAGE
// ======================

export default function PlaygroundPage() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const games: Record<string, Array<{ name: string; icon: React.ReactNode; component: React.ReactNode }>> = {
    tiny: [
      { name: 'Bubble Pop', icon: <Sparkles className="w-6 h-6" />, component: <ColorPopGame /> },
      { name: 'Shape Match', icon: <Shapes className="w-6 h-6" />, component: <ShapeMatcherGame /> },
      { name: 'Animal Sounds', icon: <Music className="w-6 h-6" />, component: <AnimalSoundsGame /> },
      { name: 'Piano Keys', icon: <Music className="w-6 h-6" />, component: <PianoKeysGame /> },
      { name: 'Count Stars', icon: <Star className="w-6 h-6" />, component: <CountingStarsGame /> },
      { name: 'Color Paint', icon: <Palette className="w-6 h-6" />, component: <ColorPainterGame /> },
    ],
    explorer: [
      { name: 'Memory Pattern', icon: <Brain className="w-6 h-6" />, component: <PatternMemoryGame /> },
      { name: 'Math Adventure', icon: <Zap className="w-6 h-6" />, component: <MathAdventureGame /> },
      { name: 'Word Scramble', icon: <Sparkles className="w-6 h-6" />, component: <WordScrambleGame /> },
      { name: 'Catch Stars', icon: <Star className="w-6 h-6" />, component: <CatchStarsGame /> },
      { name: 'Typing Racer', icon: <Zap className="w-6 h-6" />, component: <TypingRacerGame /> },
    ],
    builder: [
      { name: 'Robot Code', icon: <Gamepad2 className="w-6 h-6" />, component: <BlockCodePuzzle /> },
      { name: 'Pixel Art', icon: <Palette className="w-6 h-6" />, component: <PixelArtCreator /> },
      { name: 'Logic Gates', icon: <Brain className="w-6 h-6" />, component: <LogicGatePuzzle /> },
      { name: 'Bug Hunter', icon: <Code className="w-6 h-6" />, component: <BugHunterGame /> },
    ],
    coder: [
      { name: 'Code Challenge', icon: <Code className="w-6 h-6" />, component: <CodeChallenge /> },
      { name: 'Sort Algorithm', icon: <Brain className="w-6 h-6" />, component: <AlgorithmSorterGame /> },
      { name: 'API Explorer', icon: <Zap className="w-6 h-6" />, component: <APIBuilderGame /> },
      { name: 'Regex Tester', icon: <Code className="w-6 h-6" />, component: <RegexTesterGame /> },
    ],
  };

  const [activeGame, setActiveGame] = useState(0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4 text-center relative overflow-hidden">
        {/* Floating decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              {['⭐', '🚀', '🎮', '🤖', '💡', '🎨', '🔮', '✨'][i % 8]}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-4">
            🎮 Fun Zone 🎮
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-2xl mx-auto">
            Games and activities for everyone, from tiny tots to teen coders!
          </p>
        </motion.div>
      </section>

      {/* Age Selector */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-white text-xl mb-6">🎂 How old are you?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ageGroups.map((group, i) => (
              <motion.button
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedAge(group.id); setActiveGame(0); }}
                className={`p-6 rounded-3xl bg-gradient-to-br ${group.color} text-white text-center shadow-xl ${
                  selectedAge === group.id ? 'ring-4 ring-white ring-offset-4 ring-offset-purple-950' : ''
                }`}
              >
                <span className="text-5xl block mb-2">{group.emoji}</span>
                <span className="font-bold text-lg block">{group.name}</span>
                <span className="text-white/80 text-sm">{group.ages} years</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <AnimatePresence mode="wait">
        {selectedAge && (
          <motion.section
            key={selectedAge}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="px-4 pb-20"
          >
            <div className="max-w-4xl mx-auto">
              {/* Game selector tabs */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {games[selectedAge]?.map((game, i) => (
                  <motion.button
                    key={game.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame(i)}
                    className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
                      activeGame === i
                        ? 'bg-white text-purple-900 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {game.icon}
                    {game.name}
                  </motion.button>
                ))}
              </div>

              {/* Active game */}
              <motion.div
                key={activeGame}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {games[selectedAge]?.[activeGame]?.component}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              🌟 Want to learn more? 🌟
            </h2>
            <p className="text-purple-100 mb-6">
              Join our coding and robotics programs and build amazing things!
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-full hover:bg-purple-100 transition-colors text-lg"
            >
              Explore Programs <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
