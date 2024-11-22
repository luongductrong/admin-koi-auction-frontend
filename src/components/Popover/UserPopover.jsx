import React, { useState } from 'react';
import { Popover, Avatar, Button } from 'antd';
import { StarFilled } from '@ant-design/icons';
import api from '../../configs';
import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';
import adminAvt from '../../assets/adminAvt.png';
import staffAvt from '../../assets/staffAvt.png';
import breederAvt from '../../assets/breederAvt.png';
import DefaultAvt from '../../assets/avt.jpg';

const UserPopover = ({ userId, children }) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    if (!userData) {
      setLoading(true);
      try {
        const res = await api.get(`/admin-manager/users/get-user/${userId}`, {});
        setUserData(res.data);
      } catch (error) {
        setUserData(t('component.popover.fetch_data_failed'));
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

  const avt = (role) => {
    switch (role) {
      case 'Admin':
        return adminAvt;
      case 'Staff':
        return staffAvt;
      case 'Breeder':
        return breederAvt;
      default:
        return DefaultAvt;
    }
  };

  const content = userData ? (
    <div className={styles['user-popover']}>
      <div className={styles['user-details']}>
        <Avatar src={avt(userData.role)} size={64} className={styles.avatar} />
        <div>
          <h3>{userData.fullName}</h3>
          {renderStars(userData.role)}
        </div>
      </div>
      <p>
        <b>{t('component.popover.email')}:</b> {userData.email}
      </p>
      <p>
        <b>{t('component.popover.phone_number')}:</b> {userData.phoneNumber}
      </p>
      <p>
        <b>{t('component.popover.role')}:</b> {t(`component.popover.role_${userData.role}`)}
      </p>
      <div className={styles.actions}>
        <Button type="primary" className={styles['chat-button']}>
          {t('component.popover.chat_button')}
        </Button>
        <Button type="default" className={styles['mail-button']}>
          {t('component.popover.mail_button')}
        </Button>
      </div>
    </div>
  ) : (
    t('component.popover.no_data')
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
