import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../../../../auth/AuthProvider'; // Assuming this is where AuthProvider is

import {
  faHome,
  faChartLine,
  faCogs,
  faSignOutAlt,
  faEnvelope,
  faUsers,
  faBlog,
  faListCheck,
  faScaleBalanced,
  faFileContract,
  faHandshakeSimple,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Handler for logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = [
    {
      key: '1',
      icon: <FontAwesomeIcon icon={faHome} />,
      label: <Link to="/">Dashboard</Link>, // Use Link for routing
    },
    {
      key: 'sub1',
      icon: <FontAwesomeIcon icon={faListCheck} />,
      label: 'Management',
      children: [
        {
          key: '2',
          label: <Link to="/request">Request</Link>, // Use Link for routing
          icon: <FontAwesomeIcon icon={faListCheck} />,
        },
        {
          key: '3',
          label: <Link to="/user">User</Link>, // Use Link for routing
          icon: <FontAwesomeIcon icon={faUsers} />,
        },
        {
          key: '4',
          label: <Link to="/chart">Charts</Link>, // Use Link for routing
          icon: <FontAwesomeIcon icon={faChartLine} />,
        },
      ],
    },
    {
      key: 'sub2',
      icon: <FontAwesomeIcon icon={faHandshakeSimple} />,
      label: 'Services',
      children: [
        {
          key: '5',
          label: <Link to="/chat">Chat</Link>, // Use Link for routing
          icon: <FontAwesomeIcon icon={faCommentDots} />,
        },
        {
          key: '6',
          label: <Link to="/email">Email</Link>, // Use Link for routing
          icon: <FontAwesomeIcon icon={faEnvelope} />,
        },
        {
          key: '7',
          label: <Link to="/blog">Blogs</Link>, // Use Link for routing
          icon: <FontAwesomeIcon icon={faBlog} />,
        },
      ],
    },
    {
      key: 'sub3',
      icon: <FontAwesomeIcon icon={faCogs} />,
      label: 'Settings',
      children: [
        {
          key: '8',
          label: <Link to="/rule">Rules</Link>, // Use Link for routing
          icon: <FontAwesomeIcon icon={faScaleBalanced} />,
        },
        {
          key: '9',
          label: <Link to="/requirement">Requirements</Link>, // Use Link for routing
          icon: <FontAwesomeIcon icon={faFileContract} />,
        },
      ],
    },
    {
      key: '10',
      icon: <FontAwesomeIcon icon={faSignOutAlt} />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Menu
      mode="inline"
      style={{ height: '100%', width: 200, position: 'fixed', left: 0, top: 64, borderRight: 0 }}
      items={items}
    />
  );
};

export default Sidebar;
