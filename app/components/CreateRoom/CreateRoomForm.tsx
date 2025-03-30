'use client';
import { useState } from 'react';

export default function CreateRoomForm() {
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [enableAI, setEnableAI] = useState(false);
  const [betLimit, setBetLimit] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to create a room.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roomName,
          maxPlayers,
          betLimit,
          enableAI,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create room');
      }

      const data = await res.json(); // expect { gameId: 'abc123', ... }
      window.location.href = `/game/${data.gameId}`;
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow max-w-md mx-auto bg-white space-y-4">
      <h2 className="text-xl font-bold">Create a New Game</h2>

      <label className="block">
        Room Name
        <input
          className="w-full border p-2 mt-1"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </label>

      <label className="block">
        Max Players
        <input
          className="w-full border p-2 mt-1"
          type="number"
          min={2}
          max={10}
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Number(e.target.value))}
        />
      </label>

      <label className="block">
        Bet Limit
        <input
          className="w-full border p-2 mt-1"
          value={betLimit}
          onChange={(e) => setBetLimit(e.target.value)}
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={enableAI}
          onChange={(e) => setEnableAI(e.target.checked)}
        />
        Enable AI Assistant
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Table'}
      </button>
    </form>
  );
}