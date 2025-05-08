'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button, Form, Input, Select, DatePicker } from "antd";
import dayjs from 'dayjs';
import { getApiDomain } from "@/utils/domain";
import { useApi } from '@/hooks/useApi';
import Image from 'next/image';
import { UserProfileUpdate } from '@/types/user';

const EditProfilePage: React.FC = () => {
  const { id } = useParams();
  const url = getApiDomain();
  const dateFormat = 'YYYY-MM-DD';
  const router = useRouter();
  const [form] = Form.useForm();
  const api = useApi();

  const availableImages = [
    { value: 'avatar1.png', src: '/images/avatar1.png', alt: 'Avatar 1' },
    { value: 'avatar2.png', src: '/images/avatar2.png', alt: 'Avatar 2' },
    { value: 'avatar0.png', src: '/images/avatar0.png', alt: 'Avatar 0' },
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

  return (
    <div>
      <h1>Edit Profile</h1>
      <div className="user-profile-image-container">
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
            style={{ width: 150 }}
            name="name"
            label="Name"
            rules={[{ required: false, message: "Please input your name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            style={{ width: 150 }}
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
            style={{ width: 150 }}
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
    </div>
  );
};

export default EditProfilePage;