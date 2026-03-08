// ─────────────────────────────────────────────────────────────────────────────
// BrainyPulse Leaderboard Utility
// Simulated global leaderboard: seeded fake scores + real localStorage scores
// ─────────────────────────────────────────────────────────────────────────────

export type TestId =
  | 'reaction-time'
  | 'click-speed'
  | 'memory'
  | 'typing-speed'
  | 'math-speed';

export interface LeaderboardEntry {
  name: string;
  score: number;
  country: string;
  isPlayer?: boolean;
}

// For reaction-time: lower is better (ms). All others: higher is better.
export const LOWER_IS_BETTER: TestId[] = ['reaction-time'];

// ── Seeded global scores (realistic, believable) ──────────────────────────────
const SEEDS: Record<TestId, LeaderboardEntry[]> = {
  'reaction-time': [
    { name: 'QuickDraw_K', score: 178, country: '🇺🇸' },
    { name: 'SilverFox99', score: 191, country: '🇳🇱' },
    { name: 'ZenReflexes', score: 204, country: '🇯🇵' },
    { name: 'BoltFingers', score: 212, country: '🇬🇧' },
    { name: 'NinjaPulse',  score: 217, country: '🇦🇺' },
    { name: 'ThunderMike', score: 225, country: '🇩🇪' },
    { name: 'SnapKing',    score: 233, country: '🇧🇷' },
    { name: 'EagleEye_L',  score: 241, country: '🇨🇦' },
    { name: 'Reactor007',  score: 248, country: '🇫🇷' },
    { name: 'IronClick',   score: 259, country: '🇪🇸' },
  ],
  'click-speed': [
    { name: 'ClickStorm',  score: 14.8, country: '🇰🇷' },
    { name: 'TurboTapper', score: 14.1, country: '🇺🇸' },
    { name: 'RapidFire_J', score: 13.6, country: '🇯🇵' },
    { name: 'SpeedDemon',  score: 12.9, country: '🇬🇧' },
    { name: 'PixelRacer',  score: 12.3, country: '🇩🇪' },
    { name: 'ClickMaster', score: 11.8, country: '🇧🇷' },
    { name: 'TapWizard',   score: 11.2, country: '🇨🇦' },
    { name: 'DigitDasher', score: 10.9, country: '🇫🇷' },
    { name: 'PulseTapper', score: 10.4, country: '🇦🇺' },
    { name: 'AceClicker',  score: 10.1, country: '🇳🇿' },
  ],
  'memory': [
    { name: 'MindVault_X', score: 18, country: '🇺🇸' },
    { name: 'NeuralNinja', score: 16, country: '🇬🇧' },
    { name: 'MemoryMage',  score: 15, country: '🇩🇪' },
    { name: 'BrainBank_R', score: 14, country: '🇯🇵' },
    { name: 'RecallKing',  score: 13, country: '🇦🇺' },
    { name: 'PerfectRecall',score: 12, country: '🇨🇦' },
    { name: 'MindsEye_L',  score: 11, country: '🇧🇷' },
    { name: 'Mnemonic_Z',  score: 10, country: '🇫🇷' },
    { name: 'ThinkTank7',  score: 10, country: '🇳🇱' },
    { name: 'BrainWave_S', score: 9,  country: '🇰🇷' },
  ],
  'typing-speed': [
    { name: 'KeyboardKing', score: 142, country: '🇺🇸' },
    { name: 'TypeStorm',    score: 138, country: '🇬🇧' },
    { name: 'WordBlaster',  score: 131, country: '🇩🇪' },
    { name: 'SpeedScribe',  score: 124, country: '🇯🇵' },
    { name: 'QuillMaster',  score: 118, country: '🇦🇺' },
    { name: 'ClickType_Z',  score: 112, country: '🇨🇦' },
    { name: 'TypeNinja',    score: 107, country: '🇧🇷' },
    { name: 'RapidTypist',  score: 101, country: '🇫🇷' },
    { name: 'FingerFlash',  score: 96,  country: '🇳🇱' },
    { name: 'WordWhiz_K',   score: 91,  country: '🇰🇷' },
  ],
  'math-speed': [
    { name: 'CalcWizard',   score: 62, country: '🇺🇸' },
    { name: 'NumberNinja',  score: 58, country: '🇬🇧' },
    { name: 'MathStorm_X',  score: 54, country: '🇩🇪' },
    { name: 'ArithKing',    score: 51, country: '🇯🇵' },
    { name: 'SwiftSums_R',  score: 48, country: '🇦🇺' },
    { name: 'QuizMaster',   score: 45, country: '🇨🇦' },
    { name: 'BrainCalc_Z',  score: 42, country: '🇧🇷' },
    { name: 'MentalMath_J', score: 39, country: '🇫🇷' },
    { name: 'NumbCruncher', score: 36, country: '🇳🇱' },
    { name: 'SpeedAdder',   score: 33, country: '🇰🇷' },
  ],
};

// ── localStorage keys ─────────────────────────────────────────────────────────
const LS_KEYS: Record<TestId, string> = {
  'reaction-time':  'bp_score_reaction',
  'click-speed':    'bp_score_click',
  'memory':         'bp_score_memory',
  'typing-speed':   'bp_score_typing',
  'math-speed':     'bp_score_math',
};

const LS_NAME_KEY = 'bp_player_name';

/** Save a score to localStorage */
export function saveScore(testId: TestId, score: number): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = localStorage.getItem(LS_KEYS[testId]);
    const lowerBetter = LOWER_IS_BETTER.includes(testId);
    if (!existing) {
      localStorage.setItem(LS_KEYS[testId], String(score));
    } else {
      const prev = parseFloat(existing);
      const isBetter = lowerBetter ? score < prev : score > prev;
      if (isBetter) localStorage.setItem(LS_KEYS[testId], String(score));
    }
  } catch (_) { /* ignore */ }
}

/** Get player's personal best for a test */
export function getPersonalBest(testId: TestId): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(LS_KEYS[testId]);
    return val ? parseFloat(val) : null;
  } catch (_) { return null; }
}

/** Get or set player nickname */
export function getPlayerName(): string {
  if (typeof window === 'undefined') return 'You';
  try {
    return localStorage.getItem(LS_NAME_KEY) || 'You';
  } catch (_) { return 'You'; }
}

export function setPlayerName(name: string): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(LS_NAME_KEY, name.trim().slice(0, 16)); } catch (_) { /* ignore */ }
}

/** 
 * Get full leaderboard for a test.
 * Merges seeded scores with player's real score.
 * Returns sorted list (best first), max 10 entries.
 */
export function getLeaderboard(testId: TestId, playerScore?: number, playerName?: string): LeaderboardEntry[] {
  const seeds = SEEDS[testId].map(s => ({ ...s }));
  const lowerBetter = LOWER_IS_BETTER.includes(testId);

  if (playerScore !== undefined) {
    const name = playerName || getPlayerName();
    seeds.push({ name, score: playerScore, country: '⭐', isPlayer: true });
  }

  seeds.sort((a, b) =>
    lowerBetter ? a.score - b.score : b.score - a.score
  );

  return seeds.slice(0, 10);
}

/** Get percentile rating string based on score */
export function getPercentileRating(testId: TestId, score: number): { label: string; emoji: string; color: string } {
  const seeds = SEEDS[testId];
  const lowerBetter = LOWER_IS_BETTER.includes(testId);
  const betterCount = seeds.filter(s =>
    lowerBetter ? s.score > score : s.score < score
  ).length;
  const percentile = Math.round((betterCount / seeds.length) * 100);

  if (percentile >= 90) return { label: 'Top 10% 🌟', emoji: '🏆', color: 'text-yellow-600 bg-yellow-50' };
  if (percentile >= 75) return { label: 'Top 25%', emoji: '🥇', color: 'text-orange-600 bg-orange-50' };
  if (percentile >= 50) return { label: 'Above Average', emoji: '🥈', color: 'text-blue-600 bg-blue-50' };
  if (percentile >= 25) return { label: 'Average', emoji: '👍', color: 'text-green-600 bg-green-50' };
  return { label: 'Keep Practising!', emoji: '💪', color: 'text-purple-600 bg-purple-50' };
}

/** All tests metadata for cross-linking */
export const ALL_TESTS = [
  {
    id: 'reaction-time' as TestId,
    label: 'Reaction Time',
    emoji: '⚡',
    desc: 'How fast are your reflexes?',
    href: '/tests/reaction-time',
    unit: 'ms',
    color: 'from-yellow-400 to-orange-500',
    bg: 'bg-yellow-50',
  },
  {
    id: 'click-speed' as TestId,
    label: 'Click Speed',
    emoji: '🖱️',
    desc: 'How many clicks per second?',
    href: '/tests/click-speed',
    unit: 'CPS',
    color: 'from-blue-400 to-cyan-500',
    bg: 'bg-blue-50',
  },
  {
    id: 'memory' as TestId,
    label: 'Memory Test',
    emoji: '🧠',
    desc: 'Test your short-term memory.',
    href: '/tests/memory',
    unit: 'level',
    color: 'from-purple-400 to-violet-500',
    bg: 'bg-purple-50',
  },
  {
    id: 'typing-speed' as TestId,
    label: 'Typing Speed',
    emoji: '⌨️',
    desc: 'How many words per minute?',
    href: '/tests/typing-speed',
    unit: 'WPM',
    color: 'from-green-400 to-emerald-500',
    bg: 'bg-green-50',
  },
  {
    id: 'math-speed' as TestId,
    label: 'Math Speed',
    emoji: '🔢',
    desc: 'Solve as many equations as you can!',
    href: '/tests/math-speed',
    unit: 'correct',
    color: 'from-rose-400 to-pink-500',
    bg: 'bg-rose-50',
  },
] as const;
