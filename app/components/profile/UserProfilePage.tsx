"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
//import { useApiClient } from "@/hooks/useApi";
import type { GameHistoryItem } from "@/types/user";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { useApi } from '@/hooks/useApi';

import {
  Card,
  Avatar,
  Tag,
  Divider,
  Typography,
  Tabs, // Keep Tabs import
  Table,
  Button,
  Statistic,
  Row,
  Col,
  Skeleton,
  Alert,
  Segmented, 
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {ExperienceLevel, UserProfile, UserSummary} from "@/types/user";
import {
  UserOutlined,
  TrophyOutlined,
  HistoryOutlined,
  // TeamOutlined, // Make sure TeamOutlined is imported if you use it for a tab icon - No longer needed if not used elsewhere
  ArrowLeftOutlined,
  OrderedListOutlined,
  UsergroupAddOutlined // Icon for friends leaderboard
} from "@ant-design/icons";
import useLocalStorage from "@/hooks/useLocalStorage";
// import { useApi } from '@/hooks/useApi'; // Remove this duplicate import

const { Title, Text } = Typography;
// Remove TabPane import as it's deprecated
// const { TabPane } = Tabs; 


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
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(true);
  // const [leaderboardType, setLeaderboardType] = useState<'winnings' | 'winrate' | 'friends-winnings' | 'friends-winrate'>('winnings'); 
  
  const [leaderboardScope, setLeaderboardScope] = useState<'global' | 'friends'>('global');
  const [leaderboardSortBy, setLeaderboardSortBy] = useState<'winnings' | 'winrate'>('winnings');

  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const { value: localId } = useLocalStorage<string>("user_id", "");

  const [friends, setFriends] = useState<UserSummary[]>([]);
  const [sentRequests, setSentRequests] = useState<boolean>(false);


  const [statsTimeRange, setStatsTimeRange] = useState<string>('all');


  const sendFriendRequest = async (friendid : number) => {
    try{
      await apiClient.sendFriendRequest(friendid);
      setSentRequests(true);
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
        let startDate: string | undefined = undefined;
        let endDate: string | undefined = undefined;
        const now = dayjs();

        if (statsTimeRange === '7days') {
          startDate = now.subtract(7, 'day').startOf('day').toISOString();
          endDate = now.toISOString();
        } else if (statsTimeRange === '30days') {
          startDate = now.subtract(30, 'day').startOf('day').toISOString();
          endDate = now.toISOString();
        }
        // For 'all', startDate and endDate will remain undefined, which is correct.

        const response = await apiClient.getUserStatistics(Number(id), startDate, endDate);
        setStatistics(response);
      }
 catch (error) {
        console.error("Error fetching user statistics:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStatistics();
  }, [id, apiClient, statsTimeRange]);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        let response;
        if (leaderboardScope === 'global') {
          if (leaderboardSortBy === 'winnings') {
            response = await apiClient.getLeaderboardByWinnings();
          } else { // 'winrate'
            response = await apiClient.getLeaderboardByWinRate();
          }
        } else { // 'friends'
          if (leaderboardSortBy === 'winnings') {
            response = await apiClient.getFriendLeaderboardByWinnings();
          } else { // 'winrate'
            response = await apiClient.getFriendLeaderboardByWinRate();
          }
        }
        setLeaderboard(response as LeaderboardItem[]);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);

      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [leaderboardScope, leaderboardSortBy, apiClient]);

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

  // Fetch game history
  useEffect(() => {
    const fetchGameHistory = async () => {
      if (!id) return;

      setLoadingHistory(true);
      try {
        // This endpoint needs to be implemented in the API
        const response = await apiClient.getUserGameHistory(Number(id));
        setGameHistory(response as GameHistoryItem[]);

      } catch (error) {
        console.error("Error fetching game history:", error);
        // Fallback to an empty array if API fails
        setGameHistory([]);


      } finally {
        setLoadingHistory(false);
      }
    };
    fetchGameHistory();
  }, [id, apiClient]);  

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
      render: (text: string) => dayjs.utc(text).local().toDate().toLocaleString(),
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

  // Define tab items here
  const tabItems = [
    {
      key: 'personal',
      label: <span><UserOutlined /> Personal Info</span>,
      children: (
        <div style={{ padding: "10px 0" }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text strong>Display Name:</Text>
            </Col>
            <Col span={16}>
              <Text>{profile?.name || 'Not set'}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Username:</Text>
            </Col>
            <Col span={16}>
              <Text>{profile?.username}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Birthday:</Text>
            </Col>
            <Col span={16}>
              <Text>{profile?.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not set'}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Experience Level:</Text>
            </Col>
            <Col span={16}>
              {profile?.experienceLevel && (
                  <Tag color={getLevelColor(profile.experienceLevel)}>
                    {profile.experienceLevel}
                  </Tag>
              )}
            </Col>
            <Col span={8}>
              <Text strong>Member Since:</Text>
            </Col>
            <Col span={16}>
              <Text>{profile?.creationDate ? new Date(profile.creationDate).toLocaleDateString() : 'Unknown'}</Text>
            </Col>
          </Row>
        </div>
      ),
    },
    // Conditionally add the Game History tab
    ...(isOwnProfile ? [{
      key: 'history',
      label: <span><HistoryOutlined /> Game History</span>,
      children: (
        <Table
            dataSource={gameHistory}
            columns={historyColumns} // Ensure historyColumns is defined
            rowKey="id"
            pagination={{ pageSize: 5 }}
            loading={loadingHistory}
            locale={{ emptyText: <Text style={{ color: 'white' }}>No Data</Text> }}
        />
      ),
    }] : []),
    {
      key: 'leaderboard',
      label: <span><OrderedListOutlined /> Leaderboard</span>,
      children: (
        <>
          <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong>Type:</Text>
              <Segmented
                options={[
                  { label: 'Global', value: 'global' },
                  { label: 'Friends', value: 'friends' },
                ]}
                value={leaderboardScope}
                onChange={(value) => setLeaderboardScope(value as 'global' | 'friends')}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong>Sort by:</Text>
              <Segmented
                options={[
                  { label: 'Winnings', value: 'winnings' },
                  { label: 'Winning Rates', value: 'winrate' },
                ]}
                value={leaderboardSortBy}
                onChange={(value) => setLeaderboardSortBy(value as 'winnings' | 'winrate')}
              />
            </div>
          </div>
          <Table
              dataSource={leaderboard}
              columns={leaderboardColumns} // Ensure leaderboardColumns is defined
              rowKey="rank" // Changed from "id" to "rank"
              pagination={{ pageSize: 5 }}
              loading={loadingLeaderboard}
          />
        </>
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
                        <Text type="secondary" style={{ color: 'white', fontSize: 16 }}>@{profile.username}</Text>
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
                                disabled={sentRequests}
                                style={{
                                  backgroundColor: sentRequests ? '#52c41a' : undefined,  
                                  borderColor: sentRequests ? '#52c41a' : undefined,
                                  color: sentRequests ? 'white' : undefined
                                }}
                              >
                                {sentRequests ? 'Request Sent' : 'Send Friend Request'}
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

                    {isOwnProfile && (
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Text strong>Statistics Time Range:</Text>
                        <Segmented
                          options={[
                            { label: 'All Time', value: 'all' },
                            { label: 'Last 7 Days', value: '7days' },
                            { label: 'Last 30 Days', value: '30days' },
                          ]}
                          value={statsTimeRange}
                          onChange={(value) => setStatsTimeRange(value as string)}
                        />
                      </div>
                    )}

                    <Row gutter={16} style={{ marginBottom: 24 }}>
                      <Col span={8}>
                        <Statistic title={<Text style={{ color: 'white' }}>Games Played</Text>} value={statistics.gamesPlayed} loading={loadingStats} />
                      </Col>
                      <Col span={8}>
                        <Statistic title={<Text style={{ color: 'white' }}>Win Rate</Text>} value={statistics.winRate} suffix="%" loading={loadingStats} />
                      </Col>
                      <Col span={8}>
                        <Statistic
                            title={<Text style={{ color: 'white' }}>Total Winnings</Text>}
                            value={statistics.totalWinnings}
                            prefix="$"
                            valueStyle={{ color: statistics.totalWinnings >= 0 ? 'green' : 'red' }}
                            loading={loadingStats}
                        />
                      </Col>
                    </Row>

                    {/* Use items prop for Tabs */}
                    <Tabs defaultActiveKey={"personal"} items={tabItems} />
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