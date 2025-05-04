'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { GameStatus, type Game } from '@/types/game';
import { useRouter } from 'next/navigation';

export default function RoomBrowser() {
  const [rooms, setRooms] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!apiClient.isAuthenticated()) return;

    apiClient.getPublicGames()
      .then(setRooms)
      .catch(() => alert('Failed to load rooms'))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (gameId: number, isPublic: boolean) => {
    const password = isPublic ? '' : prompt('Enter password:') || '';

    try {
      await apiClient.joinGame(gameId, password);
      router.push(`/game/${gameId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to join game');
    }
  };

  if (!apiClient.isAuthenticated()) {
    return <p className="text-center text-gray-500">Please log in to see available rooms.</p>;
  }
  if (loading) return <p className="text-center text-gray-500">Loading rooms...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold tracking-wide text-center mb-6">
          🃏 Available Poker Rooms
        </h2>
  
        {rooms.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">No rooms available right now.</p>
        ) : (
          rooms.map(room => (
            <div
              key={room.id}
              className="bg-white text-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold mb-1">Game #{room.id}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    {room.players.length}/{room.maximalPlayers} players
                  </p>
                  <p className="text-sm">
                    Status:{' '}
                    <span className={`font-medium ${
                      room.gameStatus === GameStatus.WAITING ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {room.gameStatus}
                    </span>
                  </p>
                </div>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => handleJoin(room.id, room.isPublic)}
                  disabled={room.gameStatus !== GameStatus.WAITING}
                >
                  Join
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
