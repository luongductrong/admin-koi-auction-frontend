import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import api from '../../configs';
import { useNavigate } from 'react-router-dom';
import userStore from '../../zustand';
import styles from './index.module.scss';
import Logo from '../../components/Logo';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
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
          message: t('page.login.access_denied'),
          description: t('page.login.access_denied_desc'),
        });
      } else if (error.response) {
        notification.error({
          message: t('page.login.login_failed'),
          description: t('page.login.login_failed_desc'),
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
          <h1 className={styles.h1}>{t('page.login.sign_in_now')}</h1>

          <p className={styles.description}>{t('page.login.desc')}</p>
          <Form onFinish={onFinish}>
            <Form.Item
              name="userName"
              rules={[{ required: true, message: t('page.login.please_input_email_or_email') }]}
            >
              <Input placeholder={t('page.login.enter_email_or_email')} className={styles.input} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: t('page.login.please_input_password') }]}>
              <Input.Password placeholder={t('page.login.enter_password')} className={styles.input} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className={styles.btn}>
                {t('page.login.sign_in_submit')}
              </Button>
            </Form.Item>
          </Form>

          <span className={styles.forgotPassword} onClick={() => navigate('/forgotPassword')}>
            {t('page.login.forgot_password')}
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
