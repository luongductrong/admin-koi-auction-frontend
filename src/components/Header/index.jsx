import React, { useState } from 'react';
import Logo from '../Logo';
import { Layout, Switch, Dropdown, Menu, Badge, Button } from 'antd';
import { BellFilled, GlobalOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import userStore, { themeStore } from '../../zustand';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const { Header } = Layout;

const HeaderComponent = React.memo(() => {
  console.log('render HeaderComponent');

  // const [notificationCount, setNotificationCount] = useState(5);
  const { user } = userStore();
  const navigate = useNavigate();
  const fullName = user.fullname;
  const { isDarkMode, toggleTheme } = themeStore();
  const { t } = useTranslation();

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
  };

  const languageMenu = (
    <Menu
      onClick={({ key }) => {
        handleLanguageChange(key);
      }}
      items={[
        { key: 'en', label: 'English' },
        { key: 'vi', label: 'Tiếng Việt' },
        { key: 'jp', label: '日本語' },
      ]}
    />
  );

  return (
    <Header className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles['header-container']}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles['header-controls']}>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren={t('component.header.dark')}
            unCheckedChildren={t('component.header.light')}
            className={styles['dark-light-switch']}
          />
          <Dropdown overlay={languageMenu} trigger={['click']}>
            <span className={styles.language}>
              <GlobalOutlined />
            </span>
          </Dropdown>

          <div className={styles.noti}>
            <Badge count={100} overflowCount={99} className={styles.badge} />
            <BellFilled />
          </div>
          <Button
            className={styles.user}
            onClick={() => {
              navigate('/profile');
            }}
          >
            {fullName}
          </Button>
        </div>
      </div>
    </Header>
  );
});

export default HeaderComponent;
