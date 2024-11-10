import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../configs';
import styles from './index.module.scss';
import { LoadingOutlined } from '@ant-design/icons';
import Logo from '../../components/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isTokenFieldVisible, setIsTokenFieldVisible] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(59);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (remainingTime > 0 && isTokenFieldVisible && !isTokenExpired) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setIsTokenExpired(true);
    }
    return () => clearInterval(timer);
  }, [remainingTime, isTokenFieldVisible, isTokenExpired]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (otp) {
        console.log('fetch reset password api');

        await api.post('/forgot-password/verifyAndChangePassword', {
          otp,
          email,
          changePassword: {
            password,
            repeatPassword: confirmPassword,
          },
        });
        message.success('Password changed successfully.');
        navigate('/login');
      } else {
        console.log('fetch verify mail api');

        await api.post(`forgot-password/verifyMail/${email}`);
        message.success('Mail has been sent to your email.');
        setIsTokenFieldVisible(true);
        setRemainingTime(59);
        setIsTokenExpired(false);
      }
    } catch (error) {
      notification.error({
        message: 'Error: ' + (error.response?.status || 'Unknown'),
        description: error.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    await api.post(`forgot-password/verifyMail/${email}`);
    message.success('A new OTP has been sent.');
    setRemainingTime(59);
    setIsTokenExpired(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <Form onFinish={handleSubmit} className={styles.form}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item label="New Password" name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                return value && getFieldValue('password') === value
                  ? Promise.resolve()
                  : Promise.reject('Passwords do not match');
              },
            }),
          ]}
        >
          <Input.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Form.Item>
        {isTokenFieldVisible && (
          <>
            <Form.Item label="OTP" name="token" rules={[{ required: true }]}>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} disabled={isTokenExpired} />
            </Form.Item>
            <Form.Item label="OTP will expire in">
              <Input
                value={isTokenExpired ? 'Expired' : `${remainingTime}`}
                readOnly
                className={styles.countdownInput}
              />
            </Form.Item>
          </>
        )}
        <div>
          {isTokenExpired && (
            <Button className={styles.loginBtn} type="primary" onClick={handleResendToken}>
              Resend
            </Button>
          )}
        </div>
        <Button onClick={() => navigate('/login')} className={styles.loginBtn}>
          Back to Login
        </Button>
        <Button type="primary" htmlType="submit" className={styles.submitBtn}>
          {loading ? <Spin indicator={<LoadingOutlined spin style={{ color: 'white' }} />} /> : 'Submit'}
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPassword;
