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
