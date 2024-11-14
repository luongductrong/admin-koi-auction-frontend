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
  faCartShopping,
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
        label: <Link to="/">{t('component.sidebar.dashboard')}</Link>,
        className: styles.menuItem,
      },
      {
        key: 'sub1',
        icon: <FontAwesomeIcon icon={faListCheck} />,
        label: t('component.sidebar.management'),
        className: styles.subMenuItem,
        children: [
          {
            key: '/management/requests',
            label: <Link to="/management/request">{t('component.sidebar.requests')}</Link>,
            icon: <FontAwesomeIcon icon={faListCheck} />,
            className: styles.menuItem,
          },
          {
            key: '/management/orders',
            label: <Link to="/management/order">{t('component.sidebar.orders')}</Link>,
            icon: <FontAwesomeIcon icon={faCartShopping} />,
            className: styles.menuItem,
          },
          role === 'Admin' && {
            key: '/management/auctions',
            label: <Link to="/management/auction">{t('component.sidebar.auctions')}</Link>,
            icon: <FontAwesomeIcon icon={faFileContract} />,
            className: styles.menuItem,
          },
          role === 'Admin' && {
            key: '/management/transactions',
            label: <Link to="/management/transaction">{t('component.sidebar.transactions')}</Link>,
            icon: <FontAwesomeIcon icon={faWallet} />,
            className: styles.menuItem,
          },
          role === 'Admin' && {
            key: '/management/users',
            label: <Link to="/management/user">{t('component.sidebar.users')}</Link>,
            icon: <FontAwesomeIcon icon={faUsers} />,
            className: styles.menuItem,
          },
        ].filter(Boolean),
      },
      {
        key: 'sub2',
        icon: <FontAwesomeIcon icon={faHandshakeSimple} />,
        label: t('component.sidebar.services'),
        className: styles.subMenuItem,
        children: [
          {
            key: '/services/chat',
            label: <Link to="/services/chat">{t('component.sidebar.chat')}</Link>,
            icon: <FontAwesomeIcon icon={faCommentDots} />,
            className: styles.menuItem,
          },
          {
            key: '/services/email',
            label: <Link to="/services/email">{t('component.sidebar.email')}</Link>,
            icon: <FontAwesomeIcon icon={faEnvelope} />,
            className: styles.menuItem,
          },
          {
            key: '/services/blog',
            label: <Link to="/services/blog">{t('component.sidebar.blogs')}</Link>,
            icon: <FontAwesomeIcon icon={faBlog} />,
            className: styles.menuItem,
          },
        ],
      },
      role === 'Admin' && {
        key: '9',
        icon: <FontAwesomeIcon icon={faCogs} />,
        label: <Link to="/setting">{t('component.sidebar.settings')}</Link>,
        className: styles.menuItem,
      },
      {
        key: '10',
        icon: <FontAwesomeIcon icon={faSignOutAlt} />,
        label: t('component.sidebar.logout'),
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
