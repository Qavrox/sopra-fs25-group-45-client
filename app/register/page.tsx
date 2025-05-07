"use client";

import { useRouter } from "next/navigation";
import { apiClient } from "@/api/apiClient";
import { Button, Form, Input, DatePicker, Select } from "antd";
import type { UserProfileUpdate } from "@/types/user";
import { ExperienceLevel } from "@/types/user";
import dayjs from "dayjs";

interface RegisterRequest extends UserProfileUpdate {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const router = useRouter();

  const handleRegister = async (values: RegisterRequest) => {
    try {
      if (values.password !== values.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Convert birthday to ISO string if it exists
      const birthday = values.birthday ? dayjs(values.birthday).format("YYYY-MM-DD") : undefined;

      // Remove confirmPassword from the payload
      const { confirmPassword, ...registrationData } = values;
      
      // Add the formatted birthday
      const payload = {
        ...registrationData,
        birthday,
      };
      payload.profileImage = 0; // Default profile image number
      // TODO: Add registration endpoint to apiClient
      await apiClient.register(payload);
      
      // On successful registration, navigate to login page
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Registration failed: ${error.message}`);
      } else {
        console.error("An unknown error occurred during registration.");
      }
    }
  };

  // Function to check if user is 18 or older
  const isAdult = (date: dayjs.Dayjs) => {
    const today = dayjs();
    const age = today.diff(date, 'year');
    return age >= 18;
  };

  return (
    <div className="register-container">
      <Form
        name="register"
        size="large"
        variant="outlined"
        onFinish={handleRegister}
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
          name="name"
          label="Display Name"
          rules={[{ required: true, message: "Please input your display name!" }]}
        >
          <Input placeholder="Enter display name" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm password" />
        </Form.Item>

        <Form.Item
          name="birthday"
          label="Birthday"
          rules={[
            { required: true, message: "Please select your birthday!" },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error("Please select your birthday!"));
                }
                if (!isAdult(dayjs(value))) {
                  return Promise.reject(new Error("You must be at least 18 years old to register!"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker 
            style={{ width: "100%" }}
            disabledDate={(current) => {
              // Disable dates in the future and dates that would make the user younger than 18
              return current && (current > dayjs().endOf('day') || !isAdult(current));
            }}
          />
        </Form.Item>

        <Form.Item
          name="experienceLevel"
          label="Experience Level"
          rules={[{ required: true, message: "Please select your experience level!" }]}
        >
          <Select placeholder="Select your experience level">
            <Select.Option value={ExperienceLevel.BEGINNER}>Beginner</Select.Option>
            <Select.Option value={ExperienceLevel.INTERMEDIATE}>Intermediate</Select.Option>
            <Select.Option value={ExperienceLevel.EXPERT}>Expert</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="register-button">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register; 