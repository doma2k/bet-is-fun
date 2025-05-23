type BetResult = {
  won: boolean;
  userNumber: number;
  winningNumber: number;
  payout: number;
  betAmount: number;
};

type GameConfig = {
  multiplier: number; // Payout multiplier
  houseEdge: number; // House edge percentage (1-10)
  winChance: number; // Chance to win percentage (1-95)
};

export type { BetResult, GameConfig };
