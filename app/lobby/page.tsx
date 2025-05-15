'use client';
import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { apiClient } from '../api/apiClient';
import type { Game } from '@/types/game';
import styles from './page.module.css';

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

    function handleLogout(): void {
        apiClient.logout();
        router.push('/');
    }

    return (
        <main className={styles.lobbyWrapper}>
            <div className={styles.topRightButtons}>
                <button className={styles.profileButton} onClick={navigateToProfile}>
                    <UserOutlined /> Profile
                </button>
                <button className={styles.profileButton} onClick={() => router.push('/lobby/friends')}>
                    <UserOutlined /> Friends
                </button>
                <button className={styles.profileButton} onClick={() => router.push('/lobby/friendrequests')}>
                    <UserOutlined /> Friend Requests
                </button>
                <button className={styles.profileButton} onClick={handleLogout}>
                    <UserOutlined /> Logout
                </button>
            </div>

            <h1 className={styles.title}>Game Tables</h1>

            <div className={styles.createWrapper}>
                <div className={styles.createCard} onClick={() => router.push('/lobby/create')}>
                    <div className={styles.createIcon}>＋</div>
                    <p>Create a Table</p>
                    <p className={styles.subtext}>Customize blinds</p>
                    <p className={styles.subtext}>Set starting chips</p>
                </div>
            </div>


            <div className={styles.browseAll}>
                <button onClick={() => router.push('/lobby/rooms')} className={styles.browseButton}>
                    Browse All Tables →
                </button>
                <button onClick={() => router.push('/users/list')} className={styles.browseButton}>
                    See List of All Users →
                </button>
            </div>
        </main>
    );
}
