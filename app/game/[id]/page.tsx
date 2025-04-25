'use client';
import { useParams } from 'next/navigation';
import PokerTable from "@/components/Gametable/Gametable"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';

export default function GamePage() {
  const { id } = useParams();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!apiClient.isAuthenticated()) {
    return <div className="loading-container">Please log in to access the game</div>;
  }

  return (
    <main className="game-table-container">
      <PokerTable gameId={Number(id)} />
    </main>
  );
}
