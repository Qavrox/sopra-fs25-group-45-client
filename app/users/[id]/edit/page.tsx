'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button, Form, Input, Select, DatePicker, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { getApiDomain } from "@/utils/domain";
import { useApi } from '@/hooks/useApi';
import Image from 'next/image';
import { UserProfileUpdate } from '@/types/user';
import { Typography } from 'antd';
const { Title } = Typography;

const EditProfilePage: React.FC = () => {
  const { id } = useParams();
  const url = getApiDomain();
  const dateFormat = 'YYYY-MM-DD';
  const router = useRouter();
  const [form] = Form.useForm();
  const api = useApi();

  const availableImages = [
    { value: 'avatar0.png', src: '/images/avatar0.png', alt: 'Avatar 0' },
    { value: 'avatar1.png', src: '/images/avatar1.png', alt: 'Avatar 1' },
    { value: 'avatar2.png', src: '/images/avatar2.png', alt: 'Avatar 2' },
    { value: 'avatar3.png', src: '/images/avatar3.png', alt: 'Avatar 3' },
    { value: 'avatar4.png', src: '/images/avatar4.png', alt: 'Avatar 4' },
    { value: 'avatar5.png', src: '/images/avatar5.png', alt: 'Avatar 5' },
    { value: 'avatar6.png', src: '/images/avatar6.png', alt: 'Avatar 6' },
    { value: 'avatar7.png', src: '/images/avatar7.png', alt: 'Avatar 7' },

  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(
    availableImages.findIndex((img) => img.value === 'avatar0.png')
  );



  const isAdult = (date: dayjs.Dayjs) => {
    const today = dayjs();
    const age = today.diff(date, 'year');
    return age >= 18;
  };

  const SubmitValues = async (values: UserProfileUpdate) => {
    if (values.birthday) {
      values.birthday = dayjs(values.birthday).format(dateFormat);
    }
    const profileImageNumber = parseInt(availableImages[currentImageIndex].value.replace('avatar', ''), 10);
    values.profileImage = profileImageNumber;

    try {
      console.log('Submitting values:', values);
      await api.updateUserProfile(Number(id), values);
      console.log('Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? availableImages.length - 1 : prevIndex - 1
    );
    form.setFieldsValue({
      profileImage: availableImages[
        currentImageIndex === 0
          ? availableImages.length - 1
          : currentImageIndex - 1
      ].value,
    });
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === availableImages.length - 1 ? 0 : prevIndex + 1
    );
    form.setFieldsValue({
      profileImage: availableImages[
        currentImageIndex === availableImages.length - 1
          ? 0
          : currentImageIndex + 1
      ].value,
    });
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div>

      <div className="card-container">

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
          style={{ width: "500px", maxWidth: "90%" }}
        >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', 
          gap: '10px' 
          }}
        >
        <Form
          form={form}
          name="login"
          size="large"
          variant="outlined"
          onFinish={SubmitValues}
          layout="vertical"
          initialValues={{
            profileImage: 0,
          }}
        >
          <Form.Item
            style={{ width: 180 }}
            name="name"
            label="Name"
            rules={[{ required: false, message: "Please input your name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            style={{ width: 180 }}
            name="birthday"
            label="Birthday"
            rules={[{ required: false, message: "Please input your birthday!" }]}
          >
            <DatePicker
              placeholder="Select your birthday"
              disabledDate={(current) => {
                return current && (current > dayjs().endOf('day') || !isAdult(current));
              }}
            />
          </Form.Item>

          <Form.Item
            style={{ width: 180 }}
            name="level"
            label="Level"
            rules={[{ required: false, message: "Please input your name!" }]}
          >
            <Select
              optionFilterProp="label"
              options={[
                { value: 'Beginner', label: <span style={{ color: 'green' }}>Beginner</span> },
                { value: 'Intermediate', label: <span style={{ color: 'orange' }}>Intermediate</span> },
                { value: 'Expert', label: <span style={{ color: 'red' }}>Expert</span> },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="profileImage"
            label="Profile Image"
            rules={[{ required: false, message: "Please select a profile image!" }]}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handlePrevious}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                ◀
              </button>

              <div>
                <Image
                  src={availableImages[currentImageIndex].src}
                  alt={availableImages[currentImageIndex].alt}
                  width={100}
                  height={100}
                  style={{ borderRadius: '50%' }}
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                ▶
              </button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Edit
            </Button>
          </Form.Item>
        </Form>
        </div>
        </Card>

      </div>
    </div>
  );
};

export default EditProfilePage;