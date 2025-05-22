'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { GameStatus, type Game } from '@/types/game';
import { useRouter } from 'next/navigation';
import { Button, Divider, Modal, Input, Form } from 'antd';
import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons';

export default function RoomBrowser() {
  const [rooms, setRooms] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrivateGameModal, setShowPrivateGameModal] = useState(false);
  const [privateGameId, setPrivateGameId] = useState('');
  const [privateGamePassword, setPrivateGamePassword] = useState('');
  const [joiningPrivateGame, setJoiningPrivateGame] = useState(false);
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

  const handleJoinPrivateGame = async () => {
    if (!privateGameId.trim()) {
      alert('Please enter a game ID');
      return;
    }

    const gameId = parseInt(privateGameId);
    if (isNaN(gameId)) {
      alert('Invalid game ID');
      return;
    }

    setJoiningPrivateGame(true);
    try {
      await apiClient.joinGame(gameId, privateGamePassword);
      setShowPrivateGameModal(false);
      router.push(`/game/${gameId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to join private game');
    } finally {
      setJoiningPrivateGame(false);
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

      <div className="mb-6 flex justify-between items-center">
        <Button 
          icon={<LockOutlined />}
          type="primary" 
          onClick={() => setShowPrivateGameModal(true)}
          className="bg-blue-600"
        >
          Join Private Game
        </Button>
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

      <Modal
        title="Join Private Game"
        open={showPrivateGameModal}
        onCancel={() => setShowPrivateGameModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowPrivateGameModal(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={joiningPrivateGame} 
            onClick={handleJoinPrivateGame}
            className="bg-blue-600"
          >
            Join
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Game ID" required>
            <Input 
              placeholder="Enter Game ID" 
              value={privateGameId}
              onChange={(e) => setPrivateGameId(e.target.value)}
              type="number"
            />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password 
              placeholder="Enter password" 
              value={privateGamePassword}
              onChange={(e) => setPrivateGamePassword(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}