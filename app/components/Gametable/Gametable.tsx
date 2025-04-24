import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import { apiClient } from '@/services/apiClient';

// Card component for displaying playing cards
const Card = ({ card, hidden = false }) => {
  if (hidden) {
    return (
      <div className="w-16 h-24 rounded-lg bg-red-500 border-2 border-white shadow-md flex items-center justify-center">
        <div className="w-12 h-20 bg-white rounded-lg p-1 flex items-center justify-center">
          <div className="w-full h-full bg-red-500 rounded flex items-center justify-center">
            <div className="text-white font-bold text-2xl">?</div>
          </div>
        </div>
      </div>
    );
  }

  // Parse the card string (e.g., "AS" for Ace of Spades)
  const rank = card ? card.charAt(0) : '';
  const suit = card ? card.charAt(1) : '';

  // Map suit to color and symbol
  const suitMap = {
    'S': { color: 'text-black', symbol: '♠' },
    'H': { color: 'text-red-600', symbol: '♥' },
    'C': { color: 'text-black', symbol: '♣' },
    'D': { color: 'text-red-600', symbol: '♦' }
  };

  const suitStyle = suitMap[suit] || { color: 'text-black', symbol: '?' };

  return (
    <div className="w-16 h-24 rounded-lg bg-white border border-gray-300 shadow-md flex flex-col items-center justify-between p-1">
      <div className={`self-start ${suitStyle.color} font-bold text-xl pl-1`}>
        {rank}
      </div>
      <div className={`${suitStyle.color} text-3xl`}>
        {suitStyle.symbol}
      </div>
      <div className={`self-end ${suitStyle.color} font-bold text-xl pr-1 rotate-180`}>
        {rank}
      </div>
    </div>
  );
};

// Player avatar and info component
const PlayerPosition = ({ player, isActive, position, currentPlayerId }) => {
  const isCurrentPlayer = player && player.userId === currentPlayerId;
  
  return (
    <div className={`absolute ${positionClasses[position]} flex flex-col items-center`}>
      <div className={`relative w-24 h-24 rounded-full ${player ? (isActive ? 'ring-4 ring-yellow-400' : '') : 'bg-gray-200'} flex items-center justify-center`}>
        {player ? (
          <>
            <div className={`w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center ${isCurrentPlayer ? 'bg-green-500' : 'bg-blue-500'}`}>
              <span className="text-white font-bold">{player.username || `Player ${position}`}</span>
            </div>
            <div className="absolute -bottom-6 w-20 bg-gray-800 text-white text-xs py-1 rounded-full">
              ${player.credit || 0}
            </div>
          </>
        ) : (
          <span className="text-gray-400">Empty</span>
        )}
      </div>
      
      {player && player.hand && player.hand.length > 0 && (
        <div className="mt-8 flex space-x-2">
          <Card card={isCurrentPlayer ? player.hand[0] : null} hidden={!isCurrentPlayer} />
          <Card card={isCurrentPlayer ? player.hand[1] : null} hidden={!isCurrentPlayer} />
        </div>
      )}
      
      {player && player.betAmount > 0 && (
        <div className="absolute mt-2 bg-yellow-500 text-xs text-black font-bold px-2 py-1 rounded-full">
          ${player.betAmount}
        </div>
      )}
    </div>
  );
};

// Position classes for player avatars
const positionClasses = {
  0: "bottom-4 left-1/2 -translate-x-1/2", // bottom center
  1: "bottom-1/4 left-12", // bottom left
  2: "top-1/2 left-4 -translate-y-1/2", // middle left
  3: "top-20 left-1/4", // top left
  4: "top-4 left-1/2 -translate-x-1/2", // top center
  5: "top-20 right-1/4", // top right
  6: "top-1/2 right-4 -translate-y-1/2", // middle right
  7: "bottom-1/4 right-12", // bottom right
};

const GameTable = ({ gameId }) => {
  const router = useRouter();
  const { value: token } = useLocalStorage('token', '');
  const { value: userId } = useLocalStorage('userId', '');
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [betAmount, setBetAmount] = useState(0);

  // Fetch game data
  useEffect(() => {
    if (!token || !gameId) return;

    const fetchGameData = async () => {
      try {
        setLoading(true);
        
        // Set token for API client
        apiClient.setToken(token);
        
        // Use the apiClient to get game details
        const data = await apiClient.getGameDetails(parseInt(gameId));
        setGame(data);
      } catch (err) {
        setError(err.message || 'Failed to load game');
        console.error('Error loading game:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
    
    // Set up periodic refresh
    const interval = setInterval(fetchGameData, 5000);
    return () => clearInterval(interval);
  }, [gameId, token]);

  // Handle player action
  const handleAction = async (action) => {
    if (!token || !gameId || !userId) return;
    
    try {
      setLoading(true);
      
      // Set token for API client
      apiClient.setToken(token);
      
      // Create payload for the action
      const payload = {
        action: action,
        userId: parseInt(userId)
      };
      
      if ((action === 'bet' || action === 'raise') && betAmount > 0) {
        payload.amount = betAmount;
      }
      
      // Submit the game action
      await apiClient.submitGameAction(parseInt(gameId), payload);
      
      // Refresh game data
      const updatedGame = await apiClient.getGameDetails(parseInt(gameId));
      setGame(updatedGame);
      
      setSelectedAction(null);
      setBetAmount(0);
    } catch (err) {
      setError(err.message || 'Failed to perform action');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get AI-calculated odds
  const getOdds = async () => {
    if (!token || !gameId) return;
    
    try {
      // Set token for API client
      apiClient.setToken(token);
      
      // Get win probability
      const data = await apiClient.getWinProbability(parseInt(gameId));
      alert(`Your winning probability: ${(data.probability * 100).toFixed(1)}%`);
    } catch (err) {
      setError('Error calculating odds: ' + (err.message || 'Unknown error'));
    }
  };

  // Get current player's data
  const getCurrentPlayer = () => {
    if (!game || !game.players || !userId) return null;
    return game.players.find(p => p.userId === parseInt(userId));
  };
  
  // Get current active player index
  const getActivePlayerIndex = () => {
    if (!game || !game.currentPlayerIndex) return -1;
    return game.currentPlayerIndex;
  };

  // Render loading state
  if (loading && !game) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Loading game...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-red-500">{error}</div>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => router.push('/lobby')}
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  // Prepare player data for positions
  const players = game?.players || [];
  const maxPlayers = game?.maximalPlayers || 8;
  const placeholders = Array(maxPlayers).fill(null);
  
  // Fill positions with actual players
  players.forEach((player, index) => {
    placeholders[index] = player;
  });
  
  // Current player
  const currentPlayer = getCurrentPlayer();
  const activePlayerIndex = getActivePlayerIndex();
  const isPlayerTurn = currentPlayer && activePlayerIndex === players.findIndex(p => p.userId === currentPlayer.userId);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-green-800 relative p-4">
      <div className="absolute top-4 left-4 flex gap-2">
        <button 
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
          onClick={() => router.push('/lobby')}
        >
          Back to Lobby
        </button>
        <div className="px-3 py-1 bg-gray-800 text-white rounded text-sm">
          Game #{gameId}
        </div>
      </div>
      
      {/* Game status display */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-gray-800 text-white rounded text-sm">
        {game?.gameStatus || 'WAITING'}
      </div>
      
      {/* Game table */}
      <div className="relative w-full max-w-5xl h-[600px] bg-green-600 rounded-full border-8 border-brown-600 shadow-2xl">
        {/* Player positions */}
        {placeholders.map((player, index) => (
          <PlayerPosition 
            key={index}
            player={player}
            isActive={index === activePlayerIndex}
            position={index}
            currentPlayerId={parseInt(userId)}
          />
        ))}
        
        {/* Center pot and community cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
          {/* Pot */}
          <div className="bg-yellow-400 px-6 py-3 rounded-full shadow-md">
            <span className="text-black font-bold text-xl">Pot: ${game?.pot || 0}</span>
          </div>
          
          {/* Community cards */}
          <div className="flex gap-2">
            {game?.communityCards && game.communityCards.length > 0 ? (
              game.communityCards.map((card, index) => (
                <Card key={index} card={card} />
              ))
            ) : (
              Array(5).fill(null).map((_, index) => (
                <div key={index} className="w-16 h-24 rounded-lg bg-green-700 border border-green-800" />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Player hand and actions */}
      <div className="mt-4 bg-gray-800 w-full max-w-5xl p-4 rounded-lg flex flex-col items-center">
        {currentPlayer ? (
          <>
            <div className="flex gap-4 mb-4">
              <div>
                <div className="text-white mb-2">Your Hand:</div>
                <div className="flex gap-2">
                  {currentPlayer.hand && currentPlayer.hand.length > 0 ? (
                    currentPlayer.hand.map((card, index) => (
                      <Card key={index} card={card} />
                    ))
                  ) : (
                    <>
                      <div className="w-16 h-24 rounded-lg bg-gray-700" />
                      <div className="w-16 h-24 rounded-lg bg-gray-700" />
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="text-white mb-2">Your Chips:</div>
                <div className="bg-yellow-500 px-4 py-2 rounded text-black font-bold text-xl">
                  ${currentPlayer.credit || 0}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2 mt-2">
              <button 
                className={`px-4 py-2 rounded font-bold ${isPlayerTurn ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                onClick={() => isPlayerTurn && handleAction('check')}
                disabled={!isPlayerTurn}
              >
                Check
              </button>
              <button 
                className={`px-4 py-2 rounded font-bold ${isPlayerTurn ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                onClick={() => isPlayerTurn && setSelectedAction('bet')}
                disabled={!isPlayerTurn}
              >
                Bet
              </button>
              <button 
                className={`px-4 py-2 rounded font-bold ${isPlayerTurn ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                onClick={() => isPlayerTurn && handleAction('call')}
                disabled={!isPlayerTurn}
              >
                Call
              </button>
              <button 
                className={`px-4 py-2 rounded font-bold ${isPlayerTurn ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                onClick={() => isPlayerTurn && setSelectedAction('raise')}
                disabled={!isPlayerTurn}
              >
                Raise
              </button>
              <button 
                className={`px-4 py-2 rounded font-bold ${isPlayerTurn ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                onClick={() => isPlayerTurn && handleAction('fold')}
                disabled={!isPlayerTurn}
              >
                Fold
              </button>
            </div>
            
            {/* Bet/Raise amount input */}
            {selectedAction && (selectedAction === 'bet' || selectedAction === 'raise') && (
              <div className="mt-4 flex gap-2 items-center">
                <input 
                  type="number" 
                  min={1} 
                  max={currentPlayer.credit} 
                  value={betAmount} 
                  onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  className="w-24 px-2 py-1 rounded border border-gray-300 text-black"
                />
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleAction(selectedAction)}
                >
                  Confirm {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
                </button>
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => setSelectedAction(null)}
                >
                  Cancel
                </button>
              </div>
            )}
            
            {/* Helper buttons */}
            <div className="mt-6 flex gap-4">
              <button 
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={getOdds}
              >
                Calculate Odds
              </button>
              <button 
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => alert('Strategy tips would be displayed here')}
              >
                Strategy Tips
              </button>
            </div>
          </>
        ) : (
          <div className="text-white text-xl">You are not in this game or are spectating</div>
        )}
      </div>
    </div>
  );
};

export default GameTable;
