import React from 'react';
import styles from './index.module.scss';

const Page404 = () => {
  console.log('render Page404');

  return (
    <div className={styles.container}>
      <img src="/src/assets/404.png" alt="404 Page" className={styles.image} />
    </div>
  );
};

export default Page404;
