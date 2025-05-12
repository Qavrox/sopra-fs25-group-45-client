'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/api/apiClient';
import { Game, GameActionRequest, Player, PlayerAction, GameStatus, GameResults } from '@/types/game';
import { useRouter } from 'next/navigation';
import styles from './GameTable.module.css';
import TutorialCard from '../RulesAndTutorials/TutorialCard';

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

  const POLLING_INTERVAL = 2000; // Poll every 2 seconds

  useEffect(() => {
    const initializeGame = async () => {
      if (hasJoined.current) return; // Prevent double joining
      
      try {
        // First try to join the game
        await apiClient.joinGame(gameId, '');
        hasJoined.current = true;
        
        // Then fetch the game details
        const gameData = await apiClient.getGameDetails(gameId);
        setGame(gameData);
        setError(null);
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
            console.error('Failed to fetch game results:', err);
          }
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch game state');
        console.error(err);
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

  const handleStartBetting = async () => {
    if (!game) return;
    
    try {
      await apiClient.startBetting(gameId);
      // We'll rely on the poll to update the game state
      // rather than setting a local state variable
    } catch (err) {
      setError('Failed to start betting');
      console.error(err);
    }
  };

  const handleWinProbability = async () => {
    if (!game) return;
    
    try {
      const response = await apiClient.getWinProbability(gameId);
      setWinProbability(response.probability);
      setError(null);
    } catch (err) {
      setError('Failed to fetch win probability');
      console.error(err);
    }
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
      setError('Failed to submit action');
      console.error(err);
    }
  };

  const handleNewGame = () => {
    // This is a dummy function for now
    console.log('New game requested');
  };

  const handleGetAdvice = async () => {
    if (!game) return;
    
    setIsLoadingAdvice(true);
    setPokerAdvice(null);
    
    try {
      const response = await apiClient.getPokerAdvice(gameId);
      setPokerAdvice(response.advice);
      setError(null);
    } catch (err) {
      setError('Failed to get poker advice');
      console.error(err);
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

  if (error || !game) {
    return <div className={styles.errorContainer}>{error || 'Game not found'}</div>;
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
      {/* Top Win Probability Button - Completely separate from the poker table */}
      {canCheckProbability && (
        <div className={styles.topControlsContainer}>
          <button 
            onClick={handleWinProbability}
            className={styles.winProbabilityButton}
          >
            Check Win Probability
          </button>
          {winProbability !== null && (
            <div className={styles.winProbabilityDisplay}>
              Win Probability: {(winProbability * 100).toFixed(2)}%
            </div>
          )}
        </div>
      )}

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
            <div className={styles.gameStats}>
              <h4>Statistics</h4>
              <p>Participation Rate: {gameResults.statistics.participationRate}%</p>
              <p>Pots Won: {gameResults.statistics.potsWon}</p>
            </div>
            <button 
              onClick={handleNewGame}
              className={styles.newGameButton}
            >
              New Game
            </button>
            <button className={styles.returnButton} onClick={() => router.push('/lobby')}>
            Back to lobby
            </button>
          </div>
        )}
        
        {/* Table */}
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

          {/* Host Controls */}
          {canStartGame && (
            <div className={styles.hostControls}>
              <button 
                onClick={handleStartBetting}
                className={styles.startGameButton}
              >
                Start Game
              </button>
            </div>
          )}

          {/* Player Seats */}
          <div className={styles.playersContainer}>
            {game.players.map((player, index) => {
              const angle = (index * 360) / game.players.length;
              const radius = 230; // Increased radius to push players further from center
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const isActive = !player.hasFolded && game.currentPlayerId === player.userId;
              const isCurrentUser = player.userId === apiClient.getUserId();

              return (
                <div
                  key={player.id}
                  className={`${styles.playerSeat} ${isActive ? styles.activePlayer : ''} ${isCurrentUser ? styles.currentPlayer : ''}`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  <div className={styles.playerInfo}>
                    <div className={styles.playerName}>Player {player.userId}</div>
                    <div className={styles.playerCredit}>${player.credit}</div>
                    <div className={styles.playerBet}>Bet: ${player.currentBet}</div>
                    {player.lastAction && (
                      <div className={styles.playerAction}>{player.lastAction}</div>
                    )}
                    {player.hasFolded && (
                      <div className={styles.playerFolded}>FOLDED</div>
                    )}
                  </div>
                  
                  {/* Only show cards for current user in player positions if game is ongoing*/}
                  {isCurrentUser && player.hand.length > 0 && !isGameOver && (
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
