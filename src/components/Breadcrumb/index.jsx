import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BreadcrumbComponent() {
  const { t } = useTranslation();
  const breadcrumbNameMap = {
    '/': t('component.breadcrumb.dashboard'),
    '/management': t('component.breadcrumb.management'),
    '/management/request': t('component.breadcrumb.requests'),
    '/management/auction': t('component.breadcrumb.auctions'),
    '/management/transaction': t('component.breadcrumb.transactions'),
    '/management/order': t('component.breadcrumb.orders'),
    '/management/user': t('component.breadcrumb.users'),
    '/services': t('component.breadcrumb.services'),
    '/services/chat': t('component.breadcrumb.chat'),
    '/services/email': t('component.breadcrumb.email'),
    '/services/blog': t('component.breadcrumb.blogs'),
    '/setting': t('component.breadcrumb.settings'),
    '/profile': t('component.breadcrumb.profile'),
  };
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
      title: <Link to="/">{t('component.breadcrumb.dashboard')}</Link>,
    },
    ...breadcrumbItems,
  ];

  return <AntBreadcrumb items={items} separator="/" style={{ margin: '10px' }} />;
}

export default BreadcrumbComponent;
