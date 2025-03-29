// this code is part of S2 to display a list of all registered users
// clicking on a user in this list will display /app/users/[id]/page.tsx
"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApiClient } from "@/hooks/useApi";
import { Card, Avatar, Tag, Divider, Space, Typography, Skeleton } from "antd";
import type { UserProfile } from "@/types/user";

const { Title, Text } = Typography;

/**
 * ProfileView Component - Displays basic user profile information
 * Shows the user's experience level, avatar, and basic stats
 */
const ProfileView: React.FC = () => {
  const { id } = useParams();
  const apiClient = useApiClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userId = parseInt(id as string);
        const userProfile = await apiClient.getUserProfile(userId);
        setProfile(userProfile);
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id, apiClient]);

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

  return (
    <div className="card-container">
      <Card
        title="Player Profile"
        style={{ width: 400 }}
        loading={loading}
      >
        {error ? (
          <div className="error-message">{error}</div>
        ) : profile ? (
          <>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <Avatar
                size={80}
                src={profile.avatarUrl || "/default-avatar.png"}
                style={{ marginRight: 16 }}
              />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {profile.displayName}
                </Title>
                <Text type="secondary">@{profile.username}</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag color={getLevelColor(profile.experienceLevel)}>
                    {profile.experienceLevel}
                  </Tag>
                  <Tag color={profile.online ? "success" : "default"}>
                    {profile.online ? "Online" : "Offline"}
                  </Tag>
                </div>
              </div>
            </div>

            <Divider />

            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Member Since</Text>
                <Text strong>
                  {new Date(profile.createdAt).toLocaleDateString()}
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Birthday</Text>
                <Text strong>
                  {new Date(profile.birthday).toLocaleDateString()}
                </Text>
              </div>
            </Space>
            
            <Divider />
            
            <div style={{ textAlign: "center" }}>
              <Text type="secondary">
                View full profile details to see game statistics and history
              </Text>
            </div>
          </>
        ) : (
          <Skeleton avatar paragraph={{ rows: 4 }} />
        )}
      </Card>
    </div>
  );
};

export default ProfileView;
