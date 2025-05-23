"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { apiClient } from "@/api/apiClient";
import { Button, Form, Input } from "antd";
import type { LoginRequest } from "@/types/auth";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

const Login: React.FC = () => {
  const router = useRouter();

  const handleLogin = async (values: LoginRequest) => {
    try {
      await apiClient.login(values);
      // On successful login, navigate to the users page
      router.push("/lobby");
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's an API error with status
        if ('status' in error) {
          const status = (error as any).status;
          switch (status) {
            case 400:
              alert('Invalid password');
              break;
            case 404:
              alert('Username does not exist.');
              break;
            default:
              alert(`Login failed: ${error.message}`);
          }
        } else {
          alert(`Login failed: ${error.message}`);
        }
      } else {
        console.error("An unknown error occurred during login.");
      }
    }
  };

  return (
    <div className="login-container">
      <Form
        name="login"
        size="large"
        variant="outlined"
        onFinish={handleLogin}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
