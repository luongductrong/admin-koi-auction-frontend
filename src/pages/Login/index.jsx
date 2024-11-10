import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import api from '../../configs';
import { useNavigate } from 'react-router-dom';
import userStore from '../../zustand';
import styles from './index.module.scss';
import Logo from '../../components/Logo';

const Login = () => {
  const koiImg =
    'https://firebasestorage.googleapis.com/v0/b/koi-auction-backend.appspot.com/o/shortVideo.mp4?alt=media&token=d9603a4e-40f5-4e02-b32e-ea06e652625e';
  console.log('Render Login');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = userStore();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/security/login', values);

      if (response.data && response.data.token) {
        const userRole = response.data.role;
        if (userRole === 'Admin' || userRole === 'Staff') {
          login({
            ...response.data,
            isAuthenticated: true,
          });
          navigate('/');
        } else {
          throw new Error('403');
        }
      }
    } catch (error) {
      if (error.message === '403') {
        notification.error({
          message: 'Access Denied',
          description: 'You do not have permissions to access system.',
        });
      } else if (error.response) {
        notification.error({
          message: 'Login Failed',
          description: error.response.data,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginForm}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <h1 className={styles.h1}>Sign In Now</h1>

          <p className={styles.description}>Enter your email address and password to access your account.</p>
          <Form onFinish={onFinish}>
            <Form.Item name="userName" rules={[{ required: true, message: 'Please input your username or email!' }]}>
              <Input placeholder="Enter email or username" className={styles.input} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password placeholder="Enter your password" className={styles.input} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className={styles.btn}>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <span className={styles.forgotPassword} onClick={() => navigate('/forgotPassword')}>
            Forgot password?
          </span>
        </div>
        <div className={styles.loginBanner}>
          <video src={koiImg} autoPlay loop muted></video>
        </div>
      </div>
    </div>
  );
};

export default Login;
