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
  NewRoundResponse,
} from "@/types/game";
import type { Preferences, PreferencesUpdate } from "@/types/preferences";

const TOKEN_STORAGE_KEY = "bearer_token";

/**
 * Provides an abstraction for interacting with the backend API
 */
export class ApiClient {
  private apiService: ApiService;
  private token: string | null;

  constructor() {
    this.apiService = new ApiService();
    // Load token from localStorage on initialization
    this.token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    this.updateAuthHeader();
  }

  public setToken(token: string | null): void {
    this.token = token;
    // Persist token to localStorage
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
    this.updateAuthHeader();
  }

  /**
   * Check if the user is currently authenticated
   * @returns boolean indicating if user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.token !== null;
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
  async login(payload: LoginRequest) {
    try {
      const response = await this.apiService.post<LoginResponse>("/auth/login", payload);
      this.setToken(response.token);
    } catch (error) {
      this.setToken(null); // Clear token on login failure
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.apiService.post<MessageResponse>("/auth/logout", {});
      this.setToken(null); // Clear token on successful logout
    } catch (error) {
      this.setToken(null); // Clear token even if logout request fails
      throw error;
    }
  }

  async register(payload: UserProfileUpdate & { username: string; password: string }) {
    try {
      const response = await this.apiService.post<LoginResponse>("/auth/register", payload);
      this.setToken(response.token);
      return response;
    } catch (error) {
      this.setToken(null); // Clear token on registration failure
      throw error;
    }
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

  deleteGame(gameId: number): Promise<MessageResponse> {
    return this.apiService.delete<MessageResponse>(`/games/${gameId}`);
  }

  joinGame(gameId: number, password: string): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(`/games/${gameId}/join`, {
      password,
    });
  }

  leaveGame(gameId: number): Promise<MessageResponse> {
    return this.apiService.delete<MessageResponse>(`/games/${gameId}/join`);
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

  startNewRound(gameId: number): Promise<NewRoundResponse> {
    return this.apiService.post<NewRoundResponse>(
      `/games/${gameId}/newround`,
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
