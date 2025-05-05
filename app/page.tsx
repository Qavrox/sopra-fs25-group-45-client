"use client";

import { Button, Typography, Space, Layout } from "antd"; // Import Space and Layout
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Content } = Layout; // Destructure Content from Layout

export default function Home() {
  const router = useRouter();
  return (
    // Use Layout for overall structure and styling
    <Layout style={{ minHeight: '100vh', backgroundColor: '#006400' }}> 
      {/* Use Content for the main area, centered */}
      <Content style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
        <Title level={1} style={{ color: '#fff', marginBottom: '48px', textAlign: 'center' }}>PokerMaster Arena</Title>

        {/* Use Space for button arrangement */}
        <Space direction="vertical" size="large" style={{ alignItems: 'center' }}> 
          <Space size="large"> {/* Nested Space for horizontal button layout */}
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/login")}
              style={{ minWidth: '150px' }}
            >
              Login
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => router.push("/register")}
              style={{ minWidth: '150px' }}
            >
              Register
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => router.push("/tutorial")} // Updated path to /tutorial
              style={{ minWidth: '150px' }}
            >
              Tutorials
            </Button>
          </Space>
        </Space>
      </Content>
    </Layout>
  );
}
