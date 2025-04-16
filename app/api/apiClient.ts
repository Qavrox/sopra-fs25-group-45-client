// apiClient.ts
import { ApiService } from "./apiService";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import type { MessageResponse } from "@/types/message";
import type { UserProfile, UserProfileUpdate, UserSummary } from "@/types/user";
import type {
  Game,
  GameActionRequest,
  GameCreationRequest,
  GameResults,
  ProbabilityResponse,
} from "@/types/game";
import type { Preferences, PreferencesUpdate } from "@/types/preferences";

/**
 * Provides an abstraction for interacting with the backend API
 */
export class ApiClient {
  private apiService: ApiService;
  private token: string | null;

  constructor() {
    this.apiService = new ApiService();
    this.token = null;
    this.updateAuthHeader();
  }

  public setToken(token: string | null): void {
    this.token = token;
    this.updateAuthHeader();
  }

  /**
   * Update the ApiService default headers with the Authorization token.
   * (Using a type assertion to update the private field)
   */
  private updateAuthHeader(): void {
    // NOTE: This hack accesses the private defaultHeaders from apiService.
    if (this.token) {
      (this.apiService as any).defaultHeaders["Authorization"] =
        `Bearer ${this.token}`;
    } else {
      delete (this.apiService as any).defaultHeaders["Authorization"];
    }
  }

  // --- Auth Endpoints ---
  login(payload: LoginRequest): Promise<LoginResponse> {
    return this.apiService.post<LoginResponse>("/auth/login", payload);
  }

  logout(): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>("/auth/logout", {});
  }

  // --- User Endpoints ---
  getUsers(): Promise<UserSummary[]> {
    return this.apiService.get<UserSummary[]>("/users");
  }

  getUserProfile(userId: number): Promise<UserProfile> {
    return this.apiService.get<UserProfile>(`/users/${userId}`);
  }

  updateUserProfile(
    userId: number,
    payload: UserProfileUpdate,
  ): Promise<UserProfile> {
    return this.apiService.put<UserProfile>(`/users/${userId}`, payload);
  }

  // --- Friend Endpoints ---
  getFriends(): Promise<UserSummary[]> {
    return this.apiService.get<UserSummary[]>("/friends");
  }

  sendFriendRequest(friendId: number): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/friends/${friendId}/request`,
      {},
    );
  }

  acceptFriendRequest(friendId: number): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/friends/${friendId}/accept`,
      {},
    );
  }

  rejectFriendRequest(friendId: number): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/friends/${friendId}/reject`,
      {},
    );
  }

  // --- Game Endpoints ---
  createGame(payload: GameCreationRequest): Promise<Game> {
    return this.apiService.post<Game>("/games", payload);
  }

  getPublicGames(): Promise<Game[]> {
    return this.apiService.get<Game[]>("/games");
  }

  getGameDetails(gameId: number): Promise<Game> {
    return this.apiService.get<Game>(`/games/${gameId}`);
  }

  joinGame(gameId: number, passcode: string): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(`/games/${gameId}/join`, {
      passcode,
    });
  }

  submitGameAction(
    gameId: number,
    payload: GameActionRequest,
  ): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/games/${gameId}/actions`,
      payload,
    );
  }

  getGameResults(gameId: number): Promise<GameResults> {
    return this.apiService.get<GameResults>(`/games/${gameId}/results`);
  }

  spectateGame(gameId: number): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/games/${gameId}/spectate`,
      {},
    );
  }

  getWinProbability(gameId: number): Promise<ProbabilityResponse> {
    return this.apiService.get<ProbabilityResponse>(
      `/games/${gameId}/probability`,
    );
  }

  // --- Preferences Endpoints ---
  updatePreferences(
    userId: number,
    payload: PreferencesUpdate,
  ): Promise<Preferences> {
    return this.apiService.put<Preferences>(
      `/users/${userId}/preferences`,
      payload,
    );
  }
}
// Export a singleton instance for convenience.
export const apiClient = new ApiClient();
export default ApiClient;
