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
import { ExperienceLevel, UserProfile } from "@/types/user";
import { 
  UserOutlined, 
  TrophyOutlined, 
  HistoryOutlined, 
  TeamOutlined, 
  ArrowLeftOutlined 
} from "@ant-design/icons";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from '@/hooks/useApi';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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

/**
 * UserProfilePage Component - Comprehensive user profile page
 * Shows detailed user information with experience level display
 */
const UserProfilePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const apiClient = useApi(); 
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { value: localId } = useLocalStorage<string>("user_id", "");

  // Mock data for development - would be replaced with API calls in production
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

  const [friends] = useState([
    { id: 101, username: "Player1", online: true },
    { id: 102, username: "Player2", online: false },
    { id: 103, username: "Player3", online: true },
  ]);

  const sendFriendRequest = async (friendid : number) => {
    try{
      await apiClient.sendFriendRequest(friendid);
      console.log("Sending friend request");
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {

      try{
        console.log("Fetching user profile for ID:", id);
        const userProfile = await apiClient.getUserProfile(Number(id));
        console.log("User profile data:", userProfile);
        setProfile(userProfile);
        console.log("Set Profile:", profile)
        setLoading(false);

        
      } catch (err) {setLoading
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. Please try again later.");
        setLoading(false);
      }
    };

    console.log("User ID from localStorage:", id);
    if (id) {
      fetchUserProfile();
    }
  }, [id]);

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

  // Game history columns for the table
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

  // Friends list columns
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
      render: (online: boolean) => (
        <Tag color={online ? "success" : "default"}>
          {online ? "Online" : "Offline"}
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
                  src={`/images/avatar${profile.profileImage}.png`}
                  style={{ marginRight: 24 }}
                />
                <div style={{ flex: 1 }}>
                  <Title level={2} style={{ margin: 0 }}>
                    {profile.name}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>@{profile.username}</Text>
                  <div style={{ marginTop: 12 }}>
                    <Tag color={getLevelColor(profile.experienceLevel)} style={{ fontSize: 14, padding: "4px 8px" }}>
                      {profile.experienceLevel}
                    </Tag>
                    <Tag color={profile.online ? "success" : "default"} style={{ fontSize: 14, padding: "4px 8px" }}>
                      {profile.online ? "Online" : "Offline"}
                    </Tag>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Text>Member since: {new Date(profile.creationDate).toLocaleDateString()}</Text>
                  </div>
                  {id && localId &&Number(id) != Number(localId) && (
                    <div style={{ marginTop: 12 }}>
                      <Button 
                        type="primary"
                        onClick={() => sendFriendRequest(Number(id))}
                        style={{ marginRight: 8 }}
                      >
                        Send Friend Request
                      </Button>

                    </div>
                  )}
                  {Number(id) == Number(localId) && (
                    <div style={{ marginTop: 12 }}>
                    <Button 
                      type="primary"
                      onClick={() => router.push(`/users/${id}/edit`)}
                      style={{ marginRight: 8 }}
                    >
                      Edit Profile
                    </Button>

                  </div>                    
                  )}
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
                      <Col span={8}>
                        <Text strong>Birthday:</Text>
                      </Col>
                      <Col span={16}>
                        <Text>{new Date(profile.birthday).toLocaleDateString()}</Text>
                      </Col>
                      <Col span={8}>
                        <Text strong>Experience Level:</Text>
                      </Col>
                      <Col span={16}>
                        <Tag color={getLevelColor(profile.experienceLevel)}>
                          {profile.experienceLevel}
                        </Tag>
                      </Col>
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
