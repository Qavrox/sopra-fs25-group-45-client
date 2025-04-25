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
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
      {rooms.length === 0 ? (
        <p className="text-gray-600">No rooms available right now.</p>
      ) : (
        rooms.map(room => (
          <div
            key={room.id}
            className="border p-4 rounded flex justify-between items-center hover:shadow transition"
          >
            <div>
              <p className="font-semibold">Game #{room.id}</p>
              <p>{room.players.length}/{room.maximalPlayers} players</p>
              <p>Status: {room.gameStatus}</p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => handleJoin(room.id, room.isPublic)}
              disabled={room.gameStatus !== GameStatus.WAITING}
            >
              Join
            </button>
          </div>
        ))
      )}
    </div>
  );
}