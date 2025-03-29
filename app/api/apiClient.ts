// apiClient.ts
import { ApiService } from "./apiService";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import type { MessageResponse } from "@/types/message";
import type { ApplicationError, ErrorResponse } from "@/types/error";
import type { UserProfile, UserProfileUpdate, UserSummary } from "@/types/user";
import type {
  Game,
  GameActionRequest,
  GameCreationRequest,
  GameResults,
  ProbabilityResponse,
} from "@/types/game";
import type { Preferences, PreferencesUpdate } from "@/types/preferences";

export class ApiClient {
  private apiService: ApiService;
  private token: string | null;

  constructor(token: string | null = null) {
    this.apiService = new ApiService();
    this.token = token;
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
  async login(payload: LoginRequest): Promise<LoginResponse> {
    return this.apiService.post<LoginResponse>("/auth/login", payload);
  }

  async logout(): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>("/auth/logout", {});
  }

  // --- User Endpoints ---
  async getUsers(): Promise<UserSummary[]> {
    return this.apiService.get<UserSummary[]>("/users");
  }

  async getUserProfile(userId: number): Promise<UserProfile> {
    return this.apiService.get<UserProfile>(`/users/${userId}`);
  }

  async updateUserProfile(
    userId: number,
    payload: UserProfileUpdate,
  ): Promise<UserProfile> {
    return this.apiService.put<UserProfile>(`/users/${userId}`, payload);
  }

  // --- Friend Endpoints ---
  async getFriends(): Promise<UserSummary[]> {
    return this.apiService.get<UserSummary[]>("/friends");
  }

  async sendFriendRequest(friendId: number): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/friends/${friendId}/request`,
      {},
    );
  }

  async acceptFriendRequest(friendId: number): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/friends/${friendId}/accept`,
      {},
    );
  }

  async rejectFriendRequest(friendId: number): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/friends/${friendId}/reject`,
      {},
    );
  }

  // --- Game Endpoints ---
  async createGame(payload: GameCreationRequest): Promise<Game> {
    return this.apiService.post<Game>("/games", payload);
  }

  async getPublicGames(): Promise<Game[]> {
    return this.apiService.get<Game[]>("/games");
  }

  async getGameDetails(gameId: number): Promise<Game> {
    return this.apiService.get<Game>(`/games/${gameId}`);
  }

  async joinGame(gameId: number, passcode: string): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(`/games/${gameId}/join`, {
      passcode,
    });
  }

  async submitGameAction(
    gameId: number,
    payload: GameActionRequest,
  ): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/games/${gameId}/actions`,
      payload,
    );
  }

  async getGameResults(gameId: number): Promise<GameResults> {
    return this.apiService.get<GameResults>(`/games/${gameId}/results`);
  }

  async spectateGame(gameId: number): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/games/${gameId}/spectate`,
      {},
    );
  }

  async getWinProbability(gameId: number): Promise<ProbabilityResponse> {
    return this.apiService.get<ProbabilityResponse>(
      `/games/${gameId}/probability`,
    );
  }

  // --- Preferences Endpoints ---
  async updatePreferences(
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
