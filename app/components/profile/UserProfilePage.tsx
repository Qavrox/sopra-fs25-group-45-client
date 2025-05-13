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
import type { ColumnsType } from "antd/es/table";
import { ExperienceLevel, UserProfile } from "@/types/user";
import { 
  UserOutlined, 
  TrophyOutlined, 
  HistoryOutlined, 
  TeamOutlined, 
  ArrowLeftOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from '@/hooks/useApi';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface GameHistoryItem {
  id: number;
  playedAt: string;
  result: string;
  winnings: number;
}

interface StatisticsData {
  gamesPlayed: number;
  winRate: number;
  totalWinnings: number;
  averagePosition: number;
}

interface LeaderboardItem {
  id: number;
  username: string;
  name: string;
  totalWinnings: number;
  winRate: number;
  gamesPlayed: number;
  rank: number;
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
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [statistics, setStatistics] = useState<StatisticsData>({
    gamesPlayed: 0,
    winRate: 0,
    totalWinnings: 0,
    averagePosition: 0,
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(true);

  const { value: localId } = useLocalStorage<string>("user_id", "");

  const [friends, setFriends] = useState([]);

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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. Please try again later.");
        setLoading(false);
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await apiClient.getFriends();
        setFriends(response);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    console.log("User ID from localStorage:", id);
    if (id) {
      fetchUserProfile();
      fetchFriends();
    }
  }, [id, apiClient]);

  // Fetch game history
  useEffect(() => {
    const fetchGameHistory = async () => {
      if (!id) return;
      
      setLoadingHistory(true);
      try {
        // This endpoint needs to be implemented in the API
        const response = await apiClient.getUserGameHistory(Number(id));
        setGameHistory(response);
      } catch (error) {
        console.error("Error fetching game history:", error);
        // Fallback to mock data if API fails
        setGameHistory([
          { id: 1, date: "2025-03-25", result: "Win", winnings: 120 },
          { id: 2, date: "2025-03-23", result: "Loss", winnings: -50 },
          { id: 3, date: "2025-03-20", result: "Win", winnings: 75 },
          { id: 4, date: "2025-03-18", result: "Loss", winnings: -30 },
          { id: 5, date: "2025-03-15", result: "Win", winnings: 200 },
        ]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchGameHistory();
  }, [id, apiClient]);

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!id) return;
      
      setLoadingStats(true);
      try {
        // This endpoint needs to be implemented in the API
        const response = await apiClient.getUserStatistics(Number(id));
        setStatistics(response);
      } catch (error) {
        console.error("Error fetching user statistics:", error);
        // Fallback to mock data if API fails
        setStatistics({
          gamesPlayed: 7,
          winRate: 30,
          totalWinnings: 315,
          averagePosition: 3.2,
        });
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStatistics();
  }, [id, apiClient]);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        // This endpoint needs to be implemented in the API
        const response = await apiClient.getLeaderboard();
        setLeaderboard(response);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        // Fallback to mock data if API fails
        setLeaderboard([
          { id: 1, username: "PokerKing", name: "John Doe", totalWinnings: 1250, winRate: 65, gamesPlayed: 20, rank: 1 },
          { id: 2, username: "CardShark", name: "Jane Smith", totalWinnings: 980, winRate: 58, gamesPlayed: 15, rank: 2 },
          { id: 3, username: "AcePlayer", name: "Mike Johnson", totalWinnings: 820, winRate: 52, gamesPlayed: 18, rank: 3 },
          { id: 4, username: "PokerPro", name: "Sarah Williams", totalWinnings: 750, winRate: 48, gamesPlayed: 22, rank: 4 },
          { id: 5, username: "RoyalFlush", name: "David Brown", totalWinnings: 680, winRate: 45, gamesPlayed: 25, rank: 5 },
        ]);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [apiClient]);

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
      dataIndex: "gameId",
      key: "gameId",
    },
    {
      title: "Date",
      dataIndex: "playedAt",
      key: "playedAt",
      render: (text: string) => {
        try {
          const date = new Date(text);
          return isNaN(date.getTime()) ? "Unknown Date" : date.toLocaleDateString();
        } catch (error) {
          console.error("Error parsing date:", text, error);
          return "Unknown Date";
        }
      },
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

  // Leaderboard columns
  const leaderboardColumns: ColumnsType<LeaderboardItem> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (rank: number) => (
        <span style={{ fontWeight: 'bold' }}>#{rank}</span>
      ),
    },
    {
      title: "Player",
      dataIndex: "username",
      key: "username",
      render: (username: string, record: LeaderboardItem) => (
        <div>
          <span style={{ fontWeight: 'bold' }}>{record.name}</span>
          <br />
          <Text type="secondary">@{username}</Text>
        </div>
      ),
    },
    {
      title: "Total Winnings",
      dataIndex: "totalWinnings",
      key: "totalWinnings",
      render: (value: number) => (
        <span style={{ color: value >= 0 ? "green" : "red", fontWeight: 'bold' }}>
          ${value}
        </span>
      ),
      sorter: (a: LeaderboardItem, b: LeaderboardItem) => a.totalWinnings - b.totalWinnings,
      defaultSortOrder: 'descend',
    },
    {
      title: "Win Rate",
      dataIndex: "winRate",
      key: "winRate",
      render: (value: number) => `${value}%`,
      sorter: (a: LeaderboardItem, b: LeaderboardItem) => a.winRate - b.winRate,
    },
    {
      title: "Games",
      dataIndex: "gamesPlayed",
      key: "gamesPlayed",
      sorter: (a: LeaderboardItem, b: LeaderboardItem) => a.gamesPlayed - b.gamesPlayed,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: LeaderboardItem) => (
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
                  {id && localId && Number(id) != Number(localId) && (
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
                  <Statistic title="Games Played" value={statistics.gamesPlayed} loading={loadingStats} />
                </Col>
                <Col span={6}>
                  <Statistic title="Win Rate" value={statistics.winRate} suffix="%" loading={loadingStats} />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="Total Winnings" 
                    value={statistics.totalWinnings} 
                    prefix="$"
                    valueStyle={{ color: statistics.totalWinnings >= 0 ? 'green' : 'red' }}
                    loading={loadingStats}
                  />
                </Col>
                <Col span={6}>
                  <Statistic title="Avg. Position" value={statistics.averagePosition} precision={1} loading={loadingStats} />
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
                    loading={loadingHistory}
                    locale={{ emptyText: 'No game history available' }}
                  />
                </TabPane>
                <TabPane 
                  tab={<span><OrderedListOutlined /> Leaderboard</span>} 
                  key="leaderboard"
                >
                  <Table 
                    dataSource={leaderboard} 
                    columns={leaderboardColumns} 
                    rowKey="id" 
                    pagination={{ pageSize: 5 }}
                    loading={loadingLeaderboard}
                    locale={{ emptyText: 'Leaderboard data not available' }}
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
                    locale={{ emptyText: 'No friends yet' }}
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
