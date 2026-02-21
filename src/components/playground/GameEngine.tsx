'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// ===========================
// GAME CONFIG TYPES
// ===========================

export interface GameConfig {
  type: 'platformer' | 'catcher' | 'shooter' | 'racer' | 'breakout' | 'runner' | 'pong' | 'flappy';
  theme: {
    name: string;
    bg1: string;
    bg2: string;
    playerColor: string;
    enemyColor: string;
    accentColor: string;
    particleColor: string;
  };
  player: {
    emoji: string;
    size: number;
    speed: number;
  };
  enemies: {
    emoji: string;
    speed: number;
    spawnRate: number;
  };
  collectibles: {
    emoji: string;
    points: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
}

// ===========================
// PROMPT PARSER — The "AI"
// ===========================

const GAME_TYPE_KEYWORDS: Record<GameConfig['type'], string[]> = {
  platformer: ['platformer', 'jump', 'jumping', 'mario', 'dino', 'hop', 'bounce', 'platform'],
  catcher: ['catch', 'catcher', 'catching', 'collect', 'collecting', 'basket', 'falling', 'grab'],
  shooter: ['shoot', 'shooter', 'shooting', 'space invader', 'blast', 'laser', 'destroy', 'attack', 'bullet', 'fire'],
  racer: ['race', 'racing', 'racer', 'car', 'drive', 'driving', 'road', 'dodge', 'highway', 'fast'],
  breakout: ['breakout', 'brick', 'breaker', 'pong ball', 'paddle', 'blocks', 'arkanoid', 'smash'],
  runner: ['run', 'runner', 'running', 'endless', 'obstacle', 'hurdle', 'sprint', 'dash'],
  pong: ['pong', 'tennis', 'ping', 'table tennis', 'bat', 'paddle game', 'rally'],
  flappy: ['flappy', 'bird', 'fly', 'flying', 'pipe', 'wing', 'flap', 'soar', 'glide'],
};

const THEME_KEYWORDS: Record<string, Partial<GameConfig['theme']> & { emojis: { player: string; enemy: string; collectible: string } }> = {
  space: {
    name: 'Space', bg1: '#0a0a2e', bg2: '#1a1a4e',
    playerColor: '#00d4ff', enemyColor: '#ff4444', accentColor: '#ffdd44', particleColor: '#88ccff',
    emojis: { player: '🚀', enemy: '☄️', collectible: '⭐' },
  },
  ocean: {
    name: 'Ocean', bg1: '#003366', bg2: '#006699',
    playerColor: '#00ccff', enemyColor: '#ff6633', accentColor: '#ffcc00', particleColor: '#66ddff',
    emojis: { player: '🐠', enemy: '🦈', collectible: '🐚' },
  },
  forest: {
    name: 'Forest', bg1: '#1a3300', bg2: '#2d5500',
    playerColor: '#66cc33', enemyColor: '#cc3300', accentColor: '#ffcc00', particleColor: '#99ee66',
    emojis: { player: '🦊', enemy: '🐺', collectible: '🍎' },
  },
  candy: {
    name: 'Candy Land', bg1: '#4a0033', bg2: '#800055',
    playerColor: '#ff66cc', enemyColor: '#ff3333', accentColor: '#ffdd00', particleColor: '#ff99dd',
    emojis: { player: '🧁', enemy: '🍬', collectible: '🍭' },
  },
  ninja: {
    name: 'Ninja', bg1: '#1a0a1a', bg2: '#2d1a2d',
    playerColor: '#cc00ff', enemyColor: '#ff0044', accentColor: '#00ff88', particleColor: '#dd66ff',
    emojis: { player: '🥷', enemy: '👹', collectible: '⚔️' },
  },
  robot: {
    name: 'Robot Factory', bg1: '#1a1a2e', bg2: '#2d2d4e',
    playerColor: '#00ffcc', enemyColor: '#ff4400', accentColor: '#ffee00', particleColor: '#66ffdd',
    emojis: { player: '🤖', enemy: '⚙️', collectible: '🔋' },
  },
  dinosaur: {
    name: 'Dino World', bg1: '#2d2200', bg2: '#4a3800',
    playerColor: '#88cc00', enemyColor: '#cc4400', accentColor: '#ffaa00', particleColor: '#aaee44',
    emojis: { player: '🦕', enemy: '🌋', collectible: '🥚' },
  },
  pirate: {
    name: 'Pirate Sea', bg1: '#1a2a3a', bg2: '#2a3a5a',
    playerColor: '#ffcc00', enemyColor: '#ff3333', accentColor: '#00ccff', particleColor: '#ffdd66',
    emojis: { player: '🏴‍☠️', enemy: '🐙', collectible: '💰' },
  },
  zombie: {
    name: 'Zombie Run', bg1: '#1a1a0a', bg2: '#2d2d1a',
    playerColor: '#00ff44', enemyColor: '#884400', accentColor: '#ff0000', particleColor: '#66ff88',
    emojis: { player: '🧟', enemy: '💀', collectible: '💊' },
  },
  superhero: {
    name: 'Hero City', bg1: '#0a0a3a', bg2: '#1a1a5a',
    playerColor: '#ff4444', enemyColor: '#8800cc', accentColor: '#ffdd00', particleColor: '#ff8888',
    emojis: { player: '🦸', enemy: '🦹', collectible: '💎' },
  },
  winter: {
    name: 'Winter', bg1: '#1a2a3a', bg2: '#3a4a6a',
    playerColor: '#88ccff', enemyColor: '#ff4466', accentColor: '#ffffff', particleColor: '#aaddff',
    emojis: { player: '⛷️', enemy: '❄️', collectible: '🎁' },
  },
  desert: {
    name: 'Desert', bg1: '#3a2a0a', bg2: '#5a4a1a',
    playerColor: '#ffcc44', enemyColor: '#cc3300', accentColor: '#00ccff', particleColor: '#ffdd88',
    emojis: { player: '🐫', enemy: '🦂', collectible: '💧' },
  },
};

const DIFFICULTY_KEYWORDS: Record<string, GameConfig['difficulty']> = {
  easy: 'easy', simple: 'easy', beginner: 'easy', chill: 'easy', slow: 'easy', kid: 'easy',
  medium: 'medium', normal: 'medium', moderate: 'medium', regular: 'medium',
  hard: 'hard', difficult: 'hard', extreme: 'hard', impossible: 'hard', fast: 'hard', insane: 'hard', crazy: 'hard',
};

export function parsePrompt(prompt: string): GameConfig {
  const lower = prompt.toLowerCase();

  // Detect game type
  let detectedType: GameConfig['type'] = 'runner'; // default
  let bestScore = 0;
  for (const [type, keywords] of Object.entries(GAME_TYPE_KEYWORDS)) {
    const score = keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      detectedType = type as GameConfig['type'];
    }
  }

  // Detect theme
  let detectedTheme = THEME_KEYWORDS.space;
  let themeKey = 'space';
  for (const [key, theme] of Object.entries(THEME_KEYWORDS)) {
    if (lower.includes(key) || (theme.name && lower.includes(theme.name.toLowerCase()))) {
      detectedTheme = theme;
      themeKey = key;
      break;
    }
  }
  // Extra keyword matching for themes
  if (lower.match(/sea|water|fish|underwater|swim/)) { detectedTheme = THEME_KEYWORDS.ocean; themeKey = 'ocean'; }
  if (lower.match(/tree|animal|jungle|wild/)) { detectedTheme = THEME_KEYWORDS.forest; themeKey = 'forest'; }
  if (lower.match(/sweet|cake|cookie|sugar/)) { detectedTheme = THEME_KEYWORDS.candy; themeKey = 'candy'; }
  if (lower.match(/mech|metal|factory|cyber/)) { detectedTheme = THEME_KEYWORDS.robot; themeKey = 'robot'; }
  if (lower.match(/dino|prehistoric|jurassic|t-rex/)) { detectedTheme = THEME_KEYWORDS.dinosaur; themeKey = 'dinosaur'; }
  if (lower.match(/ship|treasure|sail|island/)) { detectedTheme = THEME_KEYWORDS.pirate; themeKey = 'pirate'; }
  if (lower.match(/undead|apocalypse|survive|brain/)) { detectedTheme = THEME_KEYWORDS.zombie; themeKey = 'zombie'; }
  if (lower.match(/hero|power|cape|villain|save/)) { detectedTheme = THEME_KEYWORDS.superhero; themeKey = 'superhero'; }
  if (lower.match(/snow|ice|cold|frozen|christmas/)) { detectedTheme = THEME_KEYWORDS.winter; themeKey = 'winter'; }
  if (lower.match(/sand|cactus|hot|dry|pyramid/)) { detectedTheme = THEME_KEYWORDS.desert; themeKey = 'desert'; }
  if (lower.match(/star|alien|galaxy|planet|meteor|asteroid|rocket|moon/)) { detectedTheme = THEME_KEYWORDS.space; themeKey = 'space'; }

  // Detect difficulty
  let difficulty: GameConfig['difficulty'] = 'medium';
  for (const [word, diff] of Object.entries(DIFFICULTY_KEYWORDS)) {
    if (lower.includes(word)) { difficulty = diff; break; }
  }

  // Detect custom emojis from prompt
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const foundEmojis = prompt.match(emojiRegex) || [];

  const playerEmoji = foundEmojis[0] || detectedTheme.emojis.player;
  const enemyEmoji = foundEmojis[1] || detectedTheme.emojis.enemy;
  const collectibleEmoji = foundEmojis[2] || detectedTheme.emojis.collectible;

  // Speed/spawn tuning by difficulty
  const speedMultiplier = difficulty === 'easy' ? 0.7 : difficulty === 'hard' ? 1.5 : 1;
  const spawnMultiplier = difficulty === 'easy' ? 0.6 : difficulty === 'hard' ? 1.8 : 1;

  return {
    type: detectedType,
    theme: {
      name: detectedTheme.name || themeKey,
      bg1: detectedTheme.bg1 || '#0a0a2e',
      bg2: detectedTheme.bg2 || '#1a1a4e',
      playerColor: detectedTheme.playerColor || '#00d4ff',
      enemyColor: detectedTheme.enemyColor || '#ff4444',
      accentColor: detectedTheme.accentColor || '#ffdd44',
      particleColor: detectedTheme.particleColor || '#88ccff',
    },
    player: {
      emoji: playerEmoji,
      size: 32,
      speed: 5 * speedMultiplier,
    },
    enemies: {
      emoji: enemyEmoji,
      speed: 3 * speedMultiplier,
      spawnRate: 60 / spawnMultiplier,
    },
    collectibles: {
      emoji: collectibleEmoji,
      points: 10,
    },
    difficulty,
    title: `${detectedTheme.name} ${detectedType.charAt(0).toUpperCase() + detectedType.slice(1)}`,
    description: prompt,
  };
}

// ===========================
// CANVAS GAME ENGINE
// ===========================

interface Entity {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  type: 'player' | 'enemy' | 'collectible' | 'bullet' | 'platform' | 'brick' | 'ball' | 'pipe';
  emoji?: string;
  color?: string;
  active: boolean;
  hp?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface GameState {
  entities: Entity[];
  particles: Particle[];
  score: number;
  lives: number;
  gameOver: boolean;
  started: boolean;
  frame: number;
  keys: Set<string>;
  touchX: number | null;
  touchActive: boolean;
}

function spawnParticles(state: GameState, x: number, y: number, color: string, count: number) {
  for (let i = 0; i < count; i++) {
    state.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 30 + Math.random() * 20,
      maxLife: 30 + Math.random() * 20,
      color,
      size: 2 + Math.random() * 4,
    });
  }
}

// ===========================
// GAME LOOP IMPLEMENTATIONS
// ===========================

function runPlatformer(ctx: CanvasRenderingContext2D, W: number, H: number, config: GameConfig, state: GameState) {
  const player = state.entities.find(e => e.type === 'player')!;
  const ground = H - 60;

  // Spawn platforms
  if (state.frame % Math.floor(config.enemies.spawnRate * 1.5) === 0 && state.started) {
    state.entities.push({
      x: W + 20, y: ground - 40 - Math.random() * 120,
      w: 60 + Math.random() * 80, h: 14,
      vx: -config.enemies.speed, vy: 0,
      type: 'platform', active: true, color: config.theme.accentColor,
    });
  }

  // Spawn enemies
  if (state.frame % Math.floor(config.enemies.spawnRate) === 0 && state.started) {
    state.entities.push({
      x: W + 20, y: ground - 30,
      w: 28, h: 28, vx: -config.enemies.speed * 1.2, vy: 0,
      type: 'enemy', emoji: config.enemies.emoji, active: true,
    });
  }

  // Spawn collectibles
  if (state.frame % Math.floor(config.enemies.spawnRate * 2) === 0 && state.started) {
    state.entities.push({
      x: W + 20, y: ground - 80 - Math.random() * 100,
      w: 24, h: 24, vx: -config.enemies.speed, vy: 0,
      type: 'collectible', emoji: config.collectibles.emoji, active: true,
    });
  }

  // Player movement
  if (state.keys.has('ArrowLeft') || state.keys.has('a')) player.x = Math.max(0, player.x - config.player.speed);
  if (state.keys.has('ArrowRight') || state.keys.has('d')) player.x = Math.min(W - player.w, player.x + config.player.speed);

  // Jump
  if ((state.keys.has('ArrowUp') || state.keys.has('w') || state.keys.has(' ')) && player.y >= ground - player.h) {
    player.vy = -13;
  }

  // Gravity
  player.vy += 0.6;
  player.y += player.vy;
  if (player.y > ground - player.h) {
    player.y = ground - player.h;
    player.vy = 0;
  }

  // Platform collision
  state.entities.filter(e => e.type === 'platform' && e.active).forEach(plat => {
    if (player.vy > 0 &&
        player.x + player.w > plat.x && player.x < plat.x + plat.w &&
        player.y + player.h >= plat.y && player.y + player.h <= plat.y + plat.h + 8) {
      player.y = plat.y - player.h;
      player.vy = 0;
    }
  });

  // Draw ground
  ctx.fillStyle = config.theme.accentColor + '40';
  ctx.fillRect(0, ground, W, H - ground);
  ctx.fillStyle = config.theme.accentColor;
  ctx.fillRect(0, ground, W, 3);
}

function runCatcher(ctx: CanvasRenderingContext2D, W: number, H: number, config: GameConfig, state: GameState) {
  const player = state.entities.find(e => e.type === 'player')!;
  player.y = H - 60;
  player.w = 60;

  // Touch/mouse control
  if (state.touchX !== null) {
    player.x = Math.max(0, Math.min(W - player.w, state.touchX - player.w / 2));
  }

  // Keyboard
  if (state.keys.has('ArrowLeft') || state.keys.has('a')) player.x = Math.max(0, player.x - config.player.speed * 1.5);
  if (state.keys.has('ArrowRight') || state.keys.has('d')) player.x = Math.min(W - player.w, player.x + config.player.speed * 1.5);

  // Spawn falling enemies
  if (state.frame % Math.floor(config.enemies.spawnRate) === 0 && state.started) {
    state.entities.push({
      x: Math.random() * (W - 28), y: -30,
      w: 28, h: 28, vx: 0, vy: config.enemies.speed,
      type: 'enemy', emoji: config.enemies.emoji, active: true,
    });
  }

  // Spawn collectibles
  if (state.frame % Math.floor(config.enemies.spawnRate * 0.8) === 0 && state.started) {
    state.entities.push({
      x: Math.random() * (W - 24), y: -24,
      w: 24, h: 24, vx: 0, vy: config.enemies.speed * 0.8,
      type: 'collectible', emoji: config.collectibles.emoji, active: true,
    });
  }

  // Draw basket/player wider
  ctx.fillStyle = config.theme.playerColor + '30';
  ctx.beginPath();
  ctx.moveTo(player.x, player.y + player.h);
  ctx.lineTo(player.x + 10, player.y);
  ctx.lineTo(player.x + player.w - 10, player.y);
  ctx.lineTo(player.x + player.w, player.y + player.h);
  ctx.closePath();
  ctx.fill();
}

function runShooter(ctx: CanvasRenderingContext2D, W: number, H: number, config: GameConfig, state: GameState) {
  const player = state.entities.find(e => e.type === 'player')!;
  player.y = H - 60;

  // Movement
  if (state.keys.has('ArrowLeft') || state.keys.has('a')) player.x = Math.max(0, player.x - config.player.speed * 1.3);
  if (state.keys.has('ArrowRight') || state.keys.has('d')) player.x = Math.min(W - player.w, player.x + config.player.speed * 1.3);
  if (state.touchX !== null) {
    player.x = Math.max(0, Math.min(W - player.w, state.touchX - player.w / 2));
  }

  // Auto-shoot
  if (state.frame % 12 === 0 && state.started) {
    state.entities.push({
      x: player.x + player.w / 2 - 3, y: player.y - 10,
      w: 6, h: 14, vx: 0, vy: -10,
      type: 'bullet', active: true, color: config.theme.accentColor,
    });
  }

  // Spawn enemies (wave pattern)
  if (state.frame % Math.floor(config.enemies.spawnRate * 0.7) === 0 && state.started) {
    const count = Math.min(3, 1 + Math.floor(state.score / 50));
    for (let i = 0; i < count; i++) {
      state.entities.push({
        x: Math.random() * (W - 32), y: -30 - i * 40,
        w: 30, h: 30, vx: (Math.random() - 0.5) * 2, vy: config.enemies.speed * 0.6,
        type: 'enemy', emoji: config.enemies.emoji, active: true, hp: 1,
      });
    }
  }

  // Bullet vs Enemy collision
  const bullets = state.entities.filter(e => e.type === 'bullet' && e.active);
  const enemies = state.entities.filter(e => e.type === 'enemy' && e.active);
  bullets.forEach(b => {
    enemies.forEach(en => {
      if (b.active && b.x < en.x + en.w && b.x + b.w > en.x && b.y < en.y + en.h && b.y + b.h > en.y) {
        b.active = false;
        en.active = false;
        state.score += config.collectibles.points;
        spawnParticles(state, en.x + en.w / 2, en.y + en.h / 2, config.theme.enemyColor, 8);
      }
    });
  });

  // Draw bullets
  bullets.filter(b => b.active).forEach(b => {
    ctx.fillStyle = b.color || config.theme.accentColor;
    ctx.shadowColor = b.color || config.theme.accentColor;
    ctx.shadowBlur = 8;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.shadowBlur = 0;
  });
}

function runRacer(ctx: CanvasRenderingContext2D, W: number, H: number, config: GameConfig, state: GameState) {
  const player = state.entities.find(e => e.type === 'player')!;
  player.y = H - 80;
  const laneW = W / 3;

  // Movement
  if (state.keys.has('ArrowLeft') || state.keys.has('a')) player.x = Math.max(10, player.x - config.player.speed * 1.5);
  if (state.keys.has('ArrowRight') || state.keys.has('d')) player.x = Math.min(W - player.w - 10, player.x + config.player.speed * 1.5);
  if (state.touchX !== null) {
    player.x = Math.max(10, Math.min(W - player.w - 10, state.touchX - player.w / 2));
  }

  // Draw road
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#555';
  ctx.setLineDash([30, 20]);
  ctx.lineWidth = 2;
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(laneW * i, 0);
    ctx.lineTo(laneW * i, H);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.fillStyle = '#444';
  ctx.fillRect(0, 0, 6, H);
  ctx.fillRect(W - 6, 0, 6, H);

  // Spawn obstacles
  if (state.frame % Math.floor(config.enemies.spawnRate) === 0 && state.started) {
    const lane = Math.floor(Math.random() * 3);
    state.entities.push({
      x: lane * laneW + laneW / 2 - 16, y: -40,
      w: 32, h: 32, vx: 0, vy: config.enemies.speed * 1.2,
      type: 'enemy', emoji: config.enemies.emoji, active: true,
    });
  }

  // Spawn coins
  if (state.frame % Math.floor(config.enemies.spawnRate * 1.5) === 0 && state.started) {
    const lane = Math.floor(Math.random() * 3);
    state.entities.push({
      x: lane * laneW + laneW / 2 - 12, y: -30,
      w: 24, h: 24, vx: 0, vy: config.enemies.speed,
      type: 'collectible', emoji: config.collectibles.emoji, active: true,
    });
  }

  // Score auto-increments (distance)
  if (state.frame % 30 === 0 && state.started) state.score += 1;
}

function runBreakout(ctx: CanvasRenderingContext2D, W: number, H: number, config: GameConfig, state: GameState) {
  const player = state.entities.find(e => e.type === 'player')!;
  player.y = H - 30;
  player.w = 70;
  player.h = 12;

  // Movement
  if (state.keys.has('ArrowLeft') || state.keys.has('a')) player.x = Math.max(0, player.x - config.player.speed * 2);
  if (state.keys.has('ArrowRight') || state.keys.has('d')) player.x = Math.min(W - player.w, player.x + config.player.speed * 2);
  if (state.touchX !== null) {
    player.x = Math.max(0, Math.min(W - player.w, state.touchX - player.w / 2));
  }

  // Init bricks + ball on first frame
  if (state.frame === 1) {
    const cols = 8;
    const rows = 4;
    const bw = (W - 20) / cols;
    const bh = 16;
    const colors = [config.theme.enemyColor, config.theme.accentColor, config.theme.playerColor, config.theme.particleColor];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        state.entities.push({
          x: 10 + c * bw, y: 40 + r * (bh + 4),
          w: bw - 4, h: bh,
          vx: 0, vy: 0,
          type: 'brick', active: true, color: colors[r % colors.length],
        });
      }
    }
    // Ball
    state.entities.push({
      x: W / 2, y: H / 2,
      w: 10, h: 10,
      vx: 3, vy: -4,
      type: 'ball', active: true, color: '#fff',
    });
  }

  const ball = state.entities.find(e => e.type === 'ball' && e.active);
  if (ball) {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall bounce
    if (ball.x <= 0 || ball.x + ball.w >= W) ball.vx *= -1;
    if (ball.y <= 0) ball.vy *= -1;

    // Paddle bounce
    if (ball.vy > 0 && ball.y + ball.h >= player.y && ball.x + ball.w > player.x && ball.x < player.x + player.w) {
      ball.vy = -Math.abs(ball.vy) - 0.2;
      ball.vx = ((ball.x + ball.w / 2) - (player.x + player.w / 2)) / 8;
      spawnParticles(state, ball.x, ball.y, config.theme.particleColor, 4);
    }

    // Brick collision
    state.entities.filter(e => e.type === 'brick' && e.active).forEach(brick => {
      if (ball.x + ball.w > brick.x && ball.x < brick.x + brick.w &&
          ball.y + ball.h > brick.y && ball.y < brick.y + brick.h) {
        brick.active = false;
        ball.vy *= -1;
        state.score += config.collectibles.points;
        spawnParticles(state, brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color || config.theme.enemyColor, 6);
      }
    });

    // Miss (ball falls below)
    if (ball.y > H + 20) {
      state.lives--;
      if (state.lives <= 0) {
        state.gameOver = true;
      } else {
        ball.x = W / 2;
        ball.y = H / 2;
        ball.vx = 3;
        ball.vy = -4;
      }
    }

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ball.x + ball.w / 2, ball.y + ball.h / 2, ball.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Win check
    if (state.entities.filter(e => e.type === 'brick' && e.active).length === 0) {
      state.score += 100;
      // Reset bricks
      const cols = 8;
      const rows = 4;
      const bw = (W - 20) / cols;
      const bh = 16;
      const colors = [config.theme.enemyColor, config.theme.accentColor, config.theme.playerColor, config.theme.particleColor];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          state.entities.push({
            x: 10 + c * bw, y: 40 + r * (bh + 4),
            w: bw - 4, h: bh,
            vx: 0, vy: 0,
            type: 'brick', active: true, color: colors[r % colors.length],
          });
        }
      }
    }
  }

  // Draw bricks
  state.entities.filter(e => e.type === 'brick' && e.active).forEach(b => {
    ctx.fillStyle = b.color || config.theme.enemyColor;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(b.x, b.y, b.w, b.h);
  });

  // Draw paddle
  ctx.fillStyle = config.theme.playerColor;
  ctx.shadowColor = config.theme.playerColor;
  ctx.shadowBlur = 8;
  const radius = 6;
  ctx.beginPath();
  ctx.roundRect(player.x, player.y, player.w, player.h, radius);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function runRunner(ctx: CanvasRenderingContext2D, W: number, H: number, config: GameConfig, state: GameState) {
  const player = state.entities.find(e => e.type === 'player')!;
  const ground = H - 60;
  player.x = 60;

  // Jump
  if ((state.keys.has('ArrowUp') || state.keys.has('w') || state.keys.has(' ') || state.touchActive) && player.y >= ground - player.h) {
    player.vy = -12;
  }

  // Gravity
  player.vy += 0.55;
  player.y += player.vy;
  if (player.y > ground - player.h) {
    player.y = ground - player.h;
    player.vy = 0;
  }

  // Spawn obstacles
  if (state.frame % Math.floor(config.enemies.spawnRate) === 0 && state.started) {
    const tall = Math.random() > 0.5;
    state.entities.push({
      x: W + 20, y: ground - (tall ? 50 : 30),
      w: 24, h: tall ? 50 : 30,
      vx: -config.enemies.speed * 1.3, vy: 0,
      type: 'enemy', emoji: config.enemies.emoji, active: true,
    });
  }

  // Spawn collectibles (floating)
  if (state.frame % Math.floor(config.enemies.spawnRate * 2.5) === 0 && state.started) {
    state.entities.push({
      x: W + 20, y: ground - 80 - Math.random() * 60,
      w: 22, h: 22, vx: -config.enemies.speed * 1.3, vy: 0,
      type: 'collectible', emoji: config.collectibles.emoji, active: true,
    });
  }

  // Draw ground
  ctx.fillStyle = config.theme.accentColor + '30';
  ctx.fillRect(0, ground, W, H - ground);
  ctx.fillStyle = config.theme.accentColor;
  ctx.fillRect(0, ground, W, 3);

  // Score auto-increments
  if (state.frame % 20 === 0 && state.started) state.score += 1;
}

function runPong(ctx: CanvasRenderingContext2D, W: number, H: number, config: GameConfig, state: GameState) {
  const player = state.entities.find(e => e.type === 'player')!;
  player.x = 20;
  player.w = 12;
  player.h = 60;

  // Movement
  if (state.keys.has('ArrowUp') || state.keys.has('w')) player.y = Math.max(0, player.y - config.player.speed * 1.5);
  if (state.keys.has('ArrowDown') || state.keys.has('s')) player.y = Math.min(H - player.h, player.y + config.player.speed * 1.5);
  if (state.touchX !== null) {
    // use touchX as Y for pong
  }

  // Init ball + AI paddle
  if (state.frame === 1) {
    state.entities.push({
      x: W / 2, y: H / 2,
      w: 10, h: 10,
      vx: 4, vy: 3,
      type: 'ball', active: true, color: '#fff',
    });
    state.entities.push({
      x: W - 32, y: H / 2 - 30,
      w: 12, h: 60,
      vx: 0, vy: 0,
      type: 'platform', active: true, color: config.theme.enemyColor,
    });
  }

  const ball = state.entities.find(e => e.type === 'ball' && e.active);
  const aiPaddle = state.entities.find(e => e.type === 'platform' && e.active);

  if (ball && aiPaddle) {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // AI follows ball
    const aiSpeed = config.difficulty === 'easy' ? 2.5 : config.difficulty === 'hard' ? 5 : 3.5;
    if (ball.y + ball.h / 2 > aiPaddle.y + aiPaddle.h / 2 + 10) aiPaddle.y = Math.min(H - aiPaddle.h, aiPaddle.y + aiSpeed);
    else if (ball.y + ball.h / 2 < aiPaddle.y + aiPaddle.h / 2 - 10) aiPaddle.y = Math.max(0, aiPaddle.y - aiSpeed);

    // Top/bottom bounce
    if (ball.y <= 0 || ball.y + ball.h >= H) ball.vy *= -1;

    // Player paddle bounce
    if (ball.vx < 0 && ball.x <= player.x + player.w && ball.y + ball.h > player.y && ball.y < player.y + player.h) {
      ball.vx = Math.abs(ball.vx) + 0.2;
      ball.vy += ((ball.y + ball.h / 2) - (player.y + player.h / 2)) / 10;
      state.score += 5;
      spawnParticles(state, ball.x, ball.y, config.theme.particleColor, 4);
    }

    // AI paddle bounce
    if (ball.vx > 0 && ball.x + ball.w >= aiPaddle.x && ball.y + ball.h > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.h) {
      ball.vx = -(Math.abs(ball.vx) + 0.2);
      spawnParticles(state, ball.x, ball.y, config.theme.enemyColor, 4);
    }

    // Miss
    if (ball.x < -20) {
      state.lives--;
      if (state.lives <= 0) state.gameOver = true;
      else { ball.x = W / 2; ball.y = H / 2; ball.vx = 4; ball.vy = 3; }
    }
    if (ball.x > W + 20) {
      state.score += 20;
      ball.x = W / 2; ball.y = H / 2; ball.vx = -4; ball.vy = -3;
    }

    // Draw net
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = config.theme.playerColor;
    ctx.shadowColor = config.theme.playerColor;
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = aiPaddle.color || config.theme.enemyColor;
    ctx.shadowColor = aiPaddle.color || config.theme.enemyColor;
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.w, aiPaddle.h);
    ctx.shadowBlur = 0;

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(ball.x + ball.w / 2, ball.y + ball.h / 2, ball.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function runFlappy(ctx: CanvasRenderingContext2D, W: number, H: number, config: GameConfig, state: GameState) {
  const player = state.entities.find(e => e.type === 'player')!;
  player.x = 60;

  // Flap
  if (state.keys.has(' ') || state.keys.has('ArrowUp') || state.keys.has('w') || state.touchActive) {
    if (player.vy > -6) player.vy = -7;
  }

  // Gravity
  player.vy += 0.35;
  player.y += player.vy;

  // Clamp
  if (player.y < 0) { player.y = 0; player.vy = 0; }
  if (player.y > H - player.h) {
    player.y = H - player.h;
    state.lives--;
    if (state.lives <= 0) state.gameOver = true;
    else player.vy = -8;
  }

  // Spawn pipes
  if (state.frame % Math.floor(config.enemies.spawnRate * 2) === 0 && state.started) {
    const gapY = 60 + Math.random() * (H - 180);
    const gapH = config.difficulty === 'easy' ? 120 : config.difficulty === 'hard' ? 70 : 90;
    // Top pipe
    state.entities.push({
      x: W + 10, y: 0,
      w: 44, h: gapY,
      vx: -config.enemies.speed, vy: 0,
      type: 'pipe', active: true, color: config.theme.enemyColor,
    });
    // Bottom pipe
    state.entities.push({
      x: W + 10, y: gapY + gapH,
      w: 44, h: H - gapY - gapH,
      vx: -config.enemies.speed, vy: 0,
      type: 'pipe', active: true, color: config.theme.enemyColor,
    });
    // Collectible in gap
    state.entities.push({
      x: W + 30, y: gapY + gapH / 2 - 10,
      w: 20, h: 20, vx: -config.enemies.speed, vy: 0,
      type: 'collectible', emoji: config.collectibles.emoji, active: true,
    });
  }

  // Draw pipes
  state.entities.filter(e => e.type === 'pipe' && e.active).forEach(pipe => {
    ctx.fillStyle = pipe.color || config.theme.enemyColor;
    ctx.fillRect(pipe.x, pipe.y, pipe.w, pipe.h);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(pipe.x, pipe.y, 4, pipe.h);
    // Lip
    ctx.fillStyle = pipe.color || config.theme.enemyColor;
    if (pipe.y === 0) {
      ctx.fillRect(pipe.x - 4, pipe.h - 12, pipe.w + 8, 12);
    } else {
      ctx.fillRect(pipe.x - 4, pipe.y, pipe.w + 8, 12);
    }
  });

  // Pipe collision
  state.entities.filter(e => e.type === 'pipe' && e.active).forEach(pipe => {
    if (player.x + player.w > pipe.x && player.x < pipe.x + pipe.w &&
        player.y + player.h > pipe.y && player.y < pipe.y + pipe.h) {
      state.lives--;
      pipe.active = false;
      if (state.lives <= 0) state.gameOver = true;
      else player.vy = -8;
    }
  });

  // Score for passing pipes
  state.entities.filter(e => e.type === 'pipe' && e.active && e.y === 0).forEach(pipe => {
    if (pipe.x + pipe.w < player.x && !((pipe as unknown as { scored: boolean }).scored)) {
      state.score += 1;
      (pipe as unknown as { scored: boolean }).scored = true;
    }
  });
}

// ===========================
// MAIN GAME RENDERER COMPONENT
// ===========================

export function GameCanvas({ config, onScore }: { config: GameConfig; onScore?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>({
    entities: [],
    particles: [],
    score: 0,
    lives: 3,
    gameOver: false,
    started: false,
    frame: 0,
    keys: new Set(),
    touchX: null,
    touchActive: false,
  });
  const animRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    const state = stateRef.current;
    state.entities = [];
    state.particles = [];
    state.score = 0;
    state.lives = 3;
    state.gameOver = false;
    state.started = false;
    state.frame = 0;

    // Create player
    state.entities.push({
      x: config.type === 'runner' || config.type === 'flappy' ? 60 : W / 2 - 16,
      y: config.type === 'flappy' ? H / 2 : H - 80,
      w: config.player.size,
      h: config.player.size,
      vx: 0, vy: 0,
      type: 'player',
      emoji: config.player.emoji,
      active: true,
    });

    setScore(0);
    setLives(3);
    setGameOver(false);
    setStarted(false);
  }, [config]);

  const startGame = useCallback(() => {
    stateRef.current.started = true;
    stateRef.current.frame = 0;
    setStarted(true);
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const state = stateRef.current;

    if (state.gameOver) {
      setGameOver(true);
      onScore?.(state.score);
      return;
    }

    state.frame++;

    // Clear with gradient bg
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, config.theme.bg1);
    grad.addColorStop(1, config.theme.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Stars background for space themes
    if (config.theme.name === 'Space' || config.theme.bg1.includes('0a')) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      for (let i = 0; i < 30; i++) {
        const sx = (i * 137 + state.frame * 0.3) % W;
        const sy = (i * 97 + state.frame * 0.1) % H;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
    }

    // Run game-specific logic
    switch (config.type) {
      case 'platformer': runPlatformer(ctx, W, H, config, state); break;
      case 'catcher': runCatcher(ctx, W, H, config, state); break;
      case 'shooter': runShooter(ctx, W, H, config, state); break;
      case 'racer': runRacer(ctx, W, H, config, state); break;
      case 'breakout': runBreakout(ctx, W, H, config, state); break;
      case 'runner': runRunner(ctx, W, H, config, state); break;
      case 'pong': runPong(ctx, W, H, config, state); break;
      case 'flappy': runFlappy(ctx, W, H, config, state); break;
    }

    // Update entities
    state.entities.forEach(e => {
      if (!e.active) return;
      e.x += e.vx;
      e.y += e.vy;
    });

    // Remove off-screen entities (not player, ball, platform in pong/breakout)
    state.entities = state.entities.filter(e =>
      e.type === 'player' || e.type === 'ball' ||
      (e.type === 'platform' && config.type === 'pong') ||
      (e.type === 'brick') ||
      (e.active && e.x > -100 && e.x < W + 100 && e.y > -100 && e.y < H + 100)
    );

    // Player-enemy collision (for non-shooter, non-breakout, non-pong games)
    if (!['shooter', 'breakout', 'pong'].includes(config.type)) {
      const player = state.entities.find(e => e.type === 'player');
      if (player) {
        state.entities.filter(e => e.type === 'enemy' && e.active).forEach(enemy => {
          if (player.x + player.w - 4 > enemy.x && player.x + 4 < enemy.x + enemy.w &&
              player.y + player.h - 4 > enemy.y && player.y + 4 < enemy.y + enemy.h) {
            enemy.active = false;
            state.lives--;
            spawnParticles(state, player.x + player.w / 2, player.y + player.h / 2, config.theme.enemyColor, 10);
            if (state.lives <= 0) {
              state.gameOver = true;
            }
          }
        });

        // Collectible collision
        state.entities.filter(e => e.type === 'collectible' && e.active).forEach(col => {
          if (player.x + player.w > col.x && player.x < col.x + col.w &&
              player.y + player.h > col.y && player.y < col.y + col.h) {
            col.active = false;
            state.score += config.collectibles.points;
            spawnParticles(state, col.x + col.w / 2, col.y + col.h / 2, config.theme.accentColor, 6);
          }
        });
      }
    }

    // Draw entities (emojis)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    state.entities.filter(e => e.active && e.emoji && e.type !== 'ball' && e.type !== 'brick').forEach(e => {
      const fontSize = Math.max(e.w, e.h);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillText(e.emoji!, e.x + e.w / 2, e.y + e.h / 2);
    });

    // Draw particles
    state.particles = state.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.vy += 0.1;
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      return p.life > 0;
    });
    ctx.globalAlpha = 1;

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${state.score}`, 12, 24);
    ctx.textAlign = 'right';
    ctx.fillText('❤️'.repeat(Math.max(0, state.lives)), W - 12, 24);

    setScore(state.score);
    setLives(state.lives);

    animRef.current = requestAnimationFrame(gameLoop);
  }, [config, onScore]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (!started) return;

    animRef.current = requestAnimationFrame(gameLoop);

    const handleKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys.add(e.key);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys.delete(e.key);
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        stateRef.current.touchActive = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [started, gameLoop]);

  const handleCanvasTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      stateRef.current.touchX = e.touches[0].clientX - rect.left;
      stateRef.current.touchActive = true;
    }
  };

  const handleCanvasTouchEnd = () => {
    stateRef.current.touchActive = false;
  };

  const handleCanvasMouse = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      stateRef.current.touchX = e.clientX - rect.left;
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={320}
        className="w-full rounded-xl border-2 border-white/10 cursor-pointer"
        style={{ imageRendering: 'pixelated', maxWidth: 500 }}
        onTouchStart={handleCanvasTouch}
        onTouchMove={handleCanvasTouch}
        onTouchEnd={handleCanvasTouchEnd}
        onMouseMove={handleCanvasMouse}
        onClick={() => {
          if (!started) startGame();
          stateRef.current.touchActive = true;
          setTimeout(() => { stateRef.current.touchActive = false; }, 100);
        }}
      />

      {/* Start overlay */}
      {!started && !gameOver && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl cursor-pointer"
          onClick={startGame}
        >
          <div className="text-5xl mb-3">{config.player.emoji}</div>
          <div className="text-white font-bold text-xl mb-1">{config.title}</div>
          <div className="text-white/60 text-sm mb-4">
            {config.type === 'runner' || config.type === 'platformer' || config.type === 'flappy' ? '⬆️ / Space to jump' :
             config.type === 'shooter' ? '⬅️➡️ to move • auto-shoot' :
             config.type === 'pong' ? '⬆️⬇️ to move paddle' :
             '⬅️➡️ to move'}
          </div>
          <div className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white font-bold text-lg backdrop-blur-sm transition-colors">
            ▶ Play
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
          <div className="text-4xl mb-2">💥</div>
          <div className="text-white font-bold text-2xl mb-1">Game Over!</div>
          <div className="text-yellow-400 font-bold text-xl mb-4">Score: {score}</div>
          <button
            onClick={() => {
              initGame();
              setTimeout(startGame, 100);
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-full text-white font-bold text-lg transition-colors"
          >
            🔄 Play Again
          </button>
        </div>
      )}

      {/* Mobile controls */}
      {started && !gameOver && (
        <div className="flex justify-center gap-6 mt-3 md:hidden">
          {config.type === 'pong' ? (
            <>
              <button
                onTouchStart={() => stateRef.current.keys.add('ArrowUp')}
                onTouchEnd={() => stateRef.current.keys.delete('ArrowUp')}
                className="w-16 h-12 bg-white/10 rounded-xl text-white text-2xl active:bg-white/20"
              >↑</button>
              <button
                onTouchStart={() => stateRef.current.keys.add('ArrowDown')}
                onTouchEnd={() => stateRef.current.keys.delete('ArrowDown')}
                className="w-16 h-12 bg-white/10 rounded-xl text-white text-2xl active:bg-white/20"
              >↓</button>
            </>
          ) : config.type === 'runner' || config.type === 'flappy' ? (
            <button
              onTouchStart={() => { stateRef.current.keys.add(' '); stateRef.current.touchActive = true; }}
              onTouchEnd={() => { stateRef.current.keys.delete(' '); stateRef.current.touchActive = false; }}
              className="w-32 h-14 bg-white/10 rounded-xl text-white text-lg font-bold active:bg-white/20"
            >⬆️ Jump</button>
          ) : (
            <>
              <button
                onTouchStart={() => stateRef.current.keys.add('ArrowLeft')}
                onTouchEnd={() => stateRef.current.keys.delete('ArrowLeft')}
                className="w-14 h-12 bg-white/10 rounded-xl text-white text-2xl active:bg-white/20"
              >←</button>
              {config.type === 'platformer' && (
                <button
                  onTouchStart={() => { stateRef.current.keys.add(' '); }}
                  onTouchEnd={() => { stateRef.current.keys.delete(' '); }}
                  className="w-16 h-12 bg-white/10 rounded-xl text-white text-lg active:bg-white/20"
                >⬆️</button>
              )}
              <button
                onTouchStart={() => stateRef.current.keys.add('ArrowRight')}
                onTouchEnd={() => stateRef.current.keys.delete('ArrowRight')}
                className="w-14 h-12 bg-white/10 rounded-xl text-white text-2xl active:bg-white/20"
              >→</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
