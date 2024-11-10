import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbNameMap = {
  '/': 'Dashboard',
  '/management': 'Management',
  '/management/request': 'Requests',
  '/management/auction': 'Auctions',
  '/management/transaction': 'Transactions',
  '/management/user': 'Users',
  '/services': 'Services',
  '/services/chat': 'Chats',
  '/services/email': 'Emails',
  '/services/blog': 'Blogs',
  '/setting': 'Setting',
  '/profile': 'Profile',
};

function BreadcrumbComponent() {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url] || '404'}</Link>,
    };
  });

  const items = [
    {
      key: 'home',
      title: <Link to="/">Dashboard</Link>,
    },
    ...breadcrumbItems,
  ];

  return <AntBreadcrumb items={items} separator="/" style={{ margin: '10px' }} />;
}

export default BreadcrumbComponent;
