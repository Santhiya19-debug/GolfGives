/**
 * SCORE MANAGEMENT
 * Enforces the 5-score rolling window.
 * When a new score is added and the user already has 5, the oldest is removed.
 */

import { Score } from '@/types/database';

export const MAX_SCORES = 5;
export const SCORE_MIN = 1;
export const SCORE_MAX = 45;

export function validateScore(score: number): boolean {
  return Number.isInteger(score) && score >= SCORE_MIN && score <= SCORE_MAX;
}

/**
 * Given the current scores (sorted newest first), returns the ID
 * of the score that should be deleted when adding a new one.
 * Returns null if the user has fewer than MAX_SCORES.
 */
export function getScoreToEvict(scores: Score[]): string | null {
  if (scores.length < MAX_SCORES) return null;
  // Sort by date ascending to find the oldest
  const sorted = [...scores].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return sorted[0].id;
}

export function formatScoreDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const SUBSCRIPTION_PRICES = {
  monthly: 9.99,
  yearly: 99.99, // ~17% discount
};

// Charity gets minimum 10% of subscription fee
export const MIN_CHARITY_PERCENTAGE = 10;

// Prize pool gets remainder after charity cut
export function calculateContributions(
  subscriptionAmount: number,
  charityPercentage: number
): { charityContribution: number; prizePoolContribution: number } {
  const charityContribution = (subscriptionAmount * charityPercentage) / 100;
  const prizePoolContribution = subscriptionAmount - charityContribution;
  return { charityContribution, prizePoolContribution };
}