'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Lobby() {
  const [rooms, setRooms] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/games', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setRooms);
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Game Table</h1>
      <div className="flex flex-wrap gap-4">
        {rooms.map((room: any) => (
          <div
            key={room.gameId}
            onClick={() => router.push(`/game/${room.gameId}`)}
            className="w-40 h-60 border rounded shadow-md p-2 cursor-pointer hover:scale-105 transition"
          >
            <div className="text-center text-xl font-bold">Game {room.name}</div>
            <p>{room.currentPlayers} players, {room.status}</p>
            <p className="text-sm">blind levels</p>
            <p className="text-sm">starting chips</p>
          </div>
        ))}

        {/* Create Table Card */}
        <div
          onClick={() => router.push('/lobby/create')}
          className="w-40 h-60 border-2 border-dashed rounded shadow-inner flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition"
        >
          <div className="text-center text-red-500 font-bold">＋</div>
          <p>Create a Table</p>
          <p className="text-sm text-gray-500">blind levels</p>
          <p className="text-sm text-gray-500">starting chips</p>
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