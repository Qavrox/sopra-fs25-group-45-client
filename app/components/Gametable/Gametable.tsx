'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/api/apiClient';
import { Game, GameActionRequest, Player, PlayerAction, GameStatus, GameResults } from '@/types/game';
import { useRouter } from 'next/navigation';
import styles from './GameTable.module.css';
import TutorialCard from '../RulesAndTutorials/TutorialCard';
import { UserProfile } from '@/types/user';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Timer from '../Timer/Timer';

interface PokerTableProps {
  gameId: number;
}

export default function GameTable({ gameId }: PokerTableProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<PlayerAction | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [gameResults, setGameResults] = useState<GameResults | null>(null);
  const [winProbability, setWinProbability] = useState<number | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [pokerAdvice, setPokerAdvice] = useState<string | null>(null);
  const router = useRouter();
  const hasJoined = useRef(false);
  const [playerProfiles, setPlayerProfiles] = useState<{ [key: number]: UserProfile }>({});
  const [showTimer, setShowTimer] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);

  const POLLING_INTERVAL = 2000; // Poll every 2 seconds
  const ERROR_DISPLAY_DURATION = 5000; // Display errors for 5 seconds

  // Set up error auto-clearing
  useEffect(() => {
    let errorTimeout: NodeJS.Timeout;
    
    if (error) {
      errorTimeout = setTimeout(() => {
        setError(null);
      }, ERROR_DISPLAY_DURATION);
    }
    
    return () => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, [error]);

  useEffect(() => {
    const initializeGame = async () => {
      if (hasJoined.current) return; // Prevent double joining
      
      try {
        // Join the game - no need to pass an empty password string now
        await apiClient.joinGame(gameId);
        hasJoined.current = true;
        
        // Then fetch the game details
        const gameData = await apiClient.getGameDetails(gameId);
        setGame(gameData);
      } catch (err: any) {
        setError(err.message || 'Failed to join game');
        console.error(err);
        // Redirect back to lobby if joining fails
        router.push('/lobby');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchGameState = async () => {
      try {
            const gameData = await apiClient.getGameDetails(gameId);
    setGame(gameData);
    
    // If game is over, fetch results
    if (gameData.gameStatus === GameStatus.GAMEOVER && !gameResults) {
      try {
        const results = await apiClient.getGameResults(gameId);
        setGameResults(results);
      } catch (err) {
        setError(extractErrorMessage(err))
        console.error('Failed to fetch game results:', err);
      }
    }
      } catch (err) {
        setError(extractErrorMessage(err));
        console.error('Failed to fetch game state', err);
        setTimeout(() => {
          router.push("/lobby");
        }, 2000);
      }
    };

    // Initial join and fetch
    initializeGame();

    // Set up polling for game state updates
    const intervalId = setInterval(fetchGameState, POLLING_INTERVAL);

    return () => {
      clearInterval(intervalId);
      hasJoined.current = false; // Reset the ref when component unmounts
    };
  }, [gameId, router, gameResults]);

  useEffect(() => {
    const fetchPlayerProfiles = async () => {
      if (!game) return;
      
      const profiles: { [key: number]: UserProfile } = {};
      for (const player of game.players) {
        if (!profiles[player.userId]) {
          try {
            const profile = await apiClient.getUserProfile(player.userId);
            profiles[player.userId] = profile;
          } catch (error) {
            setError(extractErrorMessage(error));
            console.error(`Failed to fetch profile for user ${player.userId}:`, error);
          }
        }
      }
      setPlayerProfiles(profiles);
    };

    fetchPlayerProfiles();
  }, [game]);

  const handleStartBetting = async () => {
    if (!game) return;
    
    try {
      await apiClient.startBetting(gameId);
      // We'll rely on the poll to update the game state
      // rather than setting a local state variable
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error('Failed to start betting', err);
    }
  };

  const handleWinProbability = async () => {
    if (!game) return;
    
    // Toggle win probability display
    if (winProbability !== null) {
      setWinProbability(null);
      return;
    }
    
    try {
      const response = await apiClient.getWinProbability(gameId);
      setWinProbability(response.probability);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error('Failed to fetch win probability', err);
    }
  };
  
  const extractErrorMessage = (err: any): string => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.message) return err.message;
    return 'An unknown error occurred';
  };

  const handleAction = async () => {
    if (!game || !selectedAction) return;

    const currentUserId = apiClient.getUserId();
    const isCurrentPlayersTurn = game.currentPlayerId === currentUserId;
    
    if (!isCurrentPlayersTurn) return;

    try {
      const action: GameActionRequest = {
        userId: currentUserId,
        action: selectedAction,
        amount: selectedAction === PlayerAction.BET || selectedAction === PlayerAction.RAISE ? betAmount : undefined
      };

      await apiClient.submitGameAction(gameId, action);
      setSelectedAction(null);
      setBetAmount(0);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error(err);
    }
  };

  const handleNewGame = async () => {
    try {
      await apiClient.startNewRound(gameId);
      setGameResults(null);
      setWinProbability(null);
      setSelectedAction(null);
      console.log('New game requested');

    }
    catch(err){ 
      console.log('Failed new Round.')
    }

  };

  const handleReturnToLobby = async () => {
    if (!isHost) {
      try {
        await apiClient.leaveGame(gameId);
      } catch (err) {
        setError(extractErrorMessage(err));
        console.error('Failed to leave game:', err);
      } finally {
        router.push('/lobby');
      }
      return;
    }

    try {
      await apiClient.deleteGame(gameId);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error('Failed to delete game:', err);
    } finally {
      router.push('/lobby');
    }
  };

  const handleTimeUp = async () => {
    if (isPlayerTurn) {
        try {
            if (game && game.currentPlayerId === apiClient.getUserId() && game.gameStatus !== GameStatus.GAMEOVER && game.gameStatus !== GameStatus.WAITING && game.gameStatus !== GameStatus.READY) {
                await apiClient.submitGameAction(gameId, {
                    userId: game.currentPlayerId,
                    action: PlayerAction.FOLD,
                    amount: 0
                });
                setShowTimer(false);
                setIsPlayerTurn(false);
            }
        } catch (error) {
            console.error('Failed to auto-fold:', error);
        }
    }
  };
  useEffect(() => {
    if (game && game.currentPlayerId === apiClient.getUserId() && game.gameStatus !== GameStatus.GAMEOVER && game.gameStatus !== GameStatus.WAITING && game.gameStatus !== GameStatus.READY) {
        setIsPlayerTurn(true);
        setShowTimer(true);
    } else {
        setIsPlayerTurn(false);
        setShowTimer(false);
    }
}, [game, apiClient.getUserId()]);

  const handleGetAdvice = async () => {
    if (!game) return;
    
    // Toggle advice display
    if (pokerAdvice !== null) {
      setPokerAdvice(null);
      return;
    }
    
    setIsLoadingAdvice(true);
    
    try {
      const response = await apiClient.getPokerAdvice(gameId);
      setPokerAdvice(response.advice);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error('Failed to get poker advice',err);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  // Helper function to render a card with proper suit and value display
  const renderCard = (card: string) => {
    if (!card || card.length < 2) return null;
    
    const value = card.charAt(0);
    const suit = card.charAt(1);
    
    let displayValue = value;
    if (value === 'T' || value === '10') displayValue = '10';
    
    let suitSymbol = '';
    let suitColor = '';
    
    switch(suit.toUpperCase()) {
      case 'S':
        suitSymbol = '♠';
        suitColor = 'black';
        break;
      case 'H':
        suitSymbol = '♥';
        suitColor = 'red';
        break;
      case 'D':
        suitSymbol = '♦';
        suitColor = 'red';
        break;
      case 'C':
        suitSymbol = '♣';
        suitColor = 'black';
        break;
      default:
        suitSymbol = suit;
    }
    
    return (
      <div className={styles.card}>
        <div className={styles.cardCorner} style={{ color: suitColor }}>
          <div className={styles.cardValue}>{displayValue}</div>
          <div className={styles.cardSuit}>{suitSymbol}</div>
        </div>
        <div className={styles.cardCenter} style={{ color: suitColor }}>{suitSymbol}</div>
        <div className={styles.cardCornerBottom} style={{ color: suitColor }}>
          <div className={styles.cardValue}>{displayValue}</div>
          <div className={styles.cardSuit}>{suitSymbol}</div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading game...</div>;
  }

  if (!game) {
    return <div className={styles.errorContainer}>Game not found</div>;
  }

  const isCurrentPlayersTurn = game.currentPlayerId === apiClient.getUserId();
  const currentUserPlayer = game.players.find(p => p.userId === apiClient.getUserId());
  const isHost = game.creatorId === apiClient.getUserId();
  const hasMultiplePlayers = game.players.length > 1;
  const isBettingPhase = game.gameStatus !== GameStatus.WAITING;
  const canStartGame = isHost && hasMultiplePlayers && game.gameStatus === GameStatus.READY;
  const isGameOver = game.gameStatus === GameStatus.GAMEOVER;
  const canCheckProbability = isBettingPhase && currentUserPlayer && !currentUserPlayer.hasFolded;

  return (
    <div className={styles.mainContainer}>
      {/* Error Dialog */}
      {error && (
        <div className={styles.errorDialog}>
          <div className={styles.errorContent}>
            <div className={styles.errorMessage}>{error}</div>
            <button 
              className={styles.errorCloseButton}
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Top Win Probability Button - Completely separate from the poker table */}
      <div className={styles.topControlsContainer}>
        {canStartGame && (
          <button 
            onClick={handleStartBetting}
            className={styles.startGameButton}
          >
            Start Game
          </button>
        )}
        {canCheckProbability && (
          <button 
            onClick={handleWinProbability}
            className={styles.winProbabilityButton}
          >
            Check Win Probability
          </button>
        )}
        {winProbability !== null && (
          <div className={styles.winProbabilityDisplay}>
            Win Probability: {(winProbability * 100).toFixed(2)}%
          </div>
        )}
      </div>

      <div className={styles.pokerTableContainer}>
        {/* Tutorial Card Component */}
        <TutorialCard />
        
        {/* Help Button and Advice Display */}
        <div className={styles.helpContainer}>
          <button 
            onClick={handleGetAdvice}
            className={styles.helpButton}
            disabled={isLoadingAdvice}
          >
            <span className={styles.helpIcon}>?</span>
            <span className={styles.helpText}>Need help? Get help from Gemini</span>
          </button>
          {isLoadingAdvice && (
            <div className={styles.adviceLoading}>
              <div className={styles.loadingSpinner}></div>
              <span>Getting advice...</span>
            </div>
          )}
          {pokerAdvice && (
            <div className={styles.adviceDisplay}>
              {pokerAdvice}
            </div>
          )}
        </div>

        {/* Game Results Display */}
        {isGameOver && gameResults && (
          <div className={styles.gameResults}>
            <h2 className={styles.gameResultsTitle}>Game Over!</h2>
            <div className={styles.winnerInfo}>
              <h3>Winner: Player {gameResults.winner.userId}</h3>
              <p>Winning Hand: {gameResults.winningHand}</p>
            </div>
            
            {/* Display Community Cards */}
            <div className={styles.resultsSection}>
              <h4>Community Cards</h4>
              <div className={styles.resultCards}>
                {game.communityCards.map((card, index) => (
                  <div key={`community-${index}`} className={styles.resultCardWrapper}>
                    {renderCard(card)}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Display Winner's Hand */}
            <div className={styles.resultsSection}>
              <h4>Winner's Hand - Player {gameResults.winner.userId}</h4>
              <div className={styles.resultCards}>
                {gameResults.winner.hand.map((card, index) => (
                  <div key={`winner-${index}`} className={styles.resultCardWrapper}>
                    {renderCard(card)}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Display All Players' Hands */}
            <div className={styles.resultsSection}>
              <h4>All Players' Hands</h4>
              <div className={styles.allPlayerCards}>
                {game.players.filter(player => player.userId !== gameResults.winner.userId).map((player) => (
                  <div key={`player-${player.userId}`} className={styles.playerHandResult}>
                    <div className={styles.playerHandLabel}>
                      Player {player.userId} {player.hasFolded ? "(Folded)" : ""}
                    </div>
                    <div className={styles.resultCards}>
                      {player.hand.map((card, index) => (
                        <div key={`player-${player.userId}-card-${index}`} className={styles.resultCardWrapper}>
                          {renderCard(card)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.gameStats}>
              <h4>Statistics</h4>
              <p>Participation Rate: {gameResults.statistics.participationRate}%</p>
              <p>Pots Won: {gameResults.statistics.potsWon}</p>
            </div>
            
            <div className={styles.resultButtons}>
              {isHost && (
                <button 
                  onClick={handleNewGame}
                  className={styles.newGameButton}
                >
                  New Game
                </button>
              )}
              <button className={styles.returnButton} onClick={handleReturnToLobby}>
                Back to Lobby
              </button>
            </div>
          </div>
        )}
          {/* Timer */}
            {showTimer && (
              <div className={styles.timerContainer}>
                  <Timer 
                      initialTime={30}
                      onTimeUp={handleTimeUp}
                      isRunning={isPlayerTurn}
                  />
              </div>
            )}
        
        <div className={styles.pokerTable}>
  

          {/* Community Cards */}
          <div className={styles.communityCards}>
            {game.communityCards.map((card, index) => (
              <div key={index} className={styles.communityCardWrapper}>
                {renderCard(card)}
              </div>
            ))}
          </div>

          {/* Pot Display */}
          <div className={styles.potDisplay}>
            <div className={styles.potAmount}>${game.pot}</div>
          </div>

          {/* Game Status */}
          <div className={styles.gameStatus}>
            <span className={styles.statusLabel}>Status:</span> 
            <span className={styles.statusValue}>{game.gameStatus}</span>
          </div>

          {/* Player Seats */}
          <div className={styles.playersContainer}>
            {game.players.map((player, index) => {
              const angle = (index * 360) / game.players.length;
              const radius = 350; // Increased from 230 to 350 to push players further from center
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const isActive = !player.hasFolded && game.currentPlayerId === player.userId;
              const isCurrentUser = player.userId === apiClient.getUserId();
              const shouldShowCards = isCurrentUser || isGameOver; // Show cards for current user or when game is over
              const isWinner = isGameOver && gameResults && gameResults.winner.userId === player.userId;

              return (
                <div
                  key={player.id}
                  className={`${styles.playerSeat} ${isActive ? styles.activePlayer : ''} ${isCurrentUser ? styles.currentPlayer : ''} ${isWinner ? styles.winnerPlayer : ''}`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  <div className={styles.playerInfo}>
                    <div className={styles.playerName}>
                      <Avatar
                        src={playerProfiles[player.userId] ? `/images/avatar${playerProfiles[player.userId].profileImage || 0}.png` : undefined}
                        icon={!playerProfiles[player.userId] && <UserOutlined />}
                        size={100}
                        style={{ marginRight: '12px' }}
                      />
                      Player {player.userId}
                    </div>
                    <div className={styles.playerCredit}>${player.credit}</div>
                    <div className={styles.playerBet}>Bet: ${player.currentBet}</div>
                    {player.lastAction && (
                      <div className={styles.playerAction}>{player.lastAction}</div>
                    )}
                    {player.hasFolded && (
                      <div className={styles.playerFolded}>FOLDED</div>
                    )}
                    {isWinner && (
                      <div className={styles.winnerBadge}>WINNER!</div>
                    )}
                  </div>
                  
                  {/* Show cards for current user or when game is over */}
                  {shouldShowCards && player.hand.length > 0 && (
                    <div className={styles.playerCards}>
                      {player.hand.map((card, i) => (
                        <div key={i} className={styles.playerCardWrapper}>
                          {renderCard(card)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Controls - Only shown at the bottom when it's current player's turn */}
          {currentUserPlayer && isCurrentPlayersTurn && !currentUserPlayer.hasFolded && 
           game.gameStatus !== GameStatus.WAITING && game.gameStatus !== GameStatus.READY && 
           game.gameStatus !== GameStatus.GAMEOVER && (
            <div className={styles.actionControlsContainer}>
              <div className={styles.actionTitle}>Your Turn - Choose an Action</div>
              <div className={styles.actionButtons}>
                <button
                  onClick={() => setSelectedAction(PlayerAction.FOLD)}
                  className={`${styles.actionButton} ${styles.foldButton}`}
                >
                  Fold
                </button>
                <button
                  onClick={() => setSelectedAction(PlayerAction.CHECK)}
                  className={`${styles.actionButton} ${styles.checkButton}`}
                >
                  Check
                </button>
                <button
                  onClick={() => setSelectedAction(PlayerAction.CALL)}
                  className={`${styles.actionButton} ${styles.callButton}`}
                >
                  Call ${game.callAmount}
                </button>
              </div>
              <div className={styles.betControls}>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className={styles.betInput}
                  placeholder="Bet Amount"
                  min={game.callAmount}
                />
                <button
                  onClick={() => setSelectedAction(PlayerAction.BET)}
                  className={`${styles.actionButton} ${styles.betButton}`}
                >
                  Bet
                </button>
                <button
                  onClick={() => setSelectedAction(PlayerAction.RAISE)}
                  className={`${styles.actionButton} ${styles.raiseButton}`}
                >
                  Raise
                </button>
              </div>
              {selectedAction && (
                <button
                  onClick={handleAction}
                  className={styles.confirmButton}
                >
                  Confirm {selectedAction}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
