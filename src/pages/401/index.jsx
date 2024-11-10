import React from 'react';
import styles from './index.module.scss';

const Page401 = () => {
  console.log('render Page401');

  return (
    <div className={styles.container}>
      <img src="src/assets/401.png" alt="401 Page" className={styles.image} />
    </div>
  );
};

export default Page401;
