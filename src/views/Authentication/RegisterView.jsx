import React, { useState } from 'react';
import { Button, Form, Input, notification, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './LoginView.css';
import logo from '../../Images/logo.jpg';

const { Title } = Typography;
//Admin - GA00106
//Leadership - GA00117
//excutive - GA13648

const LoginView = () => {
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    const adminEndpoint = 'http://98.83.30.44/adminlogin.php?action=register'; // Adjusted to 98.83.30.44/api
    setFetching(true);

    try {
      const response = await fetch(adminEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.username, // Use 'username' as the name
          email: values.email,    // Added email input
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful, store token and user info in local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);

        // Show success notification
        notification.success({
          message: 'Registration Successful',
          description: `Welcome ${data.name}!`,
        });

        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        // If response is not ok, show error notification
        notification.error({
          message: 'Registration Failed',
          description: data.error || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Registration Failed',
        description: error.message,
      });
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <Form
          name="register_form"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleRegister}
        >
          <Form.Item>
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
              <Title level={3} className="company-name">Productivity Management</Title>
            </div>
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Name!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={fetching}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginView;
