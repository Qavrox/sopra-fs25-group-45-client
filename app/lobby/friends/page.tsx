'use client';

import { useApi } from '@/hooks/useApi';
import useLocalStorage from '@/hooks/useLocalStorage';
import { UserSummary } from '@/types/user';
import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Typography, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const FriendsPage: React.FC = () => {
  const apiClient = useApi();
  const router = useRouter();
  const [friends, setFriends] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { value: id } = useLocalStorage<string>('id', '');



  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        // const friends = await apiClient.getFriends();
        setFriends(friends);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Error fetching friends');
        setLoading(false);
      }
    };
    fetchFriends();
  }, [id]);

    // Mock data for testing
    const mockFriends: UserSummary[] = [
        {
          id: 1,
          username: "pokerMaster",
          online: true,
          creationDate: "2024-03-20T10:30:00Z",
          birthday: "1990-05-15"
        },
        {
          id: 2,
          username: "cardShark",
          online: false,
          creationDate: "2024-03-21T15:45:00Z",
          birthday: "1988-11-22"
        },
        {
          id: 3,
          username: "aceOfSpades",
          online: true,
          creationDate: "2024-03-22T09:15:00Z",
          birthday: "1995-03-08"
        },
        {
          id: 4,
          username: "royalFlush",
          online: true,
          creationDate: "2024-03-23T14:20:00Z",
          birthday: "1992-07-30"
        },
        {
          id: 5,
          username: "pokerPro",
          online: false,
          creationDate: "2024-03-24T11:10:00Z",
          birthday: "1985-12-03"
        }
      ];

      useEffect(() => {
        setFriends(mockFriends);
      }, []);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Status',
      dataIndex: 'online',
      key: 'online',
      render: (online: boolean) => (
        <Tag color={online ? 'success' : 'default'}>
          {online ? 'Online' : 'Offline'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserSummary) => (
        <Button
          type="primary"
          size="small"
          onClick={() => router.push(`/users/${record.id}`)}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="card-container">
      {error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ width: "800px", maxWidth: "90%" }}
        />
      ) : (
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <UserOutlined />
              <Typography.Title level={3} style={{ margin: 0 }}>
                Friends
              </Typography.Title>
            </div>
          }
          style={{ width: "800px", maxWidth: "90%" }}
          loading={loading}
        >
          <Table
            dataSource={friends}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'No friends yet' }}
          />
        </Card>
      )}
    </div>
  );
};

export default FriendsPage;