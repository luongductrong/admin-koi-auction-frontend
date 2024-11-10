import React, { useState } from 'react';
import { Popover, Avatar, Button } from 'antd';
import { StarFilled } from '@ant-design/icons';
import api from '../../configs';
import styles from './index.module.scss';

const UserPopover = ({ userId, children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    if (!userData) {
      setLoading(true);
      try {
        const res = await api.get(`/admin-manager/users/get-user/${userId}`, {});
        setUserData(res.data);
      } catch (error) {
        setUserData('Failed to fetch user data');
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStars = (role) => {
    let starCount = 0;
    switch (role) {
      case 'Staff':
        starCount = 3;
        break;
      case 'Admin':
        starCount = 5;
        break;
      case 'Breeder':
        starCount = 1;
        break;
      default:
        starCount = 0;
        break;
    }
    return (
      <div>
        {[...Array(starCount)].map((_, index) => (
          <StarFilled key={index} style={{ color: 'gold', fontSize: '16px', marginRight: '2px' }} />
        ))}
      </div>
    );
  };

  const srcAvatar = (role) => {
    switch (role) {
      case 'Admin':
        return '/src/assets/adminAvt.png';
      case 'Staff':
        return '/src/assets/staffAvt.png';
      case 'Breeder':
        return '/src/assets/breederAvt.png';
      default:
        return '/src/assets/avt.jpg';
    }
  };

  const content = userData ? (
    <div className={styles['user-popover']}>
      <div className={styles['user-details']}>
        <Avatar src={srcAvatar(userData.role)} size={64} className={styles.avatar} />
        <div>
          <h3>{userData.fullName}</h3>
          {renderStars(userData.role)}
        </div>
      </div>
      <p>
        <b>Email:</b> {userData.email}
      </p>
      <p>
        <b>Phone:</b> {userData.phoneNumber}
      </p>
      <p>
        <b>Role:</b> {userData.role}
      </p>
      <div className={styles.actions}>
        <Button type="primary" className={styles['chat-button']}>
          Chat
        </Button>
        <Button type="default" className={styles['mail-button']}>
          Mail
        </Button>
      </div>
    </div>
  ) : (
    'No data available'
  );

  return (
    <Popover content={content} title="User Details" trigger="hover" placement="right" onClick={fetchUserData}>
      <span style={{ cursor: 'pointer' }} onMouseEnter={fetchUserData}>
        {children || <Avatar src="/src/assets/avt.jpg" />}
      </span>
    </Popover>
  );
};

export default UserPopover;
