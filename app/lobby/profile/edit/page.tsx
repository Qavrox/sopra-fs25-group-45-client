
'use client';

import { useEffect, useState } from 'react';

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button, Card, Form, Input, Select } from "antd";
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { getApiDomain } from "@/utils/domain";
import { useApi } from '@/hooks/useApi';
import Image from 'next/image'; // For optimized image rendering in Next.js


interface EditValues {
    name: string;
    birthday: string | Dayjs;
    level: string;
    profileImage: number;
  }


const EditProfilePage: React.FC = () => {
    const url = getApiDomain();  
    const dateFormat = 'YYYY-MM-DD';
    const router = useRouter();
    const [form] = Form.useForm();
    const apiService = useApi();

    const availableImages = [
      { value: 'avatar1.png', src: '/images/avatar1.png', alt: 'Avatar 1' },
      { value: 'avatar2.png', src: '/images/avatar2.png', alt: 'Avatar 2' },
      { value: 'avatar3.png', src: '/images/avatar3.png', alt: 'Avatar 3' },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(
    availableImages.findIndex((img) => img.value === 'avatar3.png') // Default to avatar3
  );

    const {
        value: name, 
      } = useLocalStorage<string>("name", ""); 

    const {
        value: id, 
    } = useLocalStorage<string>("id", ""); 

    const {
        value: token, 
    } = useLocalStorage<string>("token", ""); 



    const SubmitValues = async (values: EditValues) =>{
        
        if (values.birthday) {
          values.birthday = dayjs(values.birthday).format(dateFormat);
        }
        const profileImageNumber = parseInt(availableImages[currentImageIndex].value.replace('avatar', ''),10);
        values.profileImage = profileImageNumber;
        
        try{
            console.log('Submitting values:', values);
            await apiService.put<EditValues>(`/users/${id}`, {values, headers: {Authorization: `Bearer ${token}`}});

            console.log('Profile updated successfully:');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
  
    }


      
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
                    profileImage: 'avatar3.png', // Set default value for profile image
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
                    <DatePicker placeholder="Select your birthday" />        
                  </Form.Item>
                  <Form.Item
                      style={{ width: 150 }} 
                      name="level"
                      label="Level"
                      rules={[{ required: false, message: "Please input your name!" }]}>

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
                            {/* Previous Button */}
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

                            {/* Current Image */}
                            <div>
                                <Image
                                    src={availableImages[currentImageIndex].src}
                                    alt={availableImages[currentImageIndex].alt}
                                    width={100}
                                    height={100}
                                    style={{ borderRadius: '50%' }}
                                />
                            </div>

                            {/* Next Button */}
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
}


export default EditProfilePage;