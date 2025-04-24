'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../api/apiClient';
import type { Game } from '@/types/game';

export default function Lobby() {
  const [rooms, setRooms] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      if (!apiClient.isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const games = await apiClient.getPublicGames();
        // Get only the first 5 games for display
        setRooms(games.slice(0, 5));
      } catch (err) {
        console.error('Failed to load games:', err);
        setError('Unable to load game tables. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleJoin = async (gameId: number, isPublic: boolean) => {
    if (!apiClient.isAuthenticated()) {
      router.push('/login');
      return;
    }

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
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Poker Lobby</h1>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg mb-4">Please log in to view and join games.</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Poker Tables</h1>
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <p className="text-gray-500 text-center py-4">Loading tables...</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.id}
                className="w-48 h-64 border rounded shadow-md p-4 bg-white hover:shadow-lg transition"
              >
                <div className="text-center text-xl font-bold mb-2">Game #{room.id}</div>
                <p>{room.players.length}/{room.maximalPlayers} players</p>
                <p>Status: {room.status}</p>
                <p className="text-sm mt-2">
                  Small Blind: {room.smallBlind || '-'}
                </p>
                <p className="text-sm">
                  Big Blind: {room.bigBlind || '-'}
                </p>
                <p className="text-sm">
                  Starting Credit: {room.startCredit || '-'}
                </p>
                <button
                  onClick={() => handleJoin(room.id, room.isPublic)}
                  disabled={room.status !== 'waiting'}
                  className="w-full mt-auto bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Join
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 w-full text-center py-4">No active tables found.</p>
          )}

          {/* Create Table Card */}
          <div
            onClick={() => router.push('/lobby/create')}
            className="w-48 h-64 border-2 border-dashed rounded shadow-inner flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="text-3xl text-blue-500 mb-2">+</div>
            <p className="font-semibold">Create a Table</p>
            <p className="text-sm text-gray-500 mt-2">Customize blinds</p>
            <p className="text-sm text-gray-500">Set starting credit</p>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.push('/lobby/rooms')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Browse All Tables
        </button>
      </div>
    </main>
  );
}