'use client';

import { useApi } from '@/hooks/useApi';
import { UserSummary } from '@/types/user';
import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Typography, Alert } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const FriendRequestsPage: React.FC = () => {
  const apiClient = useApi();
  const [friendRequests, setFriendRequests] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();



  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        setLoading(true);
        const requests = await apiClient.getFriendRequests();
        setFriendRequests(requests);
        setLoading(false);
      }
      catch (error) {
        console.error("Error fetching friend requests:", error);
        setLoading(false);
      }
    }

    fetchFriendRequests();
  }, [apiClient]);
  
  const handleAccept = async (id: number) => {
    try {
      await apiClient.acceptFriendRequest(id);
      setFriendRequests(prev => prev.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await apiClient.rejectFriendRequest(id);
      setFriendRequests(prev => prev.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserSummary) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => handleAccept(record.id)}
        >
          Accept
        </Button>
      ),
    },
    {
      title: 'Reject',
      key: 'reject',
      render: (_: any, record: UserSummary) => (
        <Button 
          danger 
          size="small"
          onClick={() => handleReject(record.id)}
        >
          Reject
        </Button>
      ),
    },
  ];

  const goBack = () => {
    router.back();
  };

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
              <Button
                icon={<ArrowLeftOutlined />}
                style={{ marginRight: 16 }}
                onClick={goBack}
              />
              <UserOutlined />
              <Typography.Title level={3} style={{ margin: 0 }}>
                Friend Requests
              </Typography.Title>
            </div>
          }
          style={{ width: "800px", maxWidth: "90%" }}
          loading={loading}
        >
          <Table
            dataSource={friendRequests}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'No friend requests' }}
          />
        </Card>
      )}
    </div>
  );
};

export default FriendRequestsPage;