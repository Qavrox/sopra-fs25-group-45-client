'use client';

import { useApi } from '@/hooks/useApi';
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

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        if (!apiClient.isAuthenticated()) {
          setError('Please log in to view friends');
          setLoading(false);
          return;
        }
        const friends = await apiClient.getFriends();
        setFriends(friends);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Error fetching friends');
        setLoading(false);
      }
    };
    fetchFriends();
  }, [apiClient]);

  console.log(friends);
  

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