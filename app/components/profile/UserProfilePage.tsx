"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApi";
import {
  Card,
  Avatar,
  Tag,
  Divider,
  Typography,
  Tabs,
  Table,
  Button,
  Statistic,
  Row,
  Col,
  Skeleton,
  Alert,
} from "antd";
//Ant Design (antd) is a popular React UI component library.
//It provides rich and high-quality components.

import { 
  UserOutlined, 
  TrophyOutlined, 
  HistoryOutlined, 
  TeamOutlined, 
  ArrowLeftOutlined 
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface UserGetDTO {
  id: number;
  name: string;
  username: string;
  status: string;
  level?: string;
  creationDate: string;
  birthday?: string;
  profileImage?: any;
}

interface UserFriendDTO {
  id: number;
  username: string;
  online: string;
}

interface GameHistoryItem {
  id: number;
  date: string;
  result: string;
  winnings: number;
}

interface StatisticsData {
  gamesPlayed: number;
  winRate: number;
  totalWinnings: number;
  averagePosition: number;
}

// Mock data - in a real project, this would come from API calls
  const [gameHistory] = useState<GameHistoryItem[]>([
    { id: 1, date: "2025-03-25", result: "Win", winnings: 120 },
    { id: 2, date: "2025-03-23", result: "Loss", winnings: -50 },
    { id: 3, date: "2025-03-20", result: "Win", winnings: 75 },
    { id: 4, date: "2025-03-18", result: "Loss", winnings: -30 },
    { id: 5, date: "2025-03-15", result: "Win", winnings: 200 },
  ]);

  const [statistics] = useState<StatisticsData>({
    gamesPlayed: 7,
    winRate: 30,
    totalWinnings: 315,
    averagePosition: 3.2,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userId = parseInt(id as string);
        
        if (isNaN(userId)) {
          throw new Error("Invalid user ID");
        }
        
        // Use apiClient to fetch user profile - ensure correct backend endpoint
        const userData = await apiClient.get(`/users/${userId}`);
        setProfile(userData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. Please try again later.");
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id, apiClient]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!profile) return;
      
      try {
        setLoadingFriends(true);
        // Use apiClient to fetch friends list - use correct backend endpoint
        const friendsData = await apiClient.get('/friends');
        setFriends(friendsData);
        setLoadingFriends(false);
      } catch (err) {
        console.error("Error fetching friends list:", err);
        setLoadingFriends(false);
      }
    };

    if (!loading && profile) {
      fetchFriends();
    }
  }, [loading, profile, apiClient]);

  // Helper function to get color based on experience level
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "green";
      case "Intermediate":
        return "blue";
      case "Expert":
        return "red";
      default:
        return "default";
    }
  };

  // Game history table columns
  const historyColumns = [
    {
      title: "Game ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (text: string) => (
        <Tag color={text === "Win" ? "success" : "error"}>{text}</Tag>
      ),
    },
    {
      title: "Winnings",
      dataIndex: "winnings",
      key: "winnings",
      render: (value: number) => (
        <span style={{ color: value >= 0 ? "green" : "red" }}>
          {value >= 0 ? `+${value}` : value}
        </span>
      ),
    },
  ];

  // Friends list table columns
  const friendColumns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Status",
      dataIndex: "online",
      key: "online",
      render: (online: string) => (
        <Tag color={online === "ONLINE" ? "success" : "default"}>
          {online === "ONLINE" ? "Online" : "Offline"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: { id: number }) => (
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

  const goBack = () => {
    router.push("/users");
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button 
                icon={<ArrowLeftOutlined />} 
                style={{ marginRight: 16 }} 
                onClick={goBack}
              />
              <Title level={3} style={{ margin: 0 }}>User Profile</Title>
            </div>
          }
          style={{ width: "800px", maxWidth: "90%" }}
          loading={loading}
        >
          {profile ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 24 }}>
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  src={profile.profileImage ? `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, profile.profileImage))}` : undefined}
                  style={{ marginRight: 24 }}
                />
                <div style={{ flex: 1 }}>
                  <Title level={2} style={{ margin: 0 }}>
                    {profile.name}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>@{profile.username}</Text>
                  <div style={{ marginTop: 12 }}>
                    {profile.level && (
                      <Tag color={getLevelColor(profile.level)} style={{ fontSize: 14, padding: "4px 8px" }}>
                        {profile.level}
                      </Tag>
                    )}
                    <Tag color={profile.status === "ONLINE" ? "success" : "default"} style={{ fontSize: 14, padding: "4px 8px" }}>
                      {profile.status === "ONLINE" ? "Online" : "Offline"}
                    </Tag>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Text>Member since: {new Date(profile.creationDate).toLocaleDateString()}</Text>
                  </div>
                </div>
              </div>

              <Divider />

              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Statistic title="Games Played" value={statistics.gamesPlayed} />
                </Col>
                <Col span={6}>
                  <Statistic title="Win Rate" value={statistics.winRate} suffix="%" />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="Total Winnings" 
                    value={statistics.totalWinnings} 
                    prefix="$"
                    valueStyle={{ color: statistics.totalWinnings >= 0 ? 'green' : 'red' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic title="Avg. Position" value={statistics.averagePosition} precision={1} />
                </Col>
              </Row>

              <Tabs defaultActiveKey="history">
                <TabPane 
                  tab={<span><HistoryOutlined /> Game History</span>} 
                  key="history"
                >
                  <Table 
                    dataSource={gameHistory} 
                    columns={historyColumns} 
                    rowKey="id" 
                    pagination={{ pageSize: 5 }}
                  />
                </TabPane>
                <TabPane 
                  tab={<span><TrophyOutlined /> Achievements</span>} 
                  key="achievements"
                >
                  <div style={{ padding: "20px 0", textAlign: "center" }}>
                    <Text type="secondary">No achievements yet</Text>
                  </div>
                </TabPane>
                <TabPane 
                  tab={<span><TeamOutlined /> Friends</span>} 
                  key="friends"
                >
                  <Table 
                    dataSource={friends} 
                    columns={friendColumns} 
                    rowKey="id" 
                    pagination={{ pageSize: 5 }}
                    loading={loadingFriends}
                  />
                </TabPane>
                <TabPane 
                  tab={<span><UserOutlined /> Personal Info</span>} 
                  key="personal"
                >
                  <div style={{ padding: "10px 0" }}>
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Text strong>Display Name:</Text>
                      </Col>
                      <Col span={16}>
                        <Text>{profile.name}</Text>
                      </Col>
                      <Col span={8}>
                        <Text strong>Username:</Text>
                      </Col>
                      <Col span={16}>
                        <Text>{profile.username}</Text>
                      </Col>
                      {profile.birthday && (
                        <>
                          <Col span={8}>
                            <Text strong>Birthday:</Text>
                          </Col>
                          <Col span={16}>
                            <Text>{new Date(profile.birthday).toLocaleDateString()}</Text>
                          </Col>
                        </>
                      )}
                      {profile.level && (
                        <>
                          <Col span={8}>
                            <Text strong>Experience Level:</Text>
                          </Col>
                          <Col span={16}>
                            <Tag color={getLevelColor(profile.level)}>
                              {profile.level}
                            </Tag>
                          </Col>
                        </>
                      )}
                      <Col span={8}>
                        <Text strong>Member Since:</Text>
                      </Col>
                      <Col span={16}>
                        <Text>{new Date(profile.creationDate).toLocaleDateString()}</Text>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
              </Tabs>
            </>
          ) : (
            <Skeleton avatar paragraph={{ rows: 6 }} active />
          )}
        </Card>
      )}
    </div>
  );
};

export default UserProfilePage;
