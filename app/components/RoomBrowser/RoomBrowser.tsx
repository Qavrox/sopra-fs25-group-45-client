'use client';
import { useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

interface Room {
  id: number;
  isPublic: boolean;
  maximalPlayers: number;
  numberOfPlayers: number;
  gameStatus: string;
}

export default function RoomBrowser() {
  const { value: token } = useLocalStorage<string>('token', '');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch('/api/games', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setRooms)
      .catch(() => alert('Failed to load rooms'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleJoin = async (gameId: number, isPublic: boolean) => {
    const password = isPublic ? '' : prompt('Enter password:') || '';

    try {
      const res = await fetch(`/api/games/${gameId}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = `/game/${gameId}`;
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to join game');
      }
    } catch {
      alert('An unexpected error occurred while joining the room');
    }
  };

  if (!token) return <p className="text-center text-gray-500">Please log in to see available rooms.</p>;
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
              <p>{room.numberOfPlayers}/{room.maximalPlayers} players</p>
              <p>Status: {room.gameStatus}</p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => handleJoin(room.id, room.isPublic)}
              disabled={room.gameStatus !== 'WAITING'}
            >
              Join
            </button>
          </div>
        ))
      )}
    </div>
  );
}