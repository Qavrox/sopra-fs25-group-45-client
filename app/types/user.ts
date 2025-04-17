// types/user.ts
export enum ExperienceLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  EXPERT = "Expert"
}

export interface UserSummary {
  id: number;
  username: string;
  online: boolean;
  createdAt: string; // ISO date-time string
  birthday: string; // ISO date string
}

export interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  experienceLevel: ExperienceLevel;
  birthday: string;
  createdAt: string;
  online: boolean;
}

export interface UserProfileUpdate {
  displayName?: string;
  avatarUrl?: string;
  experienceLevel?: ExperienceLevel;
  birthday?: string;
}
