// types/user.ts

export interface User {
  id: string | null;
  name: string | null;
  username: string | null;
  token: string | null;
  status: string | null;
  creationDate: string; //  Ensure this is included as a string (ISO-8601 format)
  birthDate: string | null;
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
