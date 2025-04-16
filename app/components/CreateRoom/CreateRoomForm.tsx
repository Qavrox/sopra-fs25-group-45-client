'use client';
import { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function CreateRoomForm() {
  const [maximalPlayers, setMaximalPlayers] = useState(6);
  const [startCredit, setStartCredit] = useState(1000);
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [smallBlind, setSmallBlind] = useState(10); 
  const [bigBlind, setBigBlind] = useState(20);
  const [loading, setLoading] = useState(false);

  const { value: token } = useLocalStorage<string>('token', '');
  const { value: rawUserId } = useLocalStorage<string>('userId', '');
  const userId = Number(rawUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !userId) return alert('Please log in.');

    if (!isPublic && password.trim() === '') {
      alert('Private games require a password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId: userId,
          maximalPlayers,
          startCredit,
          isPublic,
          password: isPublic ? null : password,
          smallBlind,
          bigBlind
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create game.');
      }

      const game = await response.json();
      window.location.href = `/game/${game.id}`;
    } catch (err: any) {
      alert(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg shadow max-w-md mx-auto space-y-4 bg-white"
    >
      <h2 className="text-xl font-bold">Create a New Game</h2>

      <label className="block">
        Max Players
        <input
          type="number"
          className="w-full border p-2 mt-1"
          min={2}
          max={10}
          value={maximalPlayers}
          onChange={(e) => setMaximalPlayers(Number(e.target.value))}
          required
        />
      </label>

      <label className="block">
        Starting Credit
        <input
          type="number"
          className="w-full border p-2 mt-1"
          min={1}
          value={startCredit}
          onChange={(e) => setStartCredit(Number(e.target.value))}
          required
        />
      </label>

      {/* Small blind input */}
      <label className="block">
        Small Blind
        <input
          type="number"
          className="w-full border p-2 mt-1"
          min={1}
          value={smallBlind}
          onChange={(e) => setSmallBlind(Number(e.target.value))}
          required
        />
      </label>

      {/* Big blind input */}
      <label className="block">
        Big Blind
        <input
          type="number"
          className="w-full border p-2 mt-1"
          min={1}
          value={bigBlind}
          onChange={(e) => setBigBlind(Number(e.target.value))}
          required
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        Public Game
      </label>

      {!isPublic && (
        <label className="block">
          Password
          <input
            type="password"
            className="w-full border p-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loading ? 'Creating...' : 'Create Table'}
      </button>
    </form>
  );
}