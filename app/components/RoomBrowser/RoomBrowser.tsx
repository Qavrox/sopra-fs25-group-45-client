'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { GameStatus, type Game } from '@/types/game';
import { useRouter } from 'next/navigation';
import { Button, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function RoomBrowser() {
  const [rooms, setRooms] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!apiClient.isAuthenticated()) return;

    apiClient.getPublicGames()
      .then(setRooms)
      .catch(() => alert('Failed to load rooms'))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (gameId: number, isPublic: boolean) => {
    try {
      if (!isPublic) {
        // For private games, prompt for password only if not stored
        const storedPassword = apiClient.getGamePassword(gameId);
        if (!storedPassword) {
          const password = prompt('Enter password:') || '';
          if (!password) return; // Cancel if no password entered
          await apiClient.joinGame(gameId, password);
        } else {
          // Use stored password automatically
          await apiClient.joinGame(gameId);
        }
      } else {
        // For public games, no password needed
        await apiClient.joinGame(gameId);
      }
      router.push(`/game/${gameId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to join game');
    }
  };

  if (!apiClient.isAuthenticated()) {
    return <p className="text-center text-gray-500">Please log in to see available rooms.</p>;
  }
  if (loading) return <p className="text-center text-gray-500">Loading rooms...</p>;

  const goBack = () => {
    router.back();
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={goBack}
        />
        <h2 className="text-2xl font-bold">Available Rooms</h2>
      </div>

      {rooms.length === 0 ? (
        <p className="text-gray-600">No rooms available right now.</p>
      ) : (
        <div className="space-y-0">
          {rooms.filter(room => room.gameStatus !== GameStatus.ARCHIVED).map((room, index) => (
            <div key={room.id}>
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold">Game #{room.id}</p>
                  <p>{room.players.length}/{room.maximalPlayers} players</p>
                  <p>Status: {room.gameStatus}</p>
                </div>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => handleJoin(room.id, room.isPublic)}
                >
                  Join
                </button>
              </div>
              {index < rooms.length - 1 && <Divider className="my-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}