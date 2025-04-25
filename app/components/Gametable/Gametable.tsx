'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/api/apiClient';
import type { Game, GameActionRequest, Player } from '@/types/game';
import { useRouter } from 'next/navigation';

interface PokerTableProps {
  gameId: number;
}

export default function PokerTable({ gameId }: PokerTableProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<GameActionRequest['action'] | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
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
  }, [gameId, router]);

  const handleAction = async () => {
    if (!game || !selectedAction) return;

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.userId !== apiClient.getUserId()) return;

    try {
      const action: GameActionRequest = {
        userId: currentPlayer.userId,
        action: selectedAction,
        amount: selectedAction === 'bet' || selectedAction === 'raise' ? betAmount : undefined
      };

      await apiClient.submitGameAction(gameId, action);
      setSelectedAction(null);
      setBetAmount(0);
    } catch (err) {
      setError('Failed to submit action');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading game...</div>;
  }

  if (error || !game) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error || 'Game not found'}</div>;
  }

  const currentPlayer = game.players[game.currentPlayerIndex];
  const isCurrentPlayer = currentPlayer?.userId === apiClient.getUserId();
  const currentUserPlayer = game.players.find(p => p.userId === apiClient.getUserId());

  return (
    <div className="relative w-full h-screen bg-green-800">
      {/* Table */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-green-700 rounded-full border-8 border-brown-800">
        {/* Community Cards */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4">
          {game.communityCards.map((card, index) => (
            <div key={index} className="w-20 h-28 bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold">
              {card}
            </div>
          ))}
        </div>

        {/* Pot Display */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold bg-black bg-opacity-50 px-6 py-3 rounded-lg">
          Pot: ${game.pot}
        </div>

        {/* Player Seats */}
        <div className="absolute inset-0">
          {game.players.map((player, index) => {
            const angle = (index * 360) / game.players.length;
            const radius = 200;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <div
                key={player.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                  player.isActive ? 'bg-blue-500' : 'bg-gray-500'
                } rounded-lg p-4 text-white shadow-lg`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              >
                <div className="font-bold">{player.username}</div>
                <div className="text-lg">${player.credit}</div>
                {player.hand.length > 0 && (
                  <div className="flex space-x-2 mt-2">
                    {player.hand.map((card, i) => (
                      <div key={i} className="w-16 h-24 bg-white rounded-lg shadow-lg text-black flex items-center justify-center text-xl font-bold">
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
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full">
            {/* Player's Hand */}
            <div className="flex justify-center space-x-4 mb-4">
              {currentUserPlayer.hand.map((card, index) => (
                <div key={index} className="w-24 h-36 bg-white rounded-lg shadow-lg flex items-center justify-center text-3xl font-bold">
                  {card}
                </div>
              ))}
            </div>

            {/* Action Controls */}
            <div
              className={`bg-black bg-opacity-70 p-6 rounded-t-lg ${
                isCurrentPlayer ? '' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                {/* CHANGE: Text always visible but indicates when not player's turn */}
                <div className="text-white text-xl mb-2">
                  {isCurrentPlayer ? 'Your Turn - Choose an Action' : 'Waiting for your turn'}
                </div>
                <div className="flex space-x-4">
                  {/* CHANGE: Added disabled attribute based on isCurrentPlayer */}
                  <button
                    onClick={() => isCurrentPlayer && setSelectedAction('fold')}
                    className="px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-red-100 text-lg font-bold"
                    disabled={!isCurrentPlayer}
                  >
                    Fold
                  </button>
                  <button
                    onClick={() => isCurrentPlayer && setSelectedAction('check')}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-100 text-lg font-bold"
                    disabled={!isCurrentPlayer}
                  >
                    Check
                  </button>
                  <button
                    onClick={() => isCurrentPlayer && setSelectedAction('call')}
                    className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-100 text-lg font-bold"
                    disabled={!isCurrentPlayer}
                  >
                    Call ${game.callAmount}
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  {/* CHANGE: Disabled input & button when not current player */}
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => isCurrentPlayer && setBetAmount(Number(e.target.value))}
                    className="w-32 px-4 py-2 rounded-lg text-lg"
                    placeholder="Bet Amount"
                    min={game.callAmount}
                    disabled={!isCurrentPlayer}
                  />
                  <button
                    onClick={() => isCurrentPlayer && setSelectedAction('bet')}
                    className="px-6 py-3 bg-white text-yellow-600 rounded-lg hover:bg-yellow-100 text-lg font-bold"
                    disabled={!isCurrentPlayer}
                  >
                    Bet
                  </button>
                </div>
                {/* CHANGE: Confirm button always rendered but disabled when not current player's turn */}
                <button
                  onClick={handleAction}
                  className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-100 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isCurrentPlayer || !selectedAction}
                >
                  {selectedAction ? `Confirm ${selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}` : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
