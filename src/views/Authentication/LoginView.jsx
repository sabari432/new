import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, notification, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './LoginView.css';
import logo from '../../Images/logo.png';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const { Title } = Typography;

const LoginView = () => {
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  // req.session.user=useInfo;

  const handleLogin = async (values) => {
    const adminEndpoint = `${API_BASE_URL2}/api/empdblogin.php?action=login`;
    localStorage.setItem("authToken", "yourAuthToken"); // Mock authentication
    navigate("/dashboard"); // Redirect to Dashboard
    setFetching(true);

    try {
        const response = await fetch(adminEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                EMPID: values.empid,
                PASSWORD: values.password,
            }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            // Store token and user details in local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('EMPID', data.EMPID);
            localStorage.setItem('EMPNAME', data.EMPNAME);
            localStorage.setItem('PASSWORD', data.PASSWORD);
            localStorage.setItem('ACCESS_ROLE', data.ACCESS_ROLE);
            localStorage.setItem('REGION', data.REGION);
            localStorage.setItem('PROJECT', data.PROJECT);
            localStorage.setItem('TEAM', data.TEAM);
            localStorage.setItem('DEPARTMENT', data.DEPARTMENT);
            localStorage.setItem('DESIGNATION_CATEGORY', data.DESIGNATION_CATEGORY);
            localStorage.setItem('ROLE', data.ROLE);
            localStorage.setItem('SYS_USER_NAME', data.SYS_USER_NAME);
            localStorage.setItem('EMAIL', data.EMAIL);
            localStorage.setItem('empid', data.empid);
            localStorage.setItem('empname', data.empname);
            localStorage.setItem('department', data.department);
            localStorage.setItem('shift', data.shift);
            localStorage.setItem('role', data.role);
            localStorage.setItem('team', data.team);
            localStorage.setItem('ACTIVE_YN', data.ACTIVE_YN);
            localStorage.setItem('project', data.project);
            localStorage.setItem('designationcategory', data.designationcategory);

            

            // Show success notification
            notification.success({
                message: 'Login Successfully',
                description: `Welcome ${data.EMPNAME || values.empid}!`,
            });

            // Redirect to the dashboard
            navigate('/dashboard');
        } else {
            throw new Error(data.error || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        notification.error({
            message: 'Login Failed',
            description: error.message,
        });
    } finally {
        setFetching(false);
    }
};

// Remove any references to all_users in other parts of the component



  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
        // ✅ Optionally validate token with an API call before redirecting
        navigate("/dashboard");
    }
}, []); // ✅ No need to include `navigate` in dependencies


  return (
    <div className="container">
      <div className="login-container">
        <Form
          name="login_form"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
        >
          <Form.Item>
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
              {/*<Title level={3} className="company-name">Productivity Management</Title>*/}
            </div>
          </Form.Item>
          <Form.Item
            name="empid"
            rules={[{ required: true, message: 'Please input your Emp ID!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Emp ID" />
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
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="#">
              Forgot password
            </a>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={fetching}
            >
              Log in
            </Button>
            <div style={{ textAlign: 'center' }}>
              {/* <div style={{ padding: '7px' }}>Or</div> */}
              {/* <Link to="/register">register now!</Link> */}
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginView;
