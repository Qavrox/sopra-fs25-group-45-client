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
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Game Table</h1>
      <div className="flex flex-wrap gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => router.push(`/game/${room.id}`)}
            className="w-40 h-60 border rounded shadow-md p-2 cursor-pointer hover:scale-105 transition"
          >
            <div className="text-center text-xl font-bold">Game {room.id}</div>
            <p>{room.players.length} players, {room.status}</p>
            <p className="text-sm">Small Blind: {room.smallBlind}</p>
            <p className="text-sm">Big Blind: {room.bigBlind}</p>
          </div>
        ))}

        {/* Create Table Card */}
        <div
          onClick={() => router.push('/lobby/create')}
          className="w-40 h-60 border-2 border-dashed rounded shadow-inner flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition"
        >
          <div className="text-center text-red-500 font-bold">＋</div>
          <p>Create a Table</p>
          <p className="text-sm text-gray-500">Customize blinds</p>
          <p className="text-sm text-gray-500">Set starting chips</p>
        </div>
        <button
          onClick={() => router.push('/lobby/rooms')}
          className="text-blue-600 underline mt-4"
        >
          Browse All Tables →
        </button>
      </div>
    </main>
  );
}