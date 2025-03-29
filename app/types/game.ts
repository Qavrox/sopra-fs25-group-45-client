// types/game.ts
import type { UserSummary } from "./user";

export interface GameCreationRequest {
  isPrivate: boolean;
  passcode?: string; // Required if isPrivate is true
  blindLevels: {
    smallBlind: number;
    bigBlind: number;
  };
  startingChips: number;
  maxPlayers: number;
}

export interface Game {
  id: number;
  isPrivate: boolean;
  blindLevels: {
    smallBlind: number;
    bigBlind: number;
  };
  startingChips: number;
  maxPlayers: number;
  players: UserSummary[];
  status: "waiting" | "in-progress" | "finished";
  createdAt: string;
}

export interface GameActionRequest {
  userId: number;
  action: "check" | "bet" | "call" | "raise" | "fold";
  amount?: number;
}

export interface GameResults {
  winner: UserSummary;
  winningHand: string;
  statistics: {
    participationRate: number;
    potsWon: number;
  };
}

export interface ProbabilityResponse {
  probability: number;
}
