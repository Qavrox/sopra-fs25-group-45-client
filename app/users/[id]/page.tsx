// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx

"use client";

import React from "react";
import UserProfilePage from "@/components/profile/UserProfilePage";

/**
 * Page component that renders the user profile
 * This is the page that displays when accessing /users/[id]
 */
const ProfilePage: React.FC = () => {
  return <UserProfilePage />;
};

export default ProfilePage;
