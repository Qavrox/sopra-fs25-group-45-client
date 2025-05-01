'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/api/apiClient';
import { Game, GameActionRequest, Player, PlayerAction, GameStatus, GameResults } from '@/types/game';
import { useRouter } from 'next/navigation';

interface PokerTableProps {
  gameId: number;
}

export default function PokerTable({ gameId }: PokerTableProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<PlayerAction | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [gameResults, setGameResults] = useState<GameResults | null>(null);
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

  if (isLoading) {
    return <div className="loading-container">Loading game...</div>;
  }

  if (error || !game) {
    return <div className="error-container">{error || 'Game not found'}</div>;
  }

  const isCurrentPlayersTurn = game.currentPlayerId === apiClient.getUserId();
  const currentUserPlayer = game.players.find(p => p.userId === apiClient.getUserId());
  const isHost = game.creatorId === apiClient.getUserId();
  const hasMultiplePlayers = game.players.length > 1;
  const isBettingPhase = game.gameStatus !== GameStatus.WAITING;
  const canStartGame = isHost && hasMultiplePlayers && game.gameStatus === GameStatus.READY;
  const isGameOver = game.gameStatus === GameStatus.GAMEOVER;

  return (
    <div>
      {/* Game Results Display */}
      {isGameOver && gameResults && (
        <div className="game-results" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 200,
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '10px',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
          border: '2px solid gold',
          width: '80%',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: 'gold', marginBottom: '15px' }}>Game Over!</h2>
          <div style={{ marginBottom: '10px' }}>
            <h3>Winner: Player {gameResults.winner.userId}</h3>
            <p>Winning Hand: {gameResults.winningHand}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h4>Statistics</h4>
            <p>Participation Rate: {gameResults.statistics.participationRate}%</p>
            <p>Pots Won: {gameResults.statistics.potsWon}</p>
          </div>
          <button 
            onClick={handleNewGame}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            New Game
          </button>
        </div>
      )}
      
      {/* Table */}
      <div className="poker-table">
        {/* Community Cards */}
        <div className="community-cards">
          {game.communityCards.map((cardId, index) => (
            <div key={index} className="card">
              {cardId}
            </div>
          ))}
        </div>

        {/* Pot Display */}
        <div className="pot-display">
          Pot: ${game.pot}
        </div>

        {/* Game Status */}
        <div className="game-status">
          Status: {game.gameStatus}
        </div>

        {/* Host Controls */}
        {canStartGame && (
          <div className="host-controls" style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <button 
              onClick={handleStartBetting}
              className="start-game-button"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Start Game
            </button>
          </div>
        )}

        {/* Player Seats */}
        <div>
          {game.players.map((player, index) => {
            const angle = (index * 360) / game.players.length;
            const radius = 200;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const isActive = !player.hasFolded && game.currentPlayerId === player.userId;

            return (
              <div
                key={player.id}
                className={`player-seat ${isActive ? 'active' : 'inactive'}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              >
                <div className="player-name">Player {player.userId}</div>
                <div className="player-credit">${player.credit}</div>
                <div className="player-bet">Bet: ${player.currentBet}</div>
                {player.lastAction && (
                  <div className="player-action">Action: {player.lastAction}</div>
                )}
                {player.hasFolded && (
                  <div className="player-folded">FOLDED</div>
                )}
                {player.hand.length > 0 && player.userId === apiClient.getUserId() && (
                  <div className="player-cards">
                    {player.hand.map((card, i) => (
                      <div key={i} className="player-card">
                        {card}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current Player's Hand and Actions */}
        {currentUserPlayer && (
          <div className="user-hand">
            {/* Player's Hand */}
            <div className="user-cards">
              {currentUserPlayer.hand.map((card, index) => (
                <div key={index} className="user-card">
                  {card}
                </div>
              ))}
            </div>

            {/* Action Controls */}
            {isCurrentPlayersTurn && !currentUserPlayer.hasFolded && game.gameStatus !== GameStatus.WAITING && game.gameStatus !== GameStatus.READY && game.gameStatus !== GameStatus.GAMEOVER && (
              <div className="action-controls">
                <div className="action-title">Your Turn - Choose an Action</div>
                <div className="action-buttons">
                  <button
                    onClick={() => setSelectedAction(PlayerAction.FOLD)}
                    className="action-button fold-button"
                  >
                    Fold
                  </button>
                  <button
                    onClick={() => setSelectedAction(PlayerAction.CHECK)}
                    className="action-button check-button"
                  >
                    Check
                  </button>
                  <button
                    onClick={() => setSelectedAction(PlayerAction.CALL)}
                    className="action-button call-button"
                  >
                    Call ${game.callAmount}
                  </button>
                </div>
                <div className="bet-controls">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="bet-input"
                    placeholder="Bet Amount"
                    min={game.callAmount}
                  />
                  <button
                    onClick={() => setSelectedAction(PlayerAction.BET)}
                    className="bet-button"
                  >
                    Bet
                  </button>
                  <button
                    onClick={() => setSelectedAction(PlayerAction.RAISE)}
                    className="raise-button"
                  >
                    Raise
                  </button>
                </div>
                {selectedAction && (
                  <button
                    onClick={handleAction}
                    className="confirm-button"
                  >
                    Confirm {selectedAction}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
