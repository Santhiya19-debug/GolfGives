/**
 * DRAW ENGINE
 * Handles both random and algorithm-based draw number generation.
 * Algorithm mode uses frequency analysis of all user scores to bias
 * draw numbers toward most common scores across the platform.
 */

import { Score } from '@/types/database';

const SCORE_MIN = 1;
const SCORE_MAX = 45;
const DRAW_COUNT = 5;

/**
 * Random draw: generates 5 unique random numbers in range 1–45.
 */
export function generateRandomDraw(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < DRAW_COUNT) {
    numbers.add(Math.floor(Math.random() * SCORE_MAX) + SCORE_MIN);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Algorithm draw: weighted by frequency of scores across all active users.
 * More frequently occurring scores have higher probability of being drawn.
 * This makes the draw feel "earned" — active players with common scores
 * have a statistically higher chance of matching.
 */
export function generateAlgorithmDraw(allScores: Score[]): number[] {
  if (allScores.length === 0) return generateRandomDraw();

  // Build frequency map of all scores
  const freqMap: Record<number, number> = {};
  for (const s of allScores) {
    if (s.score >= SCORE_MIN && s.score <= SCORE_MAX) {
      freqMap[s.score] = (freqMap[s.score] || 0) + 1;
    }
  }

  // Build weighted pool: each score appears proportional to its frequency
  const weightedPool: number[] = [];
  for (let i = SCORE_MIN; i <= SCORE_MAX; i++) {
    const weight = freqMap[i] ? freqMap[i] * 3 : 1; // unrecorded scores still eligible
    for (let w = 0; w < weight; w++) {
      weightedPool.push(i);
    }
  }

  // Shuffle and pick 5 unique numbers
  const numbers = new Set<number>();
  const shuffled = weightedPool.sort(() => Math.random() - 0.5);
  for (const n of shuffled) {
    numbers.add(n);
    if (numbers.size === DRAW_COUNT) break;
  }

  // Fallback to random if we couldn't get 5 unique
  if (numbers.size < DRAW_COUNT) return generateRandomDraw();

  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Compare user's scores against draw numbers.
 * Returns the count of matching numbers (0–5).
 */
export function calculateMatches(userScores: number[], drawNumbers: number[]): number {
  const drawSet = new Set(drawNumbers);
  return userScores.filter(s => drawSet.has(s)).length;
}

/**
 * PRIZE POOL DISTRIBUTION
 * 40% → 5-match jackpot (rolls over if unclaimed)
 * 35% → 4-match
 * 25% → 3-match
 */
export const PRIZE_DISTRIBUTION = {
  5: 0.40,
  4: 0.35,
  3: 0.25,
} as const;

export interface PrizeCalculation {
  jackpotPool: number;
  fourMatchPool: number;
  threeMatchPool: number;
  jackpotWinners: string[];
  fourMatchWinners: string[];
  threeMatchWinners: string[];
  prizePerWinner: { [userId: string]: number };
}

/**
 * Calculate individual prize amounts based on winners per tier.
 * If multiple users match the same tier, prize is split equally.
 * Jackpot rolls over to next month if no 5-match winner.
 */
export function calculatePrizes(
  totalPool: number,
  rolloverAmount: number,
  winnersByMatch: { userId: string; matches: number }[]
): PrizeCalculation {
  const jackpotPool = totalPool * PRIZE_DISTRIBUTION[5] + rolloverAmount;
  const fourMatchPool = totalPool * PRIZE_DISTRIBUTION[4];
  const threeMatchPool = totalPool * PRIZE_DISTRIBUTION[3];

  const jackpotWinners = winnersByMatch.filter(w => w.matches === 5).map(w => w.userId);
  const fourMatchWinners = winnersByMatch.filter(w => w.matches === 4).map(w => w.userId);
  const threeMatchWinners = winnersByMatch.filter(w => w.matches === 3).map(w => w.userId);

  const prizePerWinner: { [userId: string]: number } = {};

  // Jackpot: split among 5-match winners; rolls over if none
  if (jackpotWinners.length > 0) {
    const perPerson = jackpotPool / jackpotWinners.length;
    jackpotWinners.forEach(id => { prizePerWinner[id] = (prizePerWinner[id] || 0) + perPerson; });
  }

  if (fourMatchWinners.length > 0) {
    const perPerson = fourMatchPool / fourMatchWinners.length;
    fourMatchWinners.forEach(id => { prizePerWinner[id] = (prizePerWinner[id] || 0) + perPerson; });
  }

  if (threeMatchWinners.length > 0) {
    const perPerson = threeMatchPool / threeMatchWinners.length;
    threeMatchWinners.forEach(id => { prizePerWinner[id] = (prizePerWinner[id] || 0) + perPerson; });
  }

  return {
    jackpotPool,
    fourMatchPool,
    threeMatchPool,
    jackpotWinners,
    fourMatchWinners,
    threeMatchWinners,
    prizePerWinner,
  };
}