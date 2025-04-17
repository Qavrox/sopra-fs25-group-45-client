'use client';
import { useParams } from 'next/navigation';
import GameTable from '@/components/GameTable/GameTable';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const { id } = useParams();
  const router = useRouter();
  const { value: token } = useLocalStorage('token', '');

  // Redirect unauthenticated users
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) {
    return <div className="w-full h-screen flex items-center justify-center">Please log in to access the game</div>;
  }

  return (
    <main className="w-full h-screen bg-green-900">
      <GameTable gameId={Number(id)} />
    </main>
  );
}
