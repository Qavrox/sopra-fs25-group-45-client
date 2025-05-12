"use client";

import { Button, Typography, Space, Layout } from "antd";
import { useRouter } from "next/navigation";
import { LoginOutlined, UserAddOutlined, ReadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function Home() {
  const router = useRouter();

  return (
      <Layout
          style={{
            minHeight: "100vh",
              backgroundImage: `url("/images/background.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#013220",
          }}
      >
        <Content
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "50px",
              textAlign: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
        >
          <Title
              level={1}
              style={{
                color: "#fff",
                fontSize: "56px",
                textShadow: "2px 2px #000",
                marginBottom: "16px",
              }}
          >
            PokerMaster Arena
          </Title>

          <Text
              style={{
                color: "#f1f1f1",
                fontSize: "20px",
                marginBottom: "48px",
                fontStyle: "italic",
              }}
          >
            Your Ultimate Texas Hold'em Challenge
          </Text>

          <Space direction="vertical" size="large" style={{ alignItems: "center" }}>
            <Space size="large">
              <Button
                  type="primary"
                  icon={<LoginOutlined /> as React.ReactNode}
                  size="large"
                  onClick={() => router.push("/login")}
                  style={{
                    minWidth: "160px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  }}
              >
                Login
              </Button>

              <Button
                  type="default"
                  icon={<UserAddOutlined /> as React.ReactNode}
                  size="large"
                  onClick={() => router.push("/register")}
                  style={{
                    minWidth: "160px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
              >
                Register
              </Button>

              <Button
                  type="dashed"
                  icon={<ReadOutlined /> as React.ReactNode}
                  size="large"
                  onClick={() => router.push("/tutorial")}
                  style={{
                    minWidth: "160px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    color: "#fff",
                    borderColor: "#fff",
                  }}
              >
                Tutorials
              </Button>
            </Space>
          </Space>
        </Content>
      </Layout>
  );
}