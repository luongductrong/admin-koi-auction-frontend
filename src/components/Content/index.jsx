import React from 'react';
import styles from './index.module.scss';
import { Layout } from 'antd';

const { Content } = Layout;

const ContentComponent = React.memo(({ children }) => {
  console.log('render ContentComponent');

  return <Content className={styles.content}>{children}</Content>;
});

export default ContentComponent;
