'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import type { Game } from '@/types/game';
import { useRouter } from 'next/navigation';

export default function RoomBrowser() {
  const [rooms, setRooms] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        const games = await apiClient.getPublicGames();
        setRooms(games);
      } catch (err) {
        console.error('Failed to load rooms:', err);
        setError('Failed to load available rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleJoin = async (gameId: number, isPublic: boolean) => {
    try {
      let password = '';
      if (!isPublic) {
        password = prompt('Enter password:') || '';
        if (!password) return;
      }

      await apiClient.joinGame(gameId, password);
      router.push(`/game/${gameId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to join game. Please try again.');
    }
  };

  if (!apiClient.isAuthenticated()) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500 mb-4">Please log in to see available rooms.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) return <p className="text-center text-gray-500 p-6">Loading rooms...</p>;
  if (error) return (
    <div className="text-center p-6">
      <p className="text-red-500 mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );

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
              <p>Status: {room.status}</p>
              <div className="text-sm text-gray-600 mt-1">
                <p>Blinds: {room.smallBlind || '-'}/{room.bigBlind || '-'}</p>
                <p>Starting Credit: {room.startCredit || '-'}</p>
              </div>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => handleJoin(room.id, room.isPublic)}
              disabled={room.status !== 'waiting'}
            >
              Join
            </button>
          </div>
        ))
      )}
    </div>
  );
}