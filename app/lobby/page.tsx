'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../api/apiClient';
import type { Game } from '@/types/game';

export default function Lobby() {
  const [rooms, setRooms] = useState<Game[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!apiClient.isAuthenticated()) return;
    apiClient.getPublicGames()
      .then(setRooms)
      .catch(console.error);
  }, []);

  return (
    <main className="lobby-container">
      <h1 className="lobby-title">Game Tables</h1>
      <div className="game-cards-container">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => router.push(`/game/${room.id}`)}
            className="game-card"
          >
            <div className="text-center text-xl font-bold">Game {room.id}</div>
            <p>{room.players.length} players, {room.gameStatus}</p>
            <p className="text-sm">Small Blind: {room.smallBlind}</p>
            <p className="text-sm">Big Blind: {room.bigBlind}</p>
          </div>
        ))}

        {/* Create Table Card */}
        <div
          onClick={() => router.push('/lobby/create')}
          className="create-game-card"
        >
          <div className="create-icon">＋</div>
          <p>Create a Table</p>
          <p className="text-sm" style={{ opacity: 0.7 }}>Customize blinds</p>
          <p className="text-sm" style={{ opacity: 0.7 }}>Set starting chips</p>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => router.push('/lobby/rooms')}
          className="browse-button"
        >
          Browse All Tables →
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          onClick={() => router.push('/users/list')}
          className="browse-button"
        >   
        See List of All Users →
        </button>
      </div>
    </main>
  );
}