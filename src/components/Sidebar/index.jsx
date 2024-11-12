import React, { useMemo, useState } from 'react';
import { Layout, Menu, Button, ConfigProvider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faCogs,
  faSignOutAlt,
  faEnvelope,
  faUsers,
  faBlog,
  faListCheck,
  faWallet,
  faFileContract,
  faHandshakeSimple,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import userStore from '../../zustand';
import { useTranslation } from 'react-i18next';

const { Sider } = Layout;

const SidebarComponent = React.memo(() => {
  console.log('render SidebarComponent');

  const { t } = useTranslation();
  const { logout } = userStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = userStore();
  const role = useMemo(() => user.role, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = useMemo(
    () => [
      {
        key: '1',
        icon: <FontAwesomeIcon icon={faHouse} />,
        label: <Link to="/">{t('componnent.sidebar.dashboard')}</Link>,
        className: styles.menuItem,
      },
      {
        key: 'sub1',
        icon: <FontAwesomeIcon icon={faListCheck} />,
        label: t('componnent.sidebar.management'),
        className: styles.subMenuItem,
        children: [
          {
            key: '/management/requests',
            label: <Link to="/management/request">{t('componnent.sidebar.requests')}</Link>,
            icon: <FontAwesomeIcon icon={faListCheck} />,
            className: styles.menuItem,
          },
          role === 'Admin' && {
            key: '/management/auctions',
            label: <Link to="/management/auction">{t('componnent.sidebar.auctions')}</Link>,
            icon: <FontAwesomeIcon icon={faFileContract} />,
            className: styles.menuItem,
          },
          role === 'Admin' && {
            key: '/management/transactions',
            label: <Link to="/management/transaction">{t('componnent.sidebar.transactions')}</Link>,
            icon: <FontAwesomeIcon icon={faWallet} />,
            className: styles.menuItem,
          },
          role === 'Admin' && {
            key: '/management/users',
            label: <Link to="/management/user">{t('componnent.sidebar.users')}</Link>,
            icon: <FontAwesomeIcon icon={faUsers} />,
            className: styles.menuItem,
          },
        ].filter(Boolean),
      },
      {
        key: 'sub2',
        icon: <FontAwesomeIcon icon={faHandshakeSimple} />,
        label: t('componnent.sidebar.services'),
        className: styles.subMenuItem,
        children: [
          {
            key: '/services/chat',
            label: <Link to="/services/chat">{t('componnent.sidebar.chat')}</Link>,
            icon: <FontAwesomeIcon icon={faCommentDots} />,
            className: styles.menuItem,
          },
          {
            key: '/services/email',
            label: <Link to="/services/email">{t('componnent.sidebar.email')}</Link>,
            icon: <FontAwesomeIcon icon={faEnvelope} />,
            className: styles.menuItem,
          },
          {
            key: '/services/blog',
            label: <Link to="/services/blog">{t('componnent.sidebar.blogs')}</Link>,
            icon: <FontAwesomeIcon icon={faBlog} />,
            className: styles.menuItem,
          },
        ],
      },
      role === 'Admin' && {
        key: '9',
        icon: <FontAwesomeIcon icon={faCogs} />,
        label: <Link to="/setting">{t('componnent.sidebar.settings')}</Link>,
        className: styles.menuItem,
      },
      {
        key: '10',
        icon: <FontAwesomeIcon icon={faSignOutAlt} />,
        label: t('componnent.sidebar.logout'),
        onClick: handleLogout,
        className: styles.menuItem,
      },
    ],
    [role, t],
  );

  return (
    <Sider collapsible collapsed={collapsed} trigger={null} width={200} className={styles.sider}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className={styles.collapseButton}
      />
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBg: '#F5F5F5',
              itemColor: '#D4163C',
              itemHoverColor: '#D4163A',
              itemSelectedBg: '#D4163C',
              itemSelectedColor: '#fff',
              subMenuItemBg: '#F5F5F5',
            },
          },
        }}
      >
        <Menu mode="inline" className={styles.menu} items={items} />
      </ConfigProvider>
    </Sider>
  );
});

export default SidebarComponent;
