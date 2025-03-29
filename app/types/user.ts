// types/user.ts
export interface UserSummary {
  id: number;
  username: string;
  online: boolean;
  createdAt: string; // ISO date-time string
  birthday: string;  // ISO date string
}

export interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  experienceLevel: "Beginner" | "Intermediate" | "Expert";
  birthday: string;
  createdAt: string;
  online: boolean;
}

export interface UserProfileUpdate {
  displayName?: string;
  avatarUrl?: string;
  experienceLevel?: "Beginner" | "Intermediate" | "Expert";
  birthday?: string;
}