// apiClient.ts
import { ApiService } from "./apiService";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import type { MessageResponse, PokerAdviceResponse } from "@/types/message";
import type { GameHistoryItem, LeaderboardItem, StatisticsData, UserProfile, UserProfileUpdate, UserSummary } from "@/types/user";
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
const USER_ID_STORAGE_KEY = "user_id";
const GAME_PASSWORD_PREFIX = "game_password_";

/**
 * Provides an abstraction for interacting with the backend API
 */
export class ApiClient {
  private apiService: ApiService;
  private token: string | null;
  private userId: number | null;

  constructor() {
    this.apiService = new ApiService();
    // Load token and userId from localStorage on initialization
    this.token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem(USER_ID_STORAGE_KEY) : null;
    this.userId = storedUserId ? parseInt(storedUserId, 10) : null;
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

  public setUserId(userId: number | null): void {
    this.userId = userId;
    // Persist userId to localStorage
    if (typeof window !== 'undefined') {
      if (userId !== null) {
        localStorage.setItem(USER_ID_STORAGE_KEY, userId.toString());
      } else {
        localStorage.removeItem(USER_ID_STORAGE_KEY);
      }
    }
  }

  /**
   * Get the current user's ID
   * @returns The current user's ID or null if not logged in
   */
  public getUserId(): number | null {
    return this.userId;
  }

  /**
   * Check if the user is currently authenticated
   * @returns boolean indicating if user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.token !== null && this.userId !== null;
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

  // --- Game Password Management ---
  
  /**
   * Store a game password in localStorage
   * @param gameId The ID of the game
   * @param password The password for the game
   */
  public storeGamePassword(gameId: number, password: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${GAME_PASSWORD_PREFIX}${gameId}`, password);
    }
  }

  /**
   * Get a stored game password from localStorage
   * @param gameId The ID of the game
   * @returns The password for the game or null if not found
   */
  public getGamePassword(gameId: number): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`${GAME_PASSWORD_PREFIX}${gameId}`);
    }
    return null;
  }

  /**
   * Clear a stored game password from localStorage
   * @param gameId The ID of the game
   */
  public clearGamePassword(gameId: number): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${GAME_PASSWORD_PREFIX}${gameId}`);
    }
  }

  // --- Auth Endpoints ---
  async login(payload: LoginRequest) {
    try {
      const response = await this.apiService.post<LoginResponse>("/auth/login", payload);
      this.setToken(response.token);
      this.setUserId(response.user.id);
    } catch (error) {
      this.setToken(null); // Clear token on login failure
      this.setUserId(null); // Clear userId on login failure
      throw error; // Directly propagate the error with server message
    }
  }

  async logout() {
    try {
      const _response = await this.apiService.post<MessageResponse>("/auth/logout", {});
      this.setToken(null); // Clear token on successful logout
      this.setUserId(null); // Clear userId on successful logout
    } catch (error) {
      this.setToken(null); // Clear token even if logout request fails
      this.setUserId(null); // Clear userId even if logout request fails
      throw error;
    }
  }

  async register(payload: UserProfileUpdate & { username: string; password: string }) {
    try {
      const response = await this.apiService.post<LoginResponse>("/auth/register", payload);
      this.setToken(response.token);
      this.setUserId(response.user.id);
      return response;
    } catch (error) {
      this.setToken(null); // Clear token on registration failure
      this.setUserId(null); // Clear userId on registration failure
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

  getFriendRequests(): Promise<UserSummary[]> {
    return this.apiService.get<UserSummary[]>("/friends/requests");
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
    return this.apiService.post<Game>("/games", payload).then(game => {
      // Store password for private games
      if (!payload.isPublic && payload.password) {
        this.storeGamePassword(game.id, payload.password);
      }
      return game;
    });
  }

  getPublicGames(): Promise<Game[]> {
    return this.apiService.get<Game[]>("/games");
  }

  getGameDetails(gameId: number): Promise<Game> {
    return this.apiService.get<Game>(`/games/${gameId}`);
  }

  deleteGame(gameId: number): Promise<MessageResponse> {
    return this.apiService.deleteWithAuth<MessageResponse>(`/games/${gameId}`,
      this.token ?? "");
  }

  joinGame(gameId: number, password?: string): Promise<MessageResponse> {
    // If password is not provided, try to get it from storage
    const finalPassword = password || this.getGamePassword(gameId) || "";
    return this.apiService.post<MessageResponse>(`/games/${gameId}/join`, {
      password: finalPassword,
    });
  }

  leaveGame(gameId: number): Promise<MessageResponse> {
    // Clear password when leaving a game
    this.clearGamePassword(gameId);
    return this.apiService.deleteWithAuth<MessageResponse>(`/games/${gameId}/join`,
      this.token ?? "");
  }

  submitGameAction(
    gameId: number,
    payload: GameActionRequest,
  ): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/games/${gameId}/action`,
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

  getPokerAdvice(gameId: number): Promise<PokerAdviceResponse> {
    return this.apiService.get<PokerAdviceResponse>(`/games/${gameId}/advice`);
  }

  startBetting(gameId: number): Promise<MessageResponse> {
    return this.apiService.post<MessageResponse>(
      `/games/${gameId}/start-betting`,
      {},
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

  // --- Game History and Statistics Endpoints ---
  getUserGameHistory(userId: number): Promise<GameHistoryItem[]> {
    return this.apiService.get<GameHistoryItem[]>(`/users/${userId}/history`);
  }

  getUserStatistics(userId: number, startDate?: string, endDate?: string): Promise<StatisticsData> {
    let url = `/users/${userId}/statistics`;
    const params = new URLSearchParams();
    if (startDate) {
      params.append('startDateStr', startDate);
    }
    if (endDate) {
      params.append('endDateStr', endDate);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return this.apiService.get<StatisticsData>(url);
  }

  getLeaderboardByWinnings(): Promise<LeaderboardItem[]> {
    return this.apiService.get<LeaderboardItem[]>(`/leaderboard/winnings`);
  }

  getLeaderboardByWinRate(): Promise<LeaderboardItem[]> {
    return this.apiService.get<LeaderboardItem[]>(`/leaderboard/winrate`);
  }

  getFriendLeaderboardByWinnings(): Promise<LeaderboardItem[]> {
    return this.apiService.get<LeaderboardItem[]>(`/leaderboard/friends/winnings`);
  }

  getFriendLeaderboardByWinRate(): Promise<LeaderboardItem[]> {
    return this.apiService.get<LeaderboardItem[]>(`/leaderboard/friends/winrate`);
  }



  // use as default
  getLeaderboard(): Promise<LeaderboardItem[]> {
    return this.getLeaderboardByWinnings();
  }
}
// Export a singleton instance for convenience.
export const apiClient = new ApiClient();
export default ApiClient;
