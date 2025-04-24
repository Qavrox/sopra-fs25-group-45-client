'use client';
import { useParams } from 'next/navigation';
import PokerTable from "@/components/PokerTable/PokerTable"
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
    return <div className="w-full h-screen flex items-center justify-center">Please log in to access the game</div>;
  }

  return (
    <main className="w-full h-screen bg-green-900">
      <PokerTable gameId={Number(id)} />
    </main>
  );
}
