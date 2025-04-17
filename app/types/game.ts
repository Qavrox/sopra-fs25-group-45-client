// types/game.ts
import type { UserSummary } from "./user";

export interface GameCreationRequest {
  isPublic: boolean;
  password?: string; // Required if isPublic is false
  smallBlind: number;
  bigBlind: number;
  startCredit: number;
  maximalPlayers: number;
}

export interface Player {
  id: number;
  userId: number;
  gameId: number;
  credit: number;
  hand: string[];
}

export interface Game {
  id: number;
  isPublic: boolean;
  smallBlind: number;
  bigBlind: number;
  smalllBlindIndex: number;
  startCredit: number;
  maximalPlayers: number;
  pot: number;
  callAmount: number;
  players: Player[];
  status: "waiting" | "in-progress" | "finished";
  createdAt: string;
}

export interface GameActionRequest {
  userId: number;
  action: "check" | "bet" | "call" | "raise" | "fold";
  amount?: number;
}

export interface GameResults {
  winner: Player;
  winningHand: string;
  statistics: {
    participationRate: number;
    potsWon: number;
  };
}

export interface ProbabilityResponse {
  probability: number;
}

export interface NewRoundResponse {
  error?: string;
}
