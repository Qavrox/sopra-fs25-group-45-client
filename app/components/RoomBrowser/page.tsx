'use client';
import { useEffect, useState } from 'react';

interface Room {
  gameId: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  status: 'waiting' | 'in-progress' | 'full';
}

export default function RoomBrowser() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null); // Add token logic

  useEffect(() => {
    // Ideally, you get token from context or localStorage
    const bearer = localStorage.getItem('token');
    setToken(bearer);

    if (!bearer) return;

    fetch('/api/games', {
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleJoin = async (gameId: string) => {
    if (!token) return alert('Login required');

    try {
      const res = await fetch(`/api/games/${gameId}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        window.location.href = `/game/${gameId}`;
      } else {
        alert('Failed to join room');
      }
    } catch (error) {
      console.error(error);
      alert('Error joining room');
    }
  };

  if (!token) return <p>Please log in to see available rooms.</p>;
  if (loading) return <p>Loading rooms...</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
      {rooms.length === 0 && <p>No rooms available.</p>}
      {rooms.map(room => (
        <div key={room.gameId} className="border p-4 rounded flex justify-between items-center">
          <div>
            <p className="font-semibold">{room.name}</p>
            <p>{room.currentPlayers}/{room.maxPlayers} players</p>
            <p>Status: {room.status}</p>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={() => handleJoin(room.gameId)}
            disabled={room.status !== 'waiting'}
          >
            Join
          </button>
        </div>
      ))}
    </div>
  );
}