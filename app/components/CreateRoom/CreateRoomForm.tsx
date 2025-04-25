'use client';
import { useState } from 'react';
import { apiClient } from '../../api/apiClient';
import type { GameCreationRequest } from '@/types/game';
import { useRouter } from 'next/navigation';

export default function CreateRoomForm() {
  const [maximalPlayers, setMaximalPlayers] = useState(6);
  const [startCredit, setStartCredit] = useState(1000);
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [smallBlind, setSmallBlind] = useState(10); 
  const [bigBlind, setBigBlind] = useState(20);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiClient.isAuthenticated()) {
      alert('Please log in.');
      return;
    }

    if (!isPublic && password.trim() === '') {
      alert('Private games require a password.');
      return;
    }

    setLoading(true);
    try {
      const gameRequest: GameCreationRequest = {
        creatorId: apiClient.getUserId() || 0,
        isPublic,
        password: isPublic ? undefined : password,
        smallBlind,
        bigBlind,
        startCredit,
        maximalPlayers,
      };

      const game = await apiClient.createGame(gameRequest);
      router.push(`/game/${game.id}`);
    } catch (err: any) {
      alert(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="create-game-form"
    >
      <div className="form-group">
        <label className="form-label">
          Max Players
          <input
            type="number"
            className="form-input"
            min={2}
            max={10}
            value={maximalPlayers}
            onChange={(e) => setMaximalPlayers(Number(e.target.value))}
            required
          />
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">
          Starting Credit
          <input
            type="number"
            className="form-input"
            min={1}
            value={startCredit}
            onChange={(e) => setStartCredit(Number(e.target.value))}
            required
          />
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">
          Small Blind
          <input
            type="number"
            className="form-input"
            min={1}
            value={smallBlind}
            onChange={(e) => setSmallBlind(Number(e.target.value))}
            required
          />
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">
          Big Blind
          <input
            type="number"
            className="form-input"
            min={1}
            value={bigBlind}
            onChange={(e) => setBigBlind(Number(e.target.value))}
            required
          />
        </label>
      </div>

      <div className="checkbox-container">
        <input
          type="checkbox"
          className="checkbox-input"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <span>Public Game</span>
      </div>

      {!isPublic && (
        <div className="form-group">
          <label className="form-label">
            Password
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="form-button"
      >
        {loading ? 'Creating...' : 'Create Table'}
      </button>
    </form>
  );
}