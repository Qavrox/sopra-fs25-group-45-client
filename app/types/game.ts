// types/game.ts
import type { UserSummary } from "./user";

export interface GameCreationRequest {
  creatorId: number;
  isPublic: boolean;
  password?: string; // Required if isPublic is false
  smallBlind: number;
  bigBlind: number;
  startCredit: number;
  maximalPlayers: number;
}

export enum PlayerAction {
  CHECK = "CHECK",
  BET = "BET",
  CALL = "CALL",
  RAISE = "RAISE",
  FOLD = "FOLD"
}

export interface Player {
  id: number;
  userId: number;
  username: string;
  gameId: number;
  credit: number;
  hand: string[];
  currentBet: number;
  hasFolded: boolean;
  hasActed: boolean;
  lastAction?: PlayerAction;
}

export enum GameStatus {
  WAITING = "WAITING",
  READY = "READY",
  PREFLOP = "PREFLOP",
  FLOP = "FLOP",
  TURN = "TURN",
  RIVER = "RIVER",
  SHOWDOWN = "SHOWDOWN",
  GAMEOVER = "GAMEOVER"
}

export interface Game {
  id: number;
  creatorId: number;
  password?: string;
  isPublic: boolean;
  maximalPlayers: number;
  startCredit: number;
  smallBlind: number;
  bigBlind: number;
  gameStatus: GameStatus;
  pot: number;
  callAmount: number;
  smallBlindIndex: number;
  numberOfPlayers: number;
  communityCards: number[];
  players: Player[];
  currentPlayerId: number;
}

export interface GameActionRequest {
  userId: number;
  action: PlayerAction;
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
