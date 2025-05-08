'use client';

import { useApi } from '@/hooks/useApi';
import useLocalStorage from '@/hooks/useLocalStorage';
import { UserSummary } from '@/types/user';
import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Typography, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const FriendRequestsPage: React.FC = () => {
  const apiClient = useApi();
  const [friendRequests, setFriendRequests] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { value: token } = useLocalStorage<string>('token', '');
  const [error, setError] = useState<string | null>(null);


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
  }, [token]);
  
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

  const mockRequests: UserSummary[] = [
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
    }
  ];

  useEffect(() => {
    // For testing, directly set the mock data
    setFriendRequests(mockRequests);
    setLoading(false);
  }, []); // Empty dependency array means this runs once on mount
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
      title: 'Requested',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
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