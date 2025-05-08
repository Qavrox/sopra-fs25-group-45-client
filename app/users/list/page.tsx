'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiClient } from '@/hooks/useApi';
import { Card, Table, Tag, Button, Typography, Alert } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface User {
  id: number;
  name: string;
  username: string;
  online: boolean;
  experienceLevel: string;
}

const UsersListPage: React.FC = () => {
  const router = useRouter();
  const apiClient = useApiClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiClient.getUsers(); 
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [apiClient]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => <Tag color="blue">@{username}</Tag>,
    },
    {
      title: 'Experience Level',
      dataIndex: 'experienceLevel',
      key: 'experienceLevel',
      render: (level: string) => {
        const color = level === 'Expert' ? 'red' : level === 'Intermediate' ? 'blue' : 'green';
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'online',
      key: 'online',
      render: (online: boolean) => (
        <Tag color={online ? 'green' : 'default'}>
          {online ? 'Online' : 'Offline'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
        <Button
          type="link"
          onClick={() => router.push(`/users/${record.id}`)}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="card-container" style={{ padding: '20px' }}>
      <Card
        title={
          <Title level={3}>
            <TeamOutlined style={{ marginRight: 8 }} />
            All Users
          </Title>
        }
      >
        {error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default UsersListPage;
