// types/user.ts
export enum ExperienceLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  EXPERT = "Expert"
}

export interface User {
  id: string | null;
  name: string | null;
  username: string | null;
  token: string | null;
  status: string | null;
  creationDate: string; //  Ensure this is included as a string (ISO-8601 format)
  birthDate: string | null;
  experienceLevel: ExperienceLevel;

}

export interface UserSummary {
  id: number;
  username: string;
  online: boolean;
  creationDate: string; // ISO date-time string
  birthday: string; // ISO date string
}

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  profileImage: number;
  experienceLevel: ExperienceLevel;
  birthday: string;
  creationDate: string;
  online: boolean;
}

export interface UserProfileUpdate {
  name?: string;
  profileImage: number;
  experienceLevel?: ExperienceLevel;
  birthday?: string;
}


// Add these interfaces to your user types file

export interface GameHistoryItem {
  id: number;
  date: string;
  result: string;
  winnings: number;
}

export interface StatisticsData {
  gamesPlayed: number;
  winRate: number;
  totalWinnings: number;
  averagePosition: number;
}

export interface LeaderboardItem {
  id: number;
  username: string;
  name: string;
  totalWinnings: number;
  winRate: number;
  gamesPlayed: number;
  rank: number;
}
