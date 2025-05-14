"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApi";
import type { GameHistoryItem } from "@/types/user";

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
import {ExperienceLevel, UserProfile, UserSummary} from "@/types/user";
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
  const [statistics, setStatistics] = useState<StatisticsData>({
    gamesPlayed: 0,
    winRate: 0,
    totalWinnings: 0,
    averagePosition: 0,
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(true);
  // Add state for leaderboard type
  const [leaderboardType, setLeaderboardType] = useState<'winnings' | 'winrate'>('winnings');

  const { value: localId } = useLocalStorage<string>("user_id", "");

  const [friends, setFriends] = useState<UserSummary[]>([]);


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
        let response;
        if (leaderboardType === 'winnings') {
          response = await apiClient.getLeaderboardByWinnings();
        } else {
          response = await apiClient.getLeaderboardByWinRate();
        }
        setLeaderboard(response);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);

      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [leaderboardType, apiClient]);

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
      dataIndex: "playedAt",
      key: "playedAt",
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

 

  // Leaderboard columns
  const leaderboardColumns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (rank: number) => (
          <span style={{ fontWeight: "bold" }}>{rank}</span>
      ),
    },
    {
      title: "Player",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Total Winnings",
      dataIndex: "totalWinnings",
      key: "totalWinnings",
      render: (value: number) => `$${value}`,
    },
    {
      title: "Win Rate",
      dataIndex: "winRate",
      key: "winRate",
      render: (value: number) => `${value}%`,
    },
    {
      title: "Games",
      dataIndex: "gamesPlayed",
      key: "gamesPlayed",
    },
  ];

  const goBack = () => {
    router.back();
  };

  // Check if the current user is viewing their own profile
  const isOwnProfile = localId && id && Number(localId) === Number(id);

  // Check if the viewed user is already a friend
  const isFriend = (userId: number) => {
    return friends.some(friend => friend.id === userId);
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
                          src={`/images/avatar${profile.profileImage || 0}.png`}
                          style={{ marginRight: 24 }}
                      />
                      <div style={{ flex: 1 }}>
                        <Title level={2} style={{ margin: 0 }}>
                          {profile.name || 'Anonymous'}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>@{profile.username}</Text>
                        <div style={{ marginTop: 12 }}>
                          {profile.experienceLevel && (
                              <Tag color={getLevelColor(profile.experienceLevel)} style={{ fontSize: 14, padding: "4px 8px" }}>
                                {profile.experienceLevel}
                              </Tag>
                          )}
                          <Tag color={profile.online ? "success" : "default"} style={{ fontSize: 14, padding: "4px 8px" }}>
                            {profile.online ? "Online" : "Offline"}
                          </Tag>
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <Text>Member since: {profile.creationDate ? new Date(profile.creationDate).toLocaleDateString() : 'Unknown'}</Text>
                        </div>

                        {!isOwnProfile && (
                          <div>
                            {isFriend(Number(id)) ? (
                              <Tag color="success">Friend</Tag>
                            ) : (
                              <Button
                                type="primary"
                                onClick={() => sendFriendRequest(Number(id))}
                              >
                                Send Friend Request
                              </Button>
                            )}
                          </div>
                        )}

                        {isOwnProfile && (
                            <Button
                                type="primary"
                                onClick={() => router.push(`/users/${id}/edit`)}
                                style={{ marginTop: 12 }}
                            >
                              Edit Profile
                            </Button>
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
                          tab={<span><TrophyOutlined /> Achievements</span>}
                          key="achievements"
                      >
                        <div style={{ padding: "20px 0", textAlign: "center" }}>
                          <Text type="secondary">No achievements yet</Text>
                        </div>
                      </TabPane>

                      <TabPane
                          tab={<span><OrderedListOutlined /> Leaderboard</span>}
                          key="leaderboard"
                      >
                        <div style={{ marginBottom: 16 }}>
                          <Button.Group>
                            <Button
                                type={leaderboardType === 'winnings' ? 'primary' : 'default'}
                                onClick={() => setLeaderboardType('winnings')}
                            >
                              By Winnings
                            </Button>
                            <Button
                                type={leaderboardType === 'winrate' ? 'primary' : 'default'}
                                onClick={() => setLeaderboardType('winrate')}
                            >
                              By Win Rate
                            </Button>
                          </Button.Group>
                        </div>
                        <Table
                            dataSource={leaderboard}
                            columns={leaderboardColumns}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            loading={loadingLeaderboard}
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
                              <Text>{profile.name || 'Not set'}</Text>
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
                              <Text>{profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not set'}</Text>
                            </Col>
                            <Col span={8}>
                              <Text strong>Experience Level:</Text>
                            </Col>
                            <Col span={16}>
                              {profile.experienceLevel && (
                                  <Tag color={getLevelColor(profile.experienceLevel)}>
                                    {profile.experienceLevel}
                                  </Tag>
                              )}
                            </Col>
                            <Col span={8}>
                              <Text strong>Member Since:</Text>
                            </Col>
                            <Col span={16}>
                              <Text>{profile.creationDate ? new Date(profile.creationDate).toLocaleDateString() : 'Unknown'}</Text>
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