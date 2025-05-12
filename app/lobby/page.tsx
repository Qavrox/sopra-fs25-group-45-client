'use client';
import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { apiClient } from '../api/apiClient';
import type { Game } from '@/types/game';
import styles from './page.module.css'; // 使用模块化样式

export default function Lobby() {
    const [rooms, setRooms] = useState<Game[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!apiClient.isAuthenticated()) return;
        apiClient.getPublicGames()
            .then(setRooms)
            .catch(console.error);
    }, []);

    const navigateToProfile = () => {
        const userId = apiClient.getUserId();
        router.push(userId ? `/users/${userId}` : '/login');
    };

    return (
        <main className={styles.lobbyWrapper}>
            <button className={styles.profileButton} onClick={navigateToProfile}>
                <UserOutlined/> Profile
            </button>

            <h1 className={styles.title}>Game Tables</h1>

            {/* 第一行：Create Table */}
            <div className={styles.createWrapper}>
                <div className={styles.createCard} onClick={() => router.push('/lobby/create')}>
                    <div className={styles.createIcon}>＋</div>
                    <p>Create a Table</p>
                    <p className={styles.subtext}>Customize blinds</p>
                    <p className={styles.subtext}>Set starting chips</p>
                </div>
            </div>

            {/* 第二行：已有房间 */}
            <div className={styles.cardsWrapper}>
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className={styles.roomCard}
                        onClick={() => router.push(`/game/${room.id}`)}
                    >
                        <h3>Game #{room.id}</h3>
                        <p>{room.players.length} players · {room.gameStatus}</p>
                        <p className="text-sm">Small Blind: {room.smallBlind}</p>
                        <p className="text-sm">Big Blind: {room.bigBlind}</p>
                    </div>
                ))}
            </div>


            <div className={styles.browseAll}>
                <button onClick={() => router.push('/lobby/rooms')} className={styles.browseButton}>
                    Browse All Tables →
                </button>
            </div>
        </main>
    );
}
