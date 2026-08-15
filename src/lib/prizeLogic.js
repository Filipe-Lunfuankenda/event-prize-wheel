/**
 * Prize Logic Utility
 * 
 * Contains the weighted probabilities for the prize wheel and a helper
 * function to select a prize based on these weights.
 */

/**
 * Prize Probabilities:
 * Pencil -> 27%
 * Bag -> 7%
 * Pen -> 27%
 * Ribbon -> 22%
 * Capsule Dispenser -> 17%
 * No Prize -> 0%
 */

export const PRIZE_WEIGHTS = [
  { label: "Lápis", weight: 27 },
  { label: "Saco", weight: 7 },
  { label: "Caneta", weight: 27 },
  { label: "Fita", weight: 22 },
  { label: "Saca-Cápsulas", weight: 17 },
  { label: "Sem Prémio", weight: 0 },
];

/**
 * Returns a random prize based on the defined weights.
 * @param {Array} prizes - Array of prize objects from PrizeWheel
 * @returns {Object} - The selected prize and its original index
 */
export function getRandomPrizeWeighted(prizes) {
  const totalWeight = PRIZE_WEIGHTS.reduce((acc, p) => acc + p.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < PRIZE_WEIGHTS.length; i++) {
    const weight = PRIZE_WEIGHTS[i].weight;
    if (random < weight) {
      // Find the corresponding index in the original PRIZES array (which may be in a different order)
      const label = PRIZE_WEIGHTS[i].label;
      const index = prizes.findIndex(p => p.label === label);
      return { prize: prizes[index], index };
    }
    random -= weight;
  }
  
  // Fallback
  return { prize: prizes[0], index: 0 };
}
