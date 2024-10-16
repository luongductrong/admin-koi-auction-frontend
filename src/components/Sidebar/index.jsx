import React, { useMemo } from 'react';
import { Layout, Menu, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChartLine,
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
import useUserStore from '../../configs/useUserStore';

const { Sider } = Layout;

const SidebarComponent = React.memo(({ collapsed, setCollapsed }) => {
  console.log('render SidebarComponent');
  const { logout } = useUserStore();
  const navigate = useNavigate();

  //Tránh việc reRender kể cả khi props không thay đổi
  const role = useMemo(() => localStorage.getItem('role'), []);

  const handleLogout = () => {
    console.log('logging out');

    logout();

    console.log('navigate to login');

    navigate('/login');
  };

  const items = useMemo(
    () => [
      {
        key: '1',
        icon: <FontAwesomeIcon icon={faHome} />,
        label: <Link to="/">Dashboard</Link>,
      },
      {
        key: 'sub1',
        icon: <FontAwesomeIcon icon={faListCheck} />,
        label: 'Management',
        children: [
          {
            key: '2',
            label: <Link to="/request">Requests</Link>,
            icon: <FontAwesomeIcon icon={faListCheck} />,
          },
          {
            key: '3',
            label: <Link to="/auction">Auctions</Link>,
            icon: <FontAwesomeIcon icon={faFileContract} />,
          },
          role === 'Admin' && {
            key: '4',
            label: <Link to="/transaction">Transactions</Link>,
            icon: <FontAwesomeIcon icon={faWallet} />,
          },
          role === 'Admin' && {
            key: '5',
            label: <Link to="/user">Users</Link>,
            icon: <FontAwesomeIcon icon={faUsers} />,
          },
          {
            key: '1000',
            label: <Link to="/chart">Charts</Link>,
            icon: <FontAwesomeIcon icon={faChartLine} />,
          },
          //tránh việc render ra undefined
        ].filter(Boolean),
      },
      {
        key: 'sub2',
        icon: <FontAwesomeIcon icon={faHandshakeSimple} />,
        label: 'Services',
        children: [
          {
            key: '6',
            label: <Link to="/chat">Chat</Link>,
            icon: <FontAwesomeIcon icon={faCommentDots} />,
          },
          {
            key: '7',
            label: <Link to="/email">Email</Link>,
            icon: <FontAwesomeIcon icon={faEnvelope} />,
          },
          {
            key: '8',
            label: <Link to="/blog">Blogs</Link>,
            icon: <FontAwesomeIcon icon={faBlog} />,
          },
        ],
      },
      {
        key: '9',
        icon: <FontAwesomeIcon icon={faCogs} />,
        label: 'Setting',
      },
      {
        key: '10',
        icon: <FontAwesomeIcon icon={faSignOutAlt} />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
    [role],
  );

  return (
    <Sider collapsible collapsed={collapsed} trigger={null} width={200} className={styles.sider}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className={styles.collapseButton}
      />
      <Menu mode="inline" className={styles.menu} items={items} />
    </Sider>
  );
});

export default SidebarComponent;